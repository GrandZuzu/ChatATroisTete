import Link from "next/link";
import { ArticleForm } from "../ArticleForm";

export const metadata = {
  title: "Nouvel article",
  robots: { index: false, follow: false },
};

export default function NewArticle() {
  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>Nouvel article</h1>
        <Link href="/admin" className="btn btn-outline">← Retour</Link>
      </div>
      <div className="card">
        <ArticleForm />
      </div>
    </main>
  );
}
