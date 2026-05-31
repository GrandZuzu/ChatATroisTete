/**
 * InstaContact — cœur logique (framework-agnostique).
 *
 * ⚠️ Lis d'abord InstaContact/README.md : récupérer les comptes qui ont
 * *liké* un post et leur envoyer un DM **n'est pas possible** via l'API
 * officielle (et le faire par scraping viole les CGU d'Instagram → bannissement
 * + spam). Ce module implémente l'alternative **conforme** : le « Comment-to-DM ».
 *
 * Principe (mécanisme officiel « Private Replies » de Meta) :
 *   1. On liste les *commentaires* d'un de tes posts (autorisé par l'API).
 *   2. On envoie à chaque commentateur **une** réponse privée (DM), dans la
 *      fenêtre des 7 jours suivant son commentaire.
 *
 * Contrairement aux likes, les commentaires SONT exposés par l'API et un DM
 * en réponse à un commentaire EST autorisé. C'est exactement le pattern
 * « commente MOT-CLÉ → reçois le lien en DM » utilisé par des outils comme
 * ManyChat.
 *
 * Pré-requis (voir docs/META-INSTAGRAM-SETUP.md) :
 *  - Compte Instagram Business/Creator lié à une Page Facebook
 *  - App Meta validée pour `instagram_manage_comments` (lire les commentaires)
 *    et `instagram_manage_messages` (envoyer les réponses privées)
 *  - Long-lived access token côté serveur (INSTAGRAM_ACCESS_TOKEN)
 */

const GRAPH_VERSION = "v21.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

/** Fenêtre Meta pour répondre en privé à un commentaire : 7 jours. */
export const PRIVATE_REPLY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type IgComment = {
  id: string;
  username: string;
  text: string;
  /** ISO 8601, ex. "2026-05-30T18:04:11+0000" */
  timestamp: string;
};

export type DmResult = {
  username: string;
  commentId: string;
  status: "sent" | "skipped" | "error" | "planned";
  /** Raison du skip / message d'erreur / aperçu en dry-run. */
  detail?: string;
};

export type CampaignReport = {
  dryRun: boolean;
  /** Nb de commentaires bruts récupérés sur le post. */
  fetched: number;
  /** Nb de destinataires retenus après filtres (mot-clé, fenêtre, dédup). */
  targeted: number;
  results: DmResult[];
};

export type CampaignInput = {
  igUserId: string;
  accessToken: string;
  /** ID du média (post) — pas son shortcode. Voir README pour le récupérer. */
  mediaId: string;
  /**
   * Message à envoyer. `{username}` est remplacé par le pseudo du
   * commentateur (sans @).
   */
  template: string;
  /**
   * Optionnel : n'envoyer qu'aux commentaires contenant ce mot-clé
   * (insensible à la casse). Ex. "INFO".
   */
  keyword?: string;
  /** Si true (défaut), n'envoie rien : renvoie juste l'aperçu des DM prévus. */
  dryRun?: boolean;
  /** Délai entre deux envois (anti rate-limit). Défaut 1100 ms. */
  delayMs?: number;
  /** Plafond de sécurité sur le nombre d'envois. Défaut 200. */
  maxSends?: number;
  /** Horloge injectable (tests). Défaut Date.now. */
  now?: () => number;
  /** Pause injectable (tests). Défaut setTimeout. */
  sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function graphGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || res.statusText || "Erreur Graph API";
    throw new Error(`Instagram: ${message}`);
  }
  return data as T;
}

/**
 * Récupère TOUS les commentaires d'un média (suit la pagination).
 * Le token doit porter la permission `instagram_manage_comments`.
 */
export async function fetchAllComments(opts: {
  mediaId: string;
  accessToken: string;
  /** Garde-fou pour ne pas paginer à l'infini. Défaut 20 pages. */
  maxPages?: number;
}): Promise<IgComment[]> {
  const { mediaId, accessToken, maxPages = 20 } = opts;
  const out: IgComment[] = [];
  let url =
    `${GRAPH}/${mediaId}/comments` +
    `?fields=id,username,text,timestamp&limit=50` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  for (let page = 0; page < maxPages && url; page++) {
    const data = await graphGet<{
      data: IgComment[];
      paging?: { next?: string };
    }>(url);
    if (Array.isArray(data.data)) out.push(...data.data);
    url = data.paging?.next ?? "";
  }
  return out;
}

/**
 * Envoie UNE réponse privée (DM) à un commentaire, via le mécanisme officiel
 * Private Replies. Le token doit porter `instagram_manage_messages`.
 *
 * Doc Meta : POST /{ig-user-id}/messages
 *   { recipient: { comment_id }, message: { text } }
 */
export async function sendPrivateReply(opts: {
  igUserId: string;
  accessToken: string;
  commentId: string;
  text: string;
}): Promise<{ recipientId?: string; messageId?: string }> {
  const res = await fetch(
    `${GRAPH}/${opts.igUserId}/messages?access_token=${encodeURIComponent(
      opts.accessToken
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { comment_id: opts.commentId },
        message: { text: opts.text },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || res.statusText || "Erreur Graph API";
    throw new Error(`Instagram: ${message}`);
  }
  return { recipientId: data?.recipient_id, messageId: data?.message_id };
}

function renderTemplate(template: string, username: string): string {
  return template.replaceAll("{username}", username);
}

/**
 * Sélectionne les commentaires à contacter à partir d'une liste brute :
 *  - filtre par mot-clé (optionnel)
 *  - ne garde que les commentaires dans la fenêtre des 7 jours
 *  - déduplique par utilisateur (garde le commentaire le plus récent éligible)
 *
 * Exporté à part pour être testable sans appels réseau.
 */
export function selectRecipients(
  comments: IgComment[],
  opts: { keyword?: string; now?: number } = {}
): IgComment[] {
  const now = opts.now ?? Date.now();
  const kw = opts.keyword?.trim().toLowerCase();

  const eligible = comments.filter((c) => {
    if (kw && !c.text?.toLowerCase().includes(kw)) return false;
    const ts = Date.parse(c.timestamp);
    if (Number.isNaN(ts)) return false;
    return now - ts <= PRIVATE_REPLY_WINDOW_MS;
  });

  // Dédup par username : on garde le commentaire le plus récent (le plus de
  // marge dans la fenêtre des 7 jours), 1 DM par personne max.
  const byUser = new Map<string, IgComment>();
  for (const c of eligible) {
    const key = (c.username || "").toLowerCase();
    if (!key) continue;
    const prev = byUser.get(key);
    if (!prev || Date.parse(c.timestamp) > Date.parse(prev.timestamp)) {
      byUser.set(key, c);
    }
  }
  return [...byUser.values()];
}

/**
 * Orchestration complète d'une campagne « Comment-to-DM ».
 * En dry-run (défaut), n'envoie RIEN — renvoie l'aperçu des DM qui seraient
 * envoyés. Idéal pour vérifier la cible et le message avant de lancer.
 */
export async function runCommentToDmCampaign(
  input: CampaignInput
): Promise<CampaignReport> {
  const {
    igUserId,
    accessToken,
    mediaId,
    template,
    keyword,
    dryRun = true,
    delayMs = 1100,
    maxSends = 200,
    now = Date.now,
    sleep = defaultSleep,
  } = input;

  if (!template.trim()) throw new Error("Le message (template) est vide.");

  const comments = await fetchAllComments({ mediaId, accessToken });
  const recipients = selectRecipients(comments, { keyword, now: now() }).slice(
    0,
    maxSends
  );

  const results: DmResult[] = [];

  for (const c of recipients) {
    const text = renderTemplate(template, c.username);

    if (dryRun) {
      results.push({
        username: c.username,
        commentId: c.id,
        status: "planned",
        detail: text,
      });
      continue;
    }

    try {
      await sendPrivateReply({ igUserId, accessToken, commentId: c.id, text });
      results.push({ username: c.username, commentId: c.id, status: "sent" });
    } catch (err) {
      results.push({
        username: c.username,
        commentId: c.id,
        status: "error",
        detail: (err as Error).message,
      });
    }
    if (delayMs > 0) await sleep(delayMs);
  }

  return {
    dryRun,
    fetched: comments.length,
    targeted: recipients.length,
    results,
  };
}
