"use client";

import { useState, useTransition, useEffect } from "react";
import { saveArticle } from "./actions";
import type { Article } from "@/lib/articles";
import { slugify } from "@/lib/articles";
import { ImageUpload } from "./ImageUpload";
import { InstagramButton } from "./InstagramButton";

type Props = {
  article?: Article;
  saved?: boolean;
};

export function ArticleForm({ article, saved }: Props) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.cover_image_url ?? "");
  const [tags, setTags] = useState((article?.tags ?? []).join(", "));
  const [status, setStatus] = useState<"draft" | "published">(article?.status ?? "draft");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("status", status);
    startTransition(async () => {
      try {
        await saveArticle(fd);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="form-grid">
      {saved && !error && (
        <div className="alert alert-success">Article enregistré.</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {article?.id && <input type="hidden" name="id" value={article.id} />}

      <div className="field">
        <label htmlFor="title">Titre</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Un titre accrocheur"
        />
      </div>

      <div className="field">
        <label htmlFor="slug">Slug (URL)</label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="slug-de-l-article"
        />
        <span className="field-help">
          Devient l&apos;URL <code>/blog/{slug || "(auto)"}</code>. Auto-généré
          depuis le titre tant que tu ne le modifies pas.
        </span>
      </div>

      <div className="field">
        <label>Image de couverture</label>
        <ImageUpload
          value={coverImageUrl}
          onChange={setCoverImageUrl}
        />
        <input type="hidden" name="cover_image_url" value={coverImageUrl} />
      </div>

      <div className="field">
        <label htmlFor="excerpt">Résumé (chapeau)</label>
        <input
          id="excerpt"
          name="excerpt"
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Une phrase qui donne envie de lire."
        />
      </div>

      <div className="field">
        <label htmlFor="content">Contenu (Markdown)</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"## Sous-titre\n\nDu **markdown** ici. [Liens](https://...) et listes :\n\n- point 1\n- point 2"}
        />
        <span className="field-help">
          Markdown (GFM) : titres <code>##</code>, listes, **gras**, [liens](https://...), etc.
        </span>
      </div>

      <div className="field">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="répétitions, coulisses, casting"
        />
        <span className="field-help">Séparés par des virgules.</span>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-outline"
          onClick={() => setStatus("draft")}
          disabled={isPending}
        >
          {isPending && status === "draft" ? "Enregistrement…" : "Enregistrer le brouillon"}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => setStatus("published")}
          disabled={isPending}
        >
          {isPending && status === "published"
            ? "Publication…"
            : article?.status === "published"
              ? "Mettre à jour"
              : "Publier"}
        </button>
        <span className="spacer" />
      </div>

      {article?.id && (
        <div className="card" style={{ marginTop: "1.4rem" }}>
          <h3 style={{ marginBottom: ".6rem" }}>Publier sur Instagram</h3>
          <InstagramButton
            articleId={article.id}
            disabled={article.status !== "published" || !coverImageUrl}
            disabledReason={
              article.status !== "published"
                ? "L'article doit d'abord être publié sur le site."
                : !coverImageUrl
                  ? "Une image de couverture est requise pour Instagram."
                  : undefined
            }
          />
        </div>
      )}
    </form>
  );
}
