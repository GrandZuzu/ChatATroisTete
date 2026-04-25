import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/articles";
import { DeleteArticleButton } from "./articles/DeleteArticleButton";

export default async function AdminHome() {
  const supabase = await createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>Articles</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">
          + Nouvel article
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          Erreur de chargement : {error.message}.{" "}
          {error.message.includes("relation") || error.message.includes("does not exist")
            ? "Le schéma Supabase n'a peut-être pas été appliqué — vois supabase/schema.sql."
            : null}
        </div>
      )}

      {!error && (!articles || articles.length === 0) ? (
        <div className="empty">
          <p>Aucun article pour le moment.</p>
          <Link href="/admin/articles/new" className="btn btn-primary">Créer le premier</Link>
        </div>
      ) : null}

      {articles && articles.length > 0 && (
        <table className="article-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Tags</th>
              <th>Mis à jour</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(articles as Article[]).map((a) => (
              <tr key={a.id}>
                <td>
                  <Link href={`/admin/articles/${a.id}`}>
                    <strong>{a.title || "(sans titre)"}</strong>
                  </Link>
                  <div style={{ fontSize: 12, color: "var(--c-muted)" }}>/{a.slug}</div>
                </td>
                <td>
                  <span className={`status-pill status-${a.status}`}>
                    {a.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>
                  {a.tags.length === 0 ? "—" : a.tags.join(", ")}
                </td>
                <td style={{ fontSize: 13, color: "var(--c-muted)" }}>
                  {formatDate(a.updated_at)}
                </td>
                <td>
                  <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                    <Link href={`/admin/articles/${a.id}`} className="btn btn-outline" style={{ padding: ".4rem .9rem", fontSize: 13 }}>
                      Éditer
                    </Link>
                    {a.status === "published" && (
                      <Link
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        className="btn btn-outline"
                        style={{ padding: ".4rem .9rem", fontSize: 13 }}
                      >
                        Voir ↗
                      </Link>
                    )}
                    <DeleteArticleButton id={a.id} title={a.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
