/**
 * Helpers Instagram Graph API.
 *
 * Pré-requis :
 *  - Compte Instagram Business ou Creator
 *  - Lié à une Page Facebook
 *  - App Meta validée pour la permission `instagram_content_publish`
 *  - Long-lived access token stocké côté serveur
 *
 * Pour la stratégie de publication, on utilise le flux à 2 temps de
 * l'API Graph :
 *   1. POST {ig-user-id}/media        → renvoie un creation_id
 *   2. POST {ig-user-id}/media_publish → publie le creation_id
 *
 * Voir docs/META-INSTAGRAM-SETUP.md pour le setup pas-à-pas.
 */

const GRAPH_VERSION = "v21.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

export type IgFormat = "feed" | "story" | "reel";

type CreateContainerInput = {
  igUserId: string;
  accessToken: string;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  format: IgFormat;
};

async function call<T>(url: string, params: Record<string, string>): Promise<T> {
  const body = new URLSearchParams(params);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || res.statusText || "Erreur Graph API";
    throw new Error(`Instagram: ${message}`);
  }
  return data as T;
}

export async function createMediaContainer(input: CreateContainerInput): Promise<string> {
  const { igUserId, accessToken, format, caption, imageUrl, videoUrl } = input;
  const params: Record<string, string> = { access_token: accessToken };
  if (caption) params.caption = caption;

  if (format === "feed") {
    if (!imageUrl) throw new Error("imageUrl requis pour le format feed");
    params.image_url = imageUrl;
  } else if (format === "story") {
    if (imageUrl) {
      params.image_url = imageUrl;
      params.media_type = "STORIES";
    } else if (videoUrl) {
      params.video_url = videoUrl;
      params.media_type = "STORIES";
    } else {
      throw new Error("imageUrl ou videoUrl requis pour le format story");
    }
  } else if (format === "reel") {
    if (!videoUrl) throw new Error("videoUrl requis pour le format reel");
    params.media_type = "REELS";
    params.video_url = videoUrl;
  }

  const data = await call<{ id: string }>(`${GRAPH}/${igUserId}/media`, params);
  return data.id;
}

export async function publishMediaContainer(opts: {
  igUserId: string;
  accessToken: string;
  creationId: string;
}): Promise<string> {
  const data = await call<{ id: string }>(`${GRAPH}/${opts.igUserId}/media_publish`, {
    creation_id: opts.creationId,
    access_token: opts.accessToken,
  });
  return data.id;
}

/**
 * Publication "tout-en-un" — combine create + publish.
 * Pour les reels, l'API requiert d'attendre que le statut du container
 * soit FINISHED avant publish — non implémenté ici (v1 = feed/story photo).
 */
export async function publish(input: CreateContainerInput): Promise<string> {
  const creationId = await createMediaContainer(input);
  return publishMediaContainer({
    igUserId: input.igUserId,
    accessToken: input.accessToken,
    creationId,
  });
}
