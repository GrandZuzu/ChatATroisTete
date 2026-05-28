# Benchmark — outils no-code pour refaire le site « Le Chat à 3 Têtes »

> Ticket #484 — *Site web · benchmark*
> Objectif : trouver un outil type **WordPress / Wix / Odoo**, **gratuit** et
> **utilisable par des non-développeur·euse·s**, capable de recréer un site
> équivalent à la version actuelle du repo, afin que la troupe puisse gérer
> son site sans dépendre d'un dev.
> Date du benchmark : **mai 2026**.

---

## 1. Ce que fait le site actuel (le cahier des charges implicite)

La version dans le repo est un site **Next.js 15 + Supabase + Vercel** (donc
codée, pas no-code). Pour benchmarker un remplaçant no-code, on liste d'abord
les fonctions à reproduire :

| Fonction du site actuel | Détail | Criticité |
|---|---|---|
| **Vitrine one-page** | Hero, présentation de la troupe, présentation du spectacle (*Les Sœurs en Répèt'*), contact | 🔴 Indispensable |
| **Galerie photo** | 12 photos optimisées, lightbox (zoom, navigation clavier) | 🔴 Indispensable |
| **Blog public** | Liste d'articles, fiche article, tags, SEO de base | 🟠 Important |
| **Espace admin pour publier** | Rédaction/édition d'articles par un·e non-dev, upload d'image de couverture | 🔴 Indispensable (c'est tout l'enjeu : autonomie de la troupe) |
| **Domaine personnalisé** | À terme `lechata3tetes.fr` | 🟠 Important (à terme) |
| **Réseaux sociaux** | Lien Instagram ; à terme publication d'articles vers Instagram | 🟢 Bonus |
| **Coût** | **Gratuit** (ou quasi) | 🔴 Contrainte du ticket |
| **Hébergement** | Inclus, sans maintenance technique | 🔴 Indispensable |

> ⚠️ La **publication automatique vers Instagram** (présente dans le code via
> l'API Graph Meta) n'est offerte nativement par **aucun** des outils no-code
> grand public. Tous permettent en revanche d'**afficher un flux Instagram**
> et de mettre un lien. On considère donc cette fonction comme un *bonus*
> hors périmètre du gratuit.

---

## 2. Outils évalués

Cinq candidats sérieux pour ce profil (vitrine + galerie + blog, gratuit,
non-dev), plus deux mentions. Webflow est écarté d'emblée : **pas d'offre
gratuite réelle** (plan le plus bas ~15 $/mois) et trop technique pour des
non-dev.

1. **Wix**
2. **WordPress.com**
3. **Odoo** (Website Builder)
4. **Framer**
5. **Google Sites**
6. Mentions : **Webador**, **Site123**

---

## 3. Tableau comparatif

| Critère | **Wix** | **WordPress.com** | **Odoo Website** | **Framer** | **Google Sites** |
|---|---|---|---|---|---|
| **Prise en main non-dev** | ⭐⭐⭐⭐⭐ Glisser-déposer très guidé | ⭐⭐⭐⭐ Éditeur de blocs | ⭐⭐⭐ Orienté « business », un peu dense | ⭐⭐⭐⭐ Visuel, moderne | ⭐⭐⭐⭐⭐ Ultra simple |
| **Qualité des templates / design** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ Basique |
| **Galerie photo + lightbox** | ✅ Native, riche | ✅ Native | ✅ Bloc galerie | ✅ Composants | ⚠️ Carrousel/grille basique |
| **Blog intégré** | ✅ App Blog | ✅✅ Le meilleur (c'est son ADN) | ✅ App Blog | ✅ CMS (10 collections) | ❌ Pas de vrai blog/CMS |
| **Admin pour la troupe** | ✅ Simple | ✅ Simple, multi-auteurs | ✅ Back-office complet | ✅ Éditeur en ligne | ✅ Via compte Google |
| **Domaine perso sur l'offre gratuite** | ❌ Sous-domaine `wixsite.com` | ❌ Sous-domaine `wordpress.com` | ✅ **Gratuit 1ʳᵉ année** | ❌ Sous-domaine `framer.app` | ✅ **Gratuit** (si domaine déjà possédé) |
| **Pub / branding imposé (gratuit)** | ⚠️ Bandeau Wix | ⚠️ Pubs WordPress.com | ✅ Aucun | ⚠️ Badge « Made in Framer » | ✅ Aucun |
| **Stockage (gratuit)** | 500 Mo | ~1 Go | Inclus, sans limite affichée | Généreux | Lié au Drive (15 Go partagés) |
| **SEO** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ Basique |
| **Flux / lien Instagram** | ✅ Widget | ✅ Bloc | ✅ Bloc | ✅ Composant | ⚠️ Intégration manuelle |
| **Open source / anti lock-in** | ❌ Propriétaire | ⚠️ Export possible (WordPress) | ✅ Open source | ❌ Propriétaire | ❌ Propriétaire |
| **Coût pour un site « propre »** (domaine perso + sans pub) | ~11–17 €/mois | ~4–8 €/mois (plan Personnel) | **0 € la 1ʳᵉ année** puis domaine à renouveler | ~5 €/mois (plan Mini) | **0 €** (hors achat du domaine ~10 €/an) |

*(Étoiles = appréciation qualitative ; ✅/⚠️/❌ = présence/réserve/absence.)*

---

## 4. Analyse par outil

### 🥇 Wix — le plus polyvalent pour des non-dev
- **Pour** : l'éditeur glisser-déposer le plus abouti, d'excellents templates,
  galerie photo riche, app Blog correcte, énorme communauté/tutos en français.
  Idéal pour que la troupe construise et fasse évoluer le site seule.
- **Contre** : l'offre **gratuite** impose un sous-domaine `…wixsite.com` et un
  bandeau Wix, stockage 500 Mo, pas de Google Analytics. Pour un rendu
  professionnel (domaine `lechata3tetes.fr`, sans pub) il faut un plan payant
  (~11–17 €/mois, **domaine offert la 1ʳᵉ année**).
- **Verdict** : meilleur compromis fonctionnalités/simplicité. « Gratuit » pour
  tester ; petit budget mensuel pour la version publique.

### 🥈 WordPress.com — le meilleur pour le blog
- **Pour** : le moteur de blog de référence (catégories, tags, SEO, multi-auteurs),
  parfait si la troupe veut surtout **publier régulièrement**. Contenu
  exportable (pas de lock-in fort).
- **Contre** : version gratuite avec **pubs WordPress.com** et sous-domaine ;
  pas de plugins/thèmes premium. Domaine perso + sans pub = plan **Personnel**
  (~4–8 €/mois).
- **Verdict** : à privilégier si le **blog** est le cœur du besoin plus que le
  design vitrine.

### 🥉 Odoo Website — le seul vraiment gratuit avec domaine
- **Pour** : politique **« One App Free »** → l'app Website (avec Blog) est
  gratuite *à vie*, **sans pub**, hébergement inclus, et **nom de domaine
  offert la 1ʳᵉ année**. Open source (pas de lock-in). Configurateur IA.
- **Contre** : interface orientée gestion d'entreprise (ERP), un peu plus
  intimidante pour des non-dev ; le domaine n'est offert que la 1ʳᵉ année ;
  écosystème pensé pour grandir vers des apps payantes.
- **Verdict** : **le meilleur rapport “gratuit / fonctionnalités / domaine”** si
  la troupe accepte une prise en main un peu moins ludique que Wix.

### Framer — le plus design
- **Pour** : rendu très moderne, CMS gratuit (jusqu'à 10 collections → blog OK),
  galeries et animations soignées. Offre gratuite généreuse.
- **Contre** : domaine perso uniquement en payant (~5 €/mois) ; badge
  « Made in Framer » sur le gratuit ; un cran plus « designer » que Wix.
- **Verdict** : excellent si on veut un site **très esthétique** et qu'un petit
  budget domaine est acceptable.

### Google Sites — le plus simple et 100 % gratuit
- **Pour** : totalement gratuit, **domaine perso gratuit** (si on possède déjà
  le nom), aucune pub, prise en main immédiate pour quiconque a un compte Google.
- **Contre** : **pas de vrai blog/CMS**, design et SEO limités, galerie basique.
  Insuffisant pour reproduire fidèlement le site actuel (blog + galerie soignée).
- **Verdict** : dépannage gratuit pour une vitrine minimale, **pas** pour
  l'ambition blog + galerie du projet.

### Mentions
- **Webador** : seul acteur « vraiment gratuit » avec stockage illimité sur
  l'offre de base ; simple, mais design et blog plus limités. Bon plan
  d'appoint.
- **Site123** : gratuit sans limite de durée, très guidé, mais templates et
  personnalisation plus pauvres.

---

## 5. Recommandation

Le choix dépend de l'arbitrage **« vraiment 0 € »** vs **« le plus simple /
le plus joli »** :

| Priorité de la troupe | Outil recommandé |
|---|---|
| **Tout gratuit, domaine perso inclus, et on accepte une UI un peu “pro”** | **Odoo Website** (One App Free) |
| **Le plus simple et le plus complet, petit budget OK (~10 €/mois)** | **Wix** |
| **Publier beaucoup d'articles (blog au centre)** | **WordPress.com** |
| **Site très design, petit budget OK** | **Framer** |
| **Vitrine minimale, zéro budget, zéro complexité** | **Google Sites** |

**Recommandation principale : commencer par Wix en version gratuite** pour
maquetter (galerie + blog + vitrine) sans engagement, puis :
- soit basculer sur un **plan Wix payant** (~10 €/mois, domaine offert 1 an) si
  la troupe veut la solution la plus simple à faire vivre ;
- soit, si le budget doit rester à **0 €**, partir sur **Odoo Website**
  (domaine offert la 1ʳᵉ année, sans pub) en acceptant une prise en main
  légèrement plus technique.

> 💡 **Quel que soit l'outil**, acheter tôt le domaine `lechata3tetes.fr`
> (~10 €/an chez un registrar FR) : il reste réutilisable d'un outil à l'autre
> et évite de dépendre d'un sous-domaine.

---

## 6. Points d'attention pour la migration

- **Récupérer les contenus existants** : textes de la home, 12 photos de la
  galerie (`public/assets/gallery/*.webp`), logo (`public/assets/logo.jpg`),
  et les éventuels articles déjà en base Supabase.
- **Instagram** : aucun outil no-code ne republie automatiquement vers
  Instagram comme le fait le code actuel. Prévoir une publication manuelle ou
  un outil tiers (Buffer/Later) si ce besoin est confirmé.
- **SEO / URLs** : conserver des URLs propres pour le blog (`/blog/<slug>`).
- **Pérennité** : privilégier les outils permettant l'**export** du contenu
  (WordPress.com, Odoo open source) pour éviter d'être enfermé.

---

*Benchmark réalisé pour le ticket #484. Sources : pages officielles et
comparatifs Wix, WordPress.com, Odoo, Framer/Webflow, Google Sites (mai 2026).*
