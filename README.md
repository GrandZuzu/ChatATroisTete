# Le Chat à 3 Têtes

Site web de la troupe de comédie musicale **Le Chat à 3 Têtes**.
Premier spectacle : *Les Sœurs en Répèt'*.

Stack : **Next.js 15** (App Router, TypeScript) · **Supabase**
(auth, Postgres, storage) · **Vercel** (hébergement). Publication directe
des articles vers **Instagram** via l'API Graph (feed / story).

---

## Fonctionnalités

- 🏠 **Page d'accueil** : présentation de la troupe, du spectacle, galerie
  de répétition
- 📰 **Blog public** (`/blog`) : liste, fiche article, tags, SEO de base
- 🔒 **Espace admin** (`/admin`) : auth Supabase par lien magique, CRUD
  articles, upload d'image de couverture, publication
- 📷 **Publication Instagram** : depuis l'admin, en feed ou story (sous
  réserve d'app Meta validée)

---

## Setup local

### Pré-requis

- **Node.js 20+** (idéalement 22)
- Un projet **Supabase** (gratuit) — https://supabase.com
- (Plus tard) Un compte **Vercel** et une **app Meta**

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer un projet Supabase

1. https://supabase.com → **New project**
2. Note l'URL du projet et la clé `anon` (Project Settings → API)
3. **SQL Editor** → coller le contenu de `supabase/schema.sql` → **Run**
4. **Authentication → Providers → Email** :
   - Désactiver « **Allow new users to sign up** » (pour empêcher les
     inscriptions sauvages)
   - Activer le **Magic Link**
5. **Authentication → Users** → **Invite user** ou **Add user**, mets ton
   email — il sera le compte admin
6. **Authentication → URL Configuration** :
   - **Site URL** : `http://localhost:3000` (puis l'URL Vercel en prod)
   - **Redirect URLs** : ajoute aussi
     `http://localhost:3000/api/auth/callback`

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplis au minimum :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API → `service_role`)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Les variables Instagram peuvent rester vides au début (le bouton renverra
une erreur 503 explicite).

### 4. Lancer le dev server

```bash
npm run dev
```

→ http://localhost:3000

Connexion admin : http://localhost:3000/admin/login → saisis l'email que tu
as invité dans Supabase → reçois un lien magique → tu es connecté·e.

---

## Déploiement (Vercel)

1. Push ce repo sur GitHub (déjà fait)
2. https://vercel.com/new → importe `GrandZuzu/ChatATroisTete`
3. Framework preset détecté automatiquement (**Next.js**)
4. **Environment Variables** : copie le contenu de `.env.local` ici aussi
5. Met `NEXT_PUBLIC_SITE_URL` à l'URL Vercel (sans slash final)
6. **Deploy**
7. Dans Supabase → Authentication → URL Configuration : ajoute l'URL
   Vercel à **Site URL** ET aux **Redirect URLs**
   (`https://ton-app.vercel.app/api/auth/callback`)

---

## Médias (photos / vidéos)

Les **photos** servies par le site se trouvent dans `public/assets/`. Les
photos optimisées de la galerie sont commitées
(`public/assets/gallery/*.webp`).

Les **photos brutes** et le **cache d'optimisation** sont dans
`public/assets/photos/` et `public/assets/photos-web/` — **gitignorés**
(trop lourds pour le repo). Gardés en local pour réutilisation.

Scripts utiles dans `scripts/` :

```bash
# Optimise public/assets/photos/*.jpg → public/assets/photos-web/*.webp
python scripts/optimize-photos.py

# Sélectionne un sous-ensemble curé pour la galerie publique
python scripts/curate-gallery.py
```

(Nécessite Python 3 + Pillow : `pip install Pillow`)

---

## Instagram

Voir [docs/META-INSTAGRAM-SETUP.md](docs/META-INSTAGRAM-SETUP.md) — guide
pas-à-pas pour :

- Passer le compte Instagram en Business / Creator
- Créer la Page Facebook liée
- Créer l'app Meta + récupérer les tokens
- Faire valider la permission `instagram_content_publish`

Tant que cette validation Meta n'est pas en place, le bouton « Publier sur
Instagram » dans l'admin renvoie une erreur explicite.

---

## Structure du projet

```
.
├─ app/
│  ├─ layout.tsx              # layout racine (fonts, meta)
│  ├─ page.tsx                # page d'accueil
│  ├─ globals.css             # styles globaux (palette + composants)
│  ├─ blog/
│  │  ├─ page.tsx             # /blog (liste publique)
│  │  └─ [slug]/page.tsx      # /blog/<slug>
│  ├─ admin/
│  │  ├─ layout.tsx           # shell admin (topbar)
│  │  ├─ page.tsx             # /admin (liste articles)
│  │  ├─ login/               # /admin/login (magic link)
│  │  └─ articles/
│  │     ├─ actions.ts        # server actions save/delete
│  │     ├─ ArticleForm.tsx
│  │     ├─ new/page.tsx
│  │     └─ [id]/page.tsx
│  └─ api/
│     ├─ auth/callback/       # callback Supabase
│     └─ instagram/publish/   # POST → publish to IG
├─ components/                # Nav, Footer, Gallery (lightbox)
├─ lib/
│  ├─ articles.ts             # types + helpers
│  ├─ instagram.ts            # client Graph API
│  └─ supabase/               # clients browser/server + middleware
├─ middleware.ts              # gate /admin
├─ supabase/schema.sql
├─ docs/META-INSTAGRAM-SETUP.md
├─ scripts/                   # optim photos
└─ public/assets/             # statiques (logo, gallery)
```

---

## Roadmap

- ✅ Site vitrine + galerie
- ✅ Blog admin + public
- ✅ Squelette Instagram (en attente de validation Meta)
- ⏭ Auto-refresh du token IG (cron)
- ⏭ Reels (vidéo + polling du statut container)
- ⏭ Programmation différée des publications
- ⏭ Domaine personnalisé (lechata3tetes.fr ?)
