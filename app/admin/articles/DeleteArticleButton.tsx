"use client";

import { useTransition } from "react";
import { deleteArticle } from "./actions";

export function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirm(`Supprimer l'article « ${title || "(sans titre)"} » ? Cette action est irréversible.`)) return;
    const fd = new FormData();
    fd.set("id", id);
    startTransition(() => deleteArticle(fd));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="btn btn-danger"
      style={{ padding: ".4rem .9rem", fontSize: 13 }}
    >
      {isPending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
