import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <p>© {year} Le Chat à 3 Têtes — Tous droits réservés.</p>
        <nav aria-label="Liens secondaires">
          <Link href="/#association">L&apos;association</Link>
          <Link href="/#spectacle">Le spectacle</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
