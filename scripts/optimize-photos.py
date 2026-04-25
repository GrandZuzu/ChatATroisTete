"""
Optimise les photos brutes de assets/photos/ en versions web légères.

Sortie :
- assets/photos-web/{name}.webp     (large, max 1600px)
- assets/photos-web/{name}-thumb.webp (miniature, max 600px)

Conserve l'orientation EXIF et le ratio.
"""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos"
DST = ROOT / "assets" / "photos-web"

LARGE_MAX = 1600
THUMB_MAX = 600
LARGE_QUALITY = 80
THUMB_QUALITY = 75


def fit(img, max_side):
    w, h = img.size
    if max(w, h) <= max_side:
        return img.copy()
    if w >= h:
        new_w = max_side
        new_h = round(h * (max_side / w))
    else:
        new_h = max_side
        new_w = round(w * (max_side / h))
    return img.resize((new_w, new_h), Image.LANCZOS)


def main():
    DST.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    if not files:
        print("Aucune photo trouvée dans", SRC)
        return

    total_in = 0
    total_out = 0

    for i, src in enumerate(files, 1):
        total_in += src.stat().st_size
        try:
            with Image.open(src) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")

                large = fit(im, LARGE_MAX)
                large_path = DST / f"{src.stem}.webp"
                large.save(large_path, "WEBP", quality=LARGE_QUALITY, method=6)

                thumb = fit(im, THUMB_MAX)
                thumb_path = DST / f"{src.stem}-thumb.webp"
                thumb.save(thumb_path, "WEBP", quality=THUMB_QUALITY, method=6)

                size_l = large_path.stat().st_size
                size_t = thumb_path.stat().st_size
                total_out += size_l + size_t
                print(f"[{i:2d}/{len(files)}] {src.name}  "
                      f"-> {size_l/1024:.0f} KB  + thumb {size_t/1024:.0f} KB")
        except Exception as e:
            print(f"[ERREUR] {src.name}: {e}")

    print()
    print(f"Total entrée : {total_in/1024/1024:.1f} MB")
    print(f"Total sortie : {total_out/1024/1024:.1f} MB")
    print(f"Réduction    : {(1 - total_out/total_in)*100:.1f} %")


if __name__ == "__main__":
    main()
