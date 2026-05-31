# InstaContact

> Outil pour transformer l'engagement d'un post Instagram en messages privés
> (DM), **sans enfreindre les règles d'Instagram**.

## TL;DR — la demande initiale n'est pas réalisable telle quelle

Le ticket #486 demandait : *« prendre tous les comptes Instagram qui ont liké
un post et leur envoyer un DM »*.

**Ce n'est pas possible** — ni techniquement via l'API officielle, ni
légalement via du contournement :

1. **On ne peut pas récupérer la liste des comptes qui ont liké.** L'API Graph
   d'Instagram expose le *nombre* de likes (`like_count`) mais **jamais la
   liste des comptes**. L'ancien endpoint `/likes` qui le permettait a été
   supprimé en 2018–2020 (dépréciation de l'« Instagram Legacy API »), pour des
   raisons de vie privée. Aucune permission ne le réactive.

2. **On ne peut pas envoyer de DM « à froid ».** L'API de messagerie Instagram
   interdit les messages non sollicités. On ne peut écrire à quelqu'un que :
   - dans une fenêtre de **24 h après que *lui* t'a écrit en premier**, ou
   - via **une** réponse privée à **un commentaire** (ou une mention en story),
     dans les **7 jours**.

   Il n'existe **aucun** moyen officiel d'initier un DM vers un compte qui ne
   t'a pas contacté.

3. **Le faire « quand même » par scraping = bannissement + spam.** Passer par
   l'app mobile non officielle ou un bot pour scraper les likers et leur
   envoyer des DM automatiques **viole les Conditions d'utilisation et la
   Platform Policy de Meta**. Conséquences concrètes : *action block*,
   *shadowban*, voire **suppression définitive du compte** de la troupe — et
   c'est, par définition, du **spam** envoyé à des gens qui n'ont rien demandé.
   À ne pas faire.

> En résumé : *liker* est une action « anonyme » côté API. *Commenter* ne l'est
> pas. La seule passerelle conforme entre un post et un DM passe par les
> **commentaires**.

---

## La solution conforme : « Comment-to-DM »

Au lieu des likes, on s'appuie sur les **commentaires**, qui eux sont
exposés par l'API **et** ouvrent droit à une réponse privée :

```
Post  ──►  "Commente INFO et je t'envoie le lien en DM 🎭"
              │
              ▼
        commentaires (lisibles via l'API)
              │
              ▼
   1 réponse privée (DM) par personne, sous 7 jours  ✅ autorisé par Meta
```

C'est exactement le pattern « commente un mot-clé → reçois un DM » qu'utilisent
les outils du marché (ManyChat, etc.). Mécanisme officiel Meta : **Private
Replies** (`POST /{ig-user-id}/messages` avec `recipient: { comment_id }`).

### Avantages

- 100 % conforme aux règles Meta → aucun risque pour le compte.
- Plus qualitatif : ne contacte que des gens qui ont **agi volontairement**
  (ils ont commenté), donc taux de réponse bien meilleur qu'un DM à froid.
- Réutilise le compte Business + le token déjà en place pour la publication.

### Limites à connaître

- **7 jours** : passé ce délai après le commentaire, l'API refuse la réponse
  privée. L'outil filtre automatiquement les commentaires trop vieux.
- **1 DM par personne** : l'outil déduplique par compte.
- **Rate limits** : on espace les envois (~1/s) et on plafonne (`maxSends`).
- Nécessite les permissions Meta **`instagram_manage_comments`** (lire les
  commentaires) et **`instagram_manage_messages`** (envoyer les DM), en plus du
  passage en compte Business — voir `docs/META-INSTAGRAM-SETUP.md`.

---

## Utilisation (interface admin)

1. Connecte-toi à l'admin → onglet **InstaContact** (`/admin/instacontact`).
2. Publie (ou as publié) un post avec un appel à l'action, ex. :
   *« Commente **INFO** et on t'envoie le lien de la billetterie en DM 🎭 »*.
3. Colle l'**ID du média** du post (voir ci-dessous), un **mot-clé** optionnel
   (ex. `INFO`) et ton **message** (`{username}` = pseudo du commentateur).
4. Clique **Aperçu (aucun envoi)** : tu vois la liste exacte des destinataires
   et le message qui partira, **sans rien envoyer**.
5. Si tout est bon → **Envoyer les DM**.

### Trouver l'ID d'un post

L'API ne comprend pas les URLs `instagram.com/p/xxxx`. Récupère les IDs
numériques de tes derniers posts :

```bash
curl -G "https://graph.facebook.com/v21.0/INSTAGRAM_BUSINESS_ID/media" \
  --data-urlencode "fields=id,caption,permalink,timestamp" \
  --data-urlencode "access_token=INSTAGRAM_ACCESS_TOKEN"
```

Repère le post voulu via sa `caption`/`permalink`, et copie son `id`.

---

## Structure

```
InstaContact/
├─ README.md                 # ce document
└─ lib/
   └─ instacontact.ts        # cœur logique (fetch commentaires + Private Replies)
```

Branché dans l'app Next.js :

```
app/
├─ admin/instacontact/
│  ├─ page.tsx               # page admin /admin/instacontact
│  └─ CommentToDmTool.tsx    # formulaire (aperçu + envoi)
└─ api/instagram/comment-dm/
   └─ route.ts               # POST — exécute la campagne (dry-run par défaut)
```

Le module `lib/instacontact.ts` est volontairement framework-agnostique et
testable : `selectRecipients()` (filtre mot-clé + fenêtre 7 j + dédup) est une
fonction pure, et `runCommentToDmCampaign()` accepte des `now`/`sleep`
injectables.

---

## Autres alternatives (si tu veux aller plus loin)

Selon l'objectif réel (« toucher les gens intéressés par le spectacle »),
d'autres approches conformes existent :

| Alternative | Idée | Conforme | Effort |
|---|---|---|---|
| **Comment-to-DM** (cet outil) | mot-clé en commentaire → DM | ✅ | faible |
| **Lien en bio / landing** | « lien en bio » → page d'inscription email | ✅ | faible |
| **Sticker question/lien en Story** | collecter des réponses, répondre en DM | ✅ | faible |
| **Pub Meta « objectif messages »** | DM sponsorisés à une audience ciblée (payant) | ✅ | moyen |
| **Newsletter / SMS opt-in** | capter les contacts qui consentent | ✅ | moyen |
| ~~Scraping des likers + DM auto~~ | — | ❌ interdit | — |

Pour la troupe, le combo gagnant : **un post « commente MOT-CLÉ »** +
**cet outil** + **une landing page d'inscription** (réutilise le blog/Supabase
déjà en place) pour garder le contact dans la durée.
