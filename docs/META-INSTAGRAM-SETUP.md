# Setup Meta + Instagram — guide pas-à-pas

Ce document décrit toutes les démarches **manuelles** à faire côté Meta /
Instagram avant que le bouton « Publier sur Instagram » dans l'admin
fonctionne. Compte tenu des règles Meta, **aucune de ces étapes ne peut être
automatisée** — tu dois les faire toi-même avec ton compte personnel.

Compte estimé : **1 à 4 semaines** (la dernière étape est validée à la main
par Meta, ça peut être long).

---

## 1. Passer le compte Instagram en Business (ou Creator)

L'API Graph d'Instagram **ne fonctionne pas avec un compte personnel**.

1. Ouvre Instagram (mobile)
2. Profil → menu (☰) → **Paramètres et activité**
3. **Type et outils de compte** → **Passer à un compte professionnel**
4. Choisis une **catégorie** (« Artistes ») et un **type** :
   - **Créateur** : recommandé pour la troupe (artistes / créateurs de contenu)
   - **Entreprise** : si tu préfères afficher des coordonnées pro

> ⚠️ Tu peux repasser en compte personnel ensuite si tu veux. Aucun risque.

---

## 2. Créer une Page Facebook liée

L'API Instagram exige que le compte IG soit **lié à une Page Facebook**.

1. Va sur https://www.facebook.com/pages/create
2. Crée une Page (nom : « Le Chat à 3 Têtes », catégorie « Compagnie de
   théâtre » ou similaire)
3. Pas besoin de la rendre active publiquement — elle peut rester quasi-vide
4. Dans les paramètres de la Page → **Comptes liés** → ajouter Instagram

OU plus simple, depuis Instagram :

1. Profil → **Modifier le profil** → **Pages**
2. Connecte la Page Facebook que tu viens de créer

---

## 3. Créer une app Meta for Developers

1. Va sur https://developers.facebook.com/apps
2. Connecte-toi avec ton compte Facebook (celui qui administre la Page)
3. Clique **Créer une app**
4. Type d'app : choisis **Entreprise** (ou « Other » → « Business »)
5. Nom : `Le Chat à 3 Têtes Web` (n'importe quoi)
6. Email de contact : ton email
7. Clique **Créer une app**

Une fois l'app créée :

1. Tableau de bord → **Ajouter des produits**
2. Ajoute **Instagram Graph API** (et **Facebook Login** si proposé)
3. Note l'**App ID** et l'**App Secret** (Settings → Basic)

---

## 4. Récupérer un access token long-lived

L'API renvoie d'abord un token à courte durée (1 h). On l'échange contre un
token longue durée (60 jours).

### Étape A — token utilisateur court (1h)

1. Va sur https://developers.facebook.com/tools/explorer
2. En haut à droite, sélectionne ton app
3. **User or Page** : User Token
4. **Permissions** — coche au minimum :
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
   - `business_management`
5. Clique **Generate Access Token** → autorise dans le popup
6. Copie le token affiché (commence par `EAA…`)

### Étape B — échange contre un token long (60 jours)

Dans un terminal, remplace les valeurs et lance :

```bash
curl -G "https://graph.facebook.com/v21.0/oauth/access_token" \
  --data-urlencode "grant_type=fb_exchange_token" \
  --data-urlencode "client_id=APP_ID" \
  --data-urlencode "client_secret=APP_SECRET" \
  --data-urlencode "fb_exchange_token=TOKEN_COURT"
```

→ tu reçois un `access_token` valable **60 jours**.

### Étape C — récupérer l'`INSTAGRAM_BUSINESS_ID`

```bash
# 1. Lister tes pages Facebook (récupérer le PAGE_ID)
curl -G "https://graph.facebook.com/v21.0/me/accounts" \
  --data-urlencode "access_token=TOKEN_LONG"

# 2. Récupérer l'ID Instagram Business depuis la Page
curl -G "https://graph.facebook.com/v21.0/PAGE_ID" \
  --data-urlencode "fields=instagram_business_account" \
  --data-urlencode "access_token=TOKEN_LONG"
```

Le second appel renvoie un JSON du type :

```json
{ "instagram_business_account": { "id": "17841400000000000" } }
```

C'est l'`INSTAGRAM_BUSINESS_ID` à mettre dans `.env.local`.

---

## 5. App Review Meta — permission `instagram_content_publish`

Pour publier en **production** (autre que ton propre compte de test), Meta
exige une **revue manuelle** :

1. Tableau de bord de l'app → **Vérification de l'app** (App Review)
2. Demande la permission **`instagram_content_publish`**
3. Joins :
   - Une **vidéo** (≤ 5 min) montrant le bouton « Publier sur IG » dans ton
     admin → la création d'un post → la publication réussie sur IG
   - Une **description** : « Permettre à l'admin de la troupe de publier des
     photos et stories d'événements à venir directement depuis notre back-office »
   - L'URL de ton site déployé

> 💡 Tant que la revue n'est pas validée, **tu peux quand même tester** avec
> le compte associé à l'app et les comptes ajoutés en « Testeurs » (Settings
> → Roles).

Délai habituel : **2 jours à 3 semaines** selon la charge de Meta.

---

## 6. Renseigner les variables d'environnement

Une fois tout en main, dans `.env.local` (et dans Vercel → Project Settings
→ Environment Variables) :

```
INSTAGRAM_BUSINESS_ID=17841400000000000
INSTAGRAM_ACCESS_TOKEN=EAA…(long-lived 60j)
META_APP_ID=…
META_APP_SECRET=…
```

Le bouton « Publier sur Instagram » dans l'admin doit alors fonctionner.

---

## Limitations à connaître

- **Stories via API** : nécessite `instagram_content_publish` validé.
  Quota habituel : 25 stories / jour.
- **Reels via API** : possible mais nécessite que l'API attende le statut
  `FINISHED` du container avant publish — pas implémenté en v1.
- **Token de 60 jours** : doit être rafraîchi avant expiration. À automatiser
  dans une v2 (cron Vercel ou tâche Supabase).
- **Image / vidéo** : doit être à une **URL publique HTTPS**. C'est notre
  cas — les uploads sont sur Supabase Storage, bucket `article-images`,
  public.
- **Hashtags** : maximum 30 par post, et certains hashtags peuvent être
  rejetés par les filtres Meta.

---

## En résumé

| Étape | Effort | Délai |
|-------|--------|-------|
| 1. Compte IG → Business | 2 min | immédiat |
| 2. Page FB liée | 5 min | immédiat |
| 3. App Meta | 5 min | immédiat |
| 4. Tokens | 10 min | immédiat |
| 5. App Review | 30 min de prep | 2j–3sem |
| 6. Variables env | 1 min | immédiat |

Tant que la **revue n'est pas faite**, tu peux développer/tester avec ton
propre compte de testeur sans souci.
