import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Article } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single<Article>();

  if (!article) return { title: "Article introuvable" };

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      tags: article.tags,
    },
  };
}

export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single<Article>();

  if (!article) notFound();

  return (
    <>
      <Nav />
      <main>
        <article className="article-page">
          <p className="eyebrow">
            <Link href="/blog" style={{ color: "inherit" }}>← Retour au blog</Link>
          </p>
          <h1>{article.title}</h1>
          <div className="blog-meta" style={{ marginBottom: "1rem" }}>
            <time dateTime={article.published_at ?? undefined}>
              {formatDate(article.published_at)}
            </time>
            {article.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="blog-tags" style={{ marginTop: 0 }}>
                  {article.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {article.cover_image_url && (
            <img
              src={article.cover_image_url}
              alt=""
              className="article-cover"
            />
          )}

          {article.excerpt && (
            <p style={{ fontSize: "1.15rem", color: "var(--c-muted)", marginBottom: "2rem" }}>
              {article.excerpt}
            </p>
          )}

          <div className="article-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
