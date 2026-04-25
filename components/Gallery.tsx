"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PHOTOS: { thumb: string; full: string; alt: string }[] = [
  { thumb: "/assets/gallery/01-thumb.webp", full: "/assets/gallery/01.webp", alt: "La troupe en cercle dans le jardin." },
  { thumb: "/assets/gallery/02-thumb.webp", full: "/assets/gallery/02.webp", alt: "Discussion autour d'un script en plein soleil." },
  { thumb: "/assets/gallery/03-thumb.webp", full: "/assets/gallery/03.webp", alt: "Travail en groupe sous l'arbre." },
  { thumb: "/assets/gallery/04-thumb.webp", full: "/assets/gallery/04.webp", alt: "Deux comédiennes répètent leur scène." },
  { thumb: "/assets/gallery/05-thumb.webp", full: "/assets/gallery/05.webp", alt: "La troupe en mouvement, vue de dos." },
  { thumb: "/assets/gallery/06-thumb.webp", full: "/assets/gallery/06.webp", alt: "Cercle d'écoute au cours de la répétition." },
  { thumb: "/assets/gallery/07-thumb.webp", full: "/assets/gallery/07.webp", alt: "Moment de concentration au soleil." },
  { thumb: "/assets/gallery/08-thumb.webp", full: "/assets/gallery/08.webp", alt: "Mise en place d'une scène autour du palmier." },
  { thumb: "/assets/gallery/09-thumb.webp", full: "/assets/gallery/09.webp", alt: "Vue d'ensemble du jardin pendant la répétition." },
  { thumb: "/assets/gallery/10-thumb.webp", full: "/assets/gallery/10.webp", alt: "Direction d'acteur·rice·s, gestes en l'air." },
  { thumb: "/assets/gallery/11-thumb.webp", full: "/assets/gallery/11.webp", alt: "Échanges entre comédien·ne·s." },
  { thumb: "/assets/gallery/12-thumb.webp", full: "/assets/gallery/12.webp", alt: "Cercle énergique en fin de session." },
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocus.current?.focus();
  }, []);

  const navigate = useCallback(
    (delta: number) => {
      setOpenIndex((idx) => {
        if (idx === null) return idx;
        const n = PHOTOS.length;
        return (idx + delta + n) % n;
      });
    },
    []
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, navigate]);

  const current = openIndex !== null ? PHOTOS[openIndex] : null;

  return (
    <>
      <ul className="gallery" role="list">
        {PHOTOS.map((p, i) => (
          <li key={p.thumb}>
            <button
              type="button"
              className="gallery-item"
              onClick={() => open(i)}
              aria-label={`Agrandir la photo ${i + 1}`}
            >
              <img src={p.thumb} alt={p.alt} loading="lazy" width={600} height={450} />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button className="lightbox-close" aria-label="Fermer" onClick={close}>×</button>
          <button className="lightbox-prev" aria-label="Photo précédente" onClick={() => navigate(-1)}>‹</button>
          <button className="lightbox-next" aria-label="Photo suivante" onClick={() => navigate(1)}>›</button>
          <figure className="lightbox-frame">
            <img src={current.full} alt={current.alt} />
            <figcaption className="lightbox-caption">{current.alt}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
