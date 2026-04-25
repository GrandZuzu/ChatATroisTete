# Le Chat à 3 Têtes

Site web de la troupe de comédie musicale **Le Chat à 3 Têtes**.
Premier spectacle : *Les Sœurs en Répèt'*.

## Structure

- `index.html` — page unique (one-pager)
- `styles.css` — feuille de style (palette blanc / rouge / noir)
- `script.js` — interactions (menu mobile, année dynamique)
- `assets/` — visuels (logo, photos, etc.)

## Aperçu local

Ouvrir simplement `index.html` dans un navigateur,
ou lancer un serveur statique :

```bash
python -m http.server 8000
# puis http://localhost:8000
```

## À compléter

- Remplacer le logo SVG placeholder par le logo de la troupe (`assets/logo.png` puis adapter `index.html`).
- Mettre à jour les coordonnées (email, téléphone, ville).
- Ajouter visuels du spectacle, dates, billetterie quand disponibles.

## Mise en ligne (GitHub Pages)

1. Sur GitHub : *Settings → Pages*
2. Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`
3. Le site sera disponible à l'URL indiquée par GitHub.
