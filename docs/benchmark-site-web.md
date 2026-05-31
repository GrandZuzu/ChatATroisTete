# Benchmark des solutions no-code pour le site du groupe

> Ticket #484 — Comparer les solutions de création de site web (no-code)
> Objectif : un site pro pour **Le Chat à 3 Têtes** sans coder.

## Contexte et besoins

Le groupe veut un site web professionnel qu'il puisse gérer **sans écrire de code**. Le besoin est volontairement simple :

- **Page unique** (one-page) présentant le groupe
- **Galerie photos** (répétitions, concerts)
- **Dates de concerts** (agenda mis à jour régulièrement)
- **Formulaire de contact** (booking, presse)

### Critères d'évaluation

| Critère | Pourquoi c'est important pour nous |
|---|---|
| **Prix** | Budget associatif/groupe émergent, on veut le coût annuel réel (hébergement + domaine). |
| **Facilité** | Mise à jour par les membres du groupe, pas par un dev. |
| **Design** | Rendu pro, responsive mobile, qualité des templates. |
| **Domaine perso** | `lechata3tetes.fr` au lieu d'un sous-domaine moche. |
| **Pub / branding imposé** | Aucune pub ni « Made with X » visible sur le site public. |

> ℹ️ Le repo contient **déjà** un site sur-mesure (Next.js + Supabase, déployé sur Vercel — voir `README.md`). Ce benchmark sert à décider si une solution no-code serait plus adaptée à la maintenance par le groupe, ou si on garde le site existant. La recommandation en tient compte.

---

## Tableau comparatif

Les prix sont indicatifs (TTC, abonnement **annuel**, tarifs constatés mi-2026) et concernent l'offre minimale permettant **domaine perso + suppression de la pub**. Un nom de domaine `.fr` coûte ~10-15 €/an, parfois offert la 1ʳᵉ année.

| Solution | Prix (offre utile) | Facilité | Design | Domaine perso | Pub / branding imposé | Galerie | Dates/agenda | Formulaire |
|---|---|---|---|---|---|---|---|---|
| **Wix** | ~13 €/mois (~156 €/an), plan « Light » | ⭐⭐⭐⭐ Très simple, éditeur drag & drop | ⭐⭐⭐⭐ Énormément de templates, parfois lourds | ✅ Inclus (domaine offert 1 an) | ✅ Supprimée dès le 1ᵉʳ plan payant | ✅ Natif | ✅ App « Events » | ✅ Natif |
| **Squarespace** | ~16 €/mois (~192 €/an), plan « Personal » | ⭐⭐⭐ Soigné mais moins libre | ⭐⭐⭐⭐⭐ Les plus beaux templates, orienté créatifs/musique | ✅ Inclus (domaine offert 1 an) | ✅ Aucune pub | ✅ Excellent (galeries soignées) | ✅ Natif | ✅ Natif |
| **Webflow** | ~14 €/mois (~168 €/an), plan « Basic » | ⭐⭐ Puissant mais courbe d'apprentissage réelle | ⭐⭐⭐⭐⭐ Contrôle total du design | ✅ Inclus | ✅ Aucune pub (plan payant) | ✅ Via CMS (à construire) | ⚠️ À construire soi-même (CMS) | ⚠️ Natif mais limité en gratuit |
| **WordPress.com** | ~8 €/mois (~96 €/an), plan « Personnel » | ⭐⭐⭐ Familier mais admin dense | ⭐⭐⭐⭐ Très flexible (thèmes) | ✅ Inclus (domaine offert 1 an) | ✅ Pub retirée dès le plan payant | ✅ Natif | ⚠️ Plugin requis (plugins limités en bas de gamme) | ⚠️ Plugin/Jetpack |
| **Carrd** | ~19 $/an (~18 €/an) Pro | ⭐⭐⭐⭐⭐ Le plus simple pour une one-page | ⭐⭐⭐ Sobre, élégant, limité | ✅ Inclus (Pro) | ✅ Supprimé en Pro | ⚠️ Galerie basique | ❌ Pas d'agenda dédié (liste manuelle) | ✅ Formulaire (Pro) |
| **Bandzoogle** | ~10 $/mois (~110 €/an) | ⭐⭐⭐⭐ Pensé pour musiciens | ⭐⭐⭐⭐ Templates orientés groupes | ✅ Inclus (domaine offert 1 an) | ✅ Aucune pub, **0 % commission** sur ventes | ✅ Natif | ✅ **Agenda concerts natif** | ✅ Natif (+ mailing list, vente musique) |
| **Site actuel (Next.js + Supabase)** | ~10-15 €/an (domaine seul ; Vercel + Supabase = 0 € en gratuit) | ⭐⭐ Nécessite un dev pour évoluer | ⭐⭐⭐⭐⭐ 100 % sur-mesure | ✅ | ✅ Aucune | ✅ Déjà en place | ✅ Admin sur-mesure | ✅ Déjà en place |

Légende facilité/design : ⭐ (faible) → ⭐⭐⭐⭐⭐ (excellent).

---

## Analyse par solution

### Wix
Le plus polyvalent. Éditeur visuel très accessible, app « Wix Events » pour les dates, galeries natives, formulaire intégré. Risque : templates parfois lourds (performance mobile) et difficulté à changer de template après coup. **Bon généraliste.**

### Squarespace
Le meilleur **design** prêt-à-l'emploi, très prisé des artistes et musiciens. Galeries photo superbes, agenda et formulaire natifs. Un peu plus cher, légèrement moins libre que Wix mais résultat plus pro sans effort. **Excellent si le visuel prime.**

### Webflow
Puissance proche du sur-mesure mais **vraie courbe d'apprentissage** : ce n'est pas réellement « no-code » pour un groupe sans profil technique. Surdimensionné pour une one-page. **À écarter pour ce besoin.**

### WordPress.com
Flexible et connu, mais l'agenda de concerts demande un plugin et les plugins sont bridés sur les plans bas de gamme. Admin plus dense que la moyenne. **Possible mais pas le plus simple.**

### Carrd
Imbattable en **simplicité et prix** pour une vraie one-page. Mais galerie basique et **pas d'agenda dédié** (dates à lister à la main). Si les dates de concerts deviennent un besoin central, il atteint vite ses limites. **Idéal pour une carte de visite, juste pour ce cas.**

### Bandzoogle
**Conçu spécifiquement pour les musiciens** : agenda de concerts natif, galeries, mailing list, vente de musique/merch **sans commission**, formulaire de contact. Tous nos besoins sont couverts d'origine, sans bricolage. Design correct et orienté groupes. **Le plus aligné avec notre cas d'usage.**

### Site actuel (Next.js + Supabase)
Déjà fonctionnel, gratuit à héberger (hors domaine), 100 % sur-mesure et sans aucune contrainte de pub. **Mais** chaque évolution demande un développeur — c'est précisément ce que le groupe veut éviter pour la gestion courante. À noter : l'espace admin existant permet déjà au groupe de mettre à jour dates et contenus **sans coder**, une fois le site en place.

---

## Recommandation

### 🥇 Recommandation principale : **Bandzoogle**

C'est la solution **la plus alignée avec nos besoins réels**. Tout ce qu'on demande — galerie, **dates de concerts en natif**, formulaire de contact, domaine perso, zéro pub — est intégré et pensé pour un groupe de musique, sans plugin ni bricolage. Prix raisonnable (~110 €/an, domaine inclus la 1ʳᵉ année) et autonomie totale du groupe pour les mises à jour.

### 🥈 Alternative selon la priorité

- **Si le design « waouh » prime** → **Squarespace** : les plus beaux templates, galeries superbes, agenda et formulaire natifs (~192 €/an).
- **Si le budget est la contrainte n°1 et qu'on accepte de gérer les dates à la main** → **Carrd Pro** (~18 €/an) : imbattable pour une one-page simple.
- **Polyvalence/familiarité grand public** → **Wix** (~156 €/an).

### 🤔 Et le site existant ?

Le repo contient déjà un site Next.js + Supabase complet avec **espace admin permettant au groupe de gérer dates et contenus sans coder**. Si cet admin couvre le besoin au quotidien, **garder le site existant reste l'option la moins chère** (~10-15 €/an de domaine, hébergement gratuit) et la plus flexible. La bascule vers une solution no-code ne se justifie que si la maintenance technique (déploiements, évolutions, dépannage) devient un frein réel pour le groupe.

| Scénario | Choix conseillé |
|---|---|
| Le groupe veut **tout gérer seul**, y compris l'évolution du site, sans aucun dev | **Bandzoogle** |
| On veut le **plus beau** rendu sans effort | **Squarespace** |
| **Budget minimal**, one-page suffisante | **Carrd Pro** |
| Un membre/ami gère la technique et l'admin existant suffit | **Garder le site Next.js actuel** |

---

*Document rédigé dans le cadre du ticket #484. Tarifs indicatifs à revérifier au moment de la souscription.*
