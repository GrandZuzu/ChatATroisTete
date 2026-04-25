import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="curtain curtain-left" />
            <div className="curtain curtain-right" />
          </div>
          <div className="container hero-inner">
            <img
              src="/assets/logo.jpg"
              alt=""
              className="hero-logo"
              width={120}
              height={120}
            />
            <p className="eyebrow">Troupe de comédie musicale</p>
            <h1 className="hero-title">
              Le Chat<br />
              <span className="accent">à 3 Têtes</span>
            </h1>
            <p className="hero-sub">
              Trois voix, mille histoires. Une troupe qui chante, danse et joue
              pour faire vibrer la scène.
            </p>
            <div className="hero-actions">
              <a href="#spectacle" className="btn btn-primary">Découvrir le spectacle</a>
              <a href="#contact" className="btn btn-ghost">Nous contacter</a>
            </div>
          </div>
        </section>

        <section id="association" className="section">
          <div className="container grid-2">
            <div>
              <p className="eyebrow">L&apos;association</p>
              <h2>Une troupe, une passion : la scène.</h2>
            </div>
            <div className="prose">
              <p>
                <strong>Le Chat à 3 Têtes</strong> est une jeune troupe de comédie
                musicale qui réunit chanteurs, danseurs et comédiens autour d&apos;un
                même feu sacré : l&apos;amour de la scène et du spectacle vivant.
              </p>
              <p>
                Portés par l&apos;envie de créer ensemble, nous mettons en commun
                nos talents pour donner vie à des spectacles fédérateurs, drôles
                et sincères — où l&apos;émotion et le rire ne sont jamais loin.
              </p>
              <ul className="badges">
                <li>Chant</li>
                <li>Danse</li>
                <li>Théâtre</li>
                <li>Mise en scène</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="spectacle" className="section section-dark">
          <div className="container">
            <div className="show-header">
              <p className="eyebrow eyebrow-light">Notre premier spectacle</p>
              <h2 className="show-title">
                Les Sœurs<br /><em>en Répèt&apos;</em>
              </h2>
              <p className="show-status"><span className="dot" /> En cours de création</p>
            </div>

            <div className="show-body">
              <p className="lede">
                Une troupe se prépare à monter <em>Sister Act</em>. Mais entre
                fous rires, fausses notes et grands moments d&apos;émotion, la
                répétition tourne au véritable spectacle.
              </p>
              <p>
                Une mise en abyme jubilatoire, où la coulisse devient la scène :
                on suit la troupe au plus près, dans ses doutes et ses éclats,
                pour un hommage tendre et déjanté à la passion du théâtre musical.
              </p>

              <div className="show-grid">
                <div className="show-card">
                  <h3>Le concept</h3>
                  <p>Une comédie musicale qui raconte les coulisses d&apos;une comédie musicale. La répétition comme spectacle.</p>
                </div>
                <div className="show-card">
                  <h3>L&apos;inspiration</h3>
                  <p>Librement inspiré de <em>Sister Act</em>, avec ses chœurs entraînants et son énergie contagieuse.</p>
                </div>
                <div className="show-card">
                  <h3>Le ton</h3>
                  <p>Drôle, sincère, généreux. Du rire, des larmes, et beaucoup de musique.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="galerie" className="section section-tinted">
          <div className="container">
            <div className="gallery-header">
              <p className="eyebrow">En coulisses</p>
              <h2>La troupe en répèt&apos;</h2>
              <p className="prose">
                Quelques moments volés à la troupe, en pleine création de notre
                premier spectacle.
              </p>
            </div>
            <Gallery />
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container grid-2">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Programmer, soutenir, rejoindre la troupe ?</h2>
              <p className="prose">
                Une salle, un festival, un projet en tête ? Écrivez-nous, on vous
                répond.
              </p>
            </div>
            <div className="contact-card">
              <dl className="contact-list">
                <div>
                  <dt>Email</dt>
                  <dd><a href="mailto:contact@lechata3tetes.fr">contact@lechata3tetes.fr</a></dd>
                </div>
                <div>
                  <dt>Téléphone</dt>
                  <dd><a href="tel:+33000000000">+33 0 00 00 00 00</a></dd>
                </div>
                <div>
                  <dt>Basée à</dt>
                  <dd>Ville à compléter</dd>
                </div>
                <div>
                  <dt>Réseaux</dt>
                  <dd>
                    <a
                      href="https://www.instagram.com/lechata3tetes/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @lechata3tetes
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="contact-note">Coordonnées provisoires — à mettre à jour.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
