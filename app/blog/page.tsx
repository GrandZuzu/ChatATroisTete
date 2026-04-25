import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Article } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog",
  description: "Les actualités, coulisses et carnets de bord de la troupe.",
};

export const revalidate = 60;

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <Nav />
      <main>
        <section className="blog-hero">
          <div className="container">
            <p className="eyebrow">Carnet de bord</p>
            <h1>Le blog de la troupe</h1>
            <p>
              Coulisses, billets d&apos;humeur, étapes de création — suivez la
              vie de la troupe au fil des semaines.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {error && (
              <div className="alert alert-error">
                Erreur de chargement : {error.message}
              </div>
            )}

            {!error && (!articles || articles.length === 0) ? (
              <div className="empty">
                Pas encore d&apos;articles publiés. Reviens bientôt !
              </div>
            ) : null}

            {articles && articles.length > 0 && (
              <ul className="blog-list">
                {(articles as Article[]).map((a) => (
                  <li key={a.id} className="blog-card">
                    <Link href={`/blog/${a.slug}`}>
                      <div className="blog-card-cover">
                        {a.cover_image_url ? (
                          <img src={a.cover_image_url} alt="" />
                        ) : null}
                      </div>
                      <div className="blog-card-body">
                        <div className="blog-meta">
                          <time dateTime={a.published_at ?? undefined}>
                            {formatDate(a.published_at)}
                          </time>
                        </div>
                        <h3>{a.title}</h3>
                        {a.excerpt && (
                          <p className="blog-card-excerpt">{a.excerpt}</p>
                        )}
                        {a.tags.length > 0 && (
                          <div className="blog-tags">
                            {a.tags.map((t) => (
                              <span key={t} className="tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
