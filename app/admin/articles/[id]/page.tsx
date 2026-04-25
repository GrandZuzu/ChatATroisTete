import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../ArticleForm";
import type { Article } from "@/lib/articles";

export const metadata = {
  title: "Édition d'article",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditArticle({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;

  const supabase = await createClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single<Article>();

  if (error || !article) notFound();

  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>Éditer : {article.title || "(sans titre)"}</h1>
        <Link href="/admin" className="btn btn-outline">← Retour</Link>
      </div>
      <div className="card">
        <ArticleForm article={article} saved={Boolean(saved)} />
      </div>
    </main>
  );
}
