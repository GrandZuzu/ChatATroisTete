"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header" id="top">
      <div className="container nav-row">
        <Link href="/" className="brand" aria-label="Le Chat à 3 Têtes — accueil">
          <span className="brand-mark">
            <img src="/assets/logo.jpg" alt="Logo Le Chat à 3 Têtes" width={44} height={44} />
          </span>
          <span className="brand-text">
            <span className="brand-name">Le Chat à 3 Têtes</span>
            <span className="brand-tag">Troupe de comédie musicale</span>
          </span>
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav
          id="primary-nav"
          className={"primary-nav" + (open ? " is-open" : "")}
          aria-label="Navigation principale"
        >
          <Link href="/#association" onClick={close}>L&apos;association</Link>
          <Link href="/#spectacle" onClick={close}>Le spectacle</Link>
          <Link href="/#galerie" onClick={close}>Galerie</Link>
          <Link href="/blog" onClick={close}>Blog</Link>
          <Link href="/#contact" onClick={close}>Contact</Link>
          <a
            href="https://www.instagram.com/lechata3tetes/"
            className="nav-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </nav>
      </div>
    </header>
  );
}
