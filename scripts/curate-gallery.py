"""
Sélectionne un sous-ensemble varié de photos optimisées et les copie
dans assets/gallery/ avec des noms simples (01.webp, 01-thumb.webp, ...).
"""

from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "photos-web"
DST = ROOT / "assets" / "gallery"

SELECTION = [
    "IMG20260322135152",
    "IMG20260322135218",
    "IMG20260322135242",
    "IMG20260322135545",
    "IMG20260322135630",
    "IMG20260322135833",
    "IMG20260322135917",
    "IMG20260322141340",
    "IMG20260322141548",
    "IMG20260322141659",
    "IMG20260322141745",
    "IMG20260322141805",
]


def main():
    if DST.exists():
        for f in DST.iterdir():
            f.unlink()
    DST.mkdir(parents=True, exist_ok=True)

    for i, stem in enumerate(SELECTION, 1):
        for variant, suffix in [("", ""), ("-thumb", "-thumb")]:
            src = SRC / f"{stem}{variant}.webp"
            dst = DST / f"{i:02d}{suffix}.webp"
            if not src.exists():
                print(f"[SKIP] manquant : {src.name}")
                continue
            shutil.copy2(src, dst)
            print(f"  {dst.name}  <- {src.name}")

    total = sum(p.stat().st_size for p in DST.iterdir())
    print(f"\nTotal galerie : {total/1024/1024:.1f} MB ({len(list(DST.iterdir()))} fichiers)")


if __name__ == "__main__":
    main()
