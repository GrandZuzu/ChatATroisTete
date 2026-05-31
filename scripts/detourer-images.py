"""
Détoure les illustrations des personnages (fond transparent).

Chaque image source est une illustration à plat : un personnage cerné de
noir, placé sur un côté, devant un fond de couleur uni (jaune, violet,
vert...) parfois entouré d'un cadre noir et accompagné de texte.

Le détourage est fait par analyse de couleur (pas d'IA) car c'est fiable
et déterministe sur ce type d'aplats :
  1. on rogne le cadre noir éventuel (bandes pleines sur les bords) ;
  2. on repère la couleur de fond dominante et on rend transparent tout
     le fond relié aux bords de l'image ;
  3. on ne garde que la plus grande zone opaque restante : le personnage
     (le texte et les éléments flottants sont éliminés) ;
  4. on recadre sur le sujet pour supprimer les marges transparentes.

Entrée  : dossier des images brutes (défaut : dossier Instagram du ticket,
          surchargé par le 1er argument en ligne de commande).
Sortie  : public/assets/instagram/{nom}.png  (RGBA, fond transparent).

Dépendances : Pillow, numpy, scipy.
    pip install --user numpy scipy

Usage :
    python scripts/detourer-images.py
    python scripts/detourer-images.py "C:\\chemin\\vers\\images"
"""

import sys
from pathlib import Path

import numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent

# Dossier source par défaut (cf. ticket #485). Surchargeable via argv[1].
DEFAULT_SRC = Path(r"D:\Documents\Projets\Chat à trois tete\Instagram")
DST = ROOT / "public" / "assets" / "instagram"

EXTS = {".jpg", ".jpeg", ".png", ".webp"}

COLOR_TOL = 62        # distance RGB max. assimilée à la couleur de fond
DARK_THRESH = 80      # un pixel est « noir » si max(R,G,B) < ce seuil
FRAME_MAX = 0.10      # épaisseur de cadre détectable, en fraction du côté
FRAME_FILL = 0.85     # fraction de pixels noirs pour considérer une ligne de cadre
CROP_MARGIN = 12      # marge conservée autour du sujet, en pixels
FEATHER = 1.0         # adoucissement des bords (rayon de flou de l'alpha)


def trim_frame(rgb):
    """Retire les bandes pleinement noires sur les bords (cadre éventuel)."""
    dark = rgb.max(axis=2) < DARK_THRESH
    h, w = dark.shape

    def run(fractions, limit):
        n = 0
        while n < limit and fractions[n] >= FRAME_FILL:
            n += 1
        return n

    top = run(dark.mean(axis=1), int(h * FRAME_MAX))
    bottom = run(dark.mean(axis=1)[::-1], int(h * FRAME_MAX))
    left = run(dark.mean(axis=0), int(w * FRAME_MAX))
    right = run(dark.mean(axis=0)[::-1], int(w * FRAME_MAX))
    return rgb[top:h - bottom, left:w - right], (top, bottom, left, right)


def background_color(rgb):
    """Couleur de fond = teinte la plus fréquente (quantifiée par pas de 16)."""
    q = (rgb // 16 * 16).reshape(-1, 3)
    colors, counts = np.unique(q, axis=0, return_counts=True)
    return colors[counts.argmax()].astype(np.int16)


def cutout_alpha(rgb):
    """Calcule l'alpha : 255 sur le personnage, 0 sur le fond."""
    bg = background_color(rgb)
    dist = np.sqrt(((rgb.astype(np.float32) - bg) ** 2).sum(axis=2))
    bg_like = dist <= COLOR_TOL

    # Fond réel = zones « couleur de fond » reliées à un bord de l'image.
    lbl, _ = ndimage.label(bg_like)
    edge = np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]])
    edge_labels = np.setdiff1d(np.unique(edge), [0])
    background = np.isin(lbl, edge_labels)

    # Personnage = la plus grande zone opaque (élimine texte/îlots flottants).
    fg = ~background
    comp, n = ndimage.label(fg)
    if n == 0:
        return np.zeros(rgb.shape[:2], np.uint8)
    sizes = np.bincount(comp.ravel())
    sizes[0] = 0
    keep = (comp == sizes.argmax()) & ~bg_like  # perce les trous de fond enfermés

    alpha = np.where(keep, 255, 0).astype(np.uint8)
    if FEATHER:
        alpha = np.asarray(
            Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(FEATHER))
        )
    return alpha


def crop_to_subject(img, margin=CROP_MARGIN):
    """Recadre l'image RGBA sur la zone non transparente."""
    bbox = img.getbbox()
    if bbox is None:
        return img
    left, top, right, bottom = bbox
    return img.crop((
        max(0, left - margin),
        max(0, top - margin),
        min(img.width, right + margin),
        min(img.height, bottom + margin),
    ))


def detourer(srcfile):
    with Image.open(srcfile) as im:
        rgb = np.asarray(im.convert("RGB"))
    rgb, _ = trim_frame(rgb)
    alpha = cutout_alpha(rgb)
    rgba = np.dstack([rgb, alpha])
    return crop_to_subject(Image.fromarray(rgba, "RGBA"))


def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.is_dir():
        print(f"[ERREUR] Dossier source introuvable : {src}")
        sys.exit(1)

    files = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        print(f"Aucune image trouvée dans {src}")
        return

    DST.mkdir(parents=True, exist_ok=True)
    for i, srcfile in enumerate(files, 1):
        try:
            cut = detourer(srcfile)
            out = DST / f"{srcfile.stem.lower()}.png"
            cut.save(out, "PNG")
            print(f"[{i}/{len(files)}] {srcfile.name}  ->  "
                  f"{out.relative_to(ROOT)}  ({cut.width}x{cut.height})")
        except Exception as e:
            print(f"[ERREUR] {srcfile.name}: {e}")

    print(f"\nDétourage terminé. Fichiers dans : {DST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
