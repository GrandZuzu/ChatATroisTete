"use client";

import { useState } from "react";

type Format = "feed" | "story" | "reel";

type Props = {
  articleId: string;
  disabled?: boolean;
  disabledReason?: string;
};

export function InstagramButton({ articleId, disabled, disabledReason }: Props) {
  const [format, setFormat] = useState<Format>("feed");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const onPublish = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/instagram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, format, caption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur Instagram");
      setStatus("ok");
      setMessage(`Publié — id média : ${data.media_id}`);
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    }
  };

  return (
    <div>
      {disabled && disabledReason && (
        <div className="alert alert-info">{disabledReason}</div>
      )}

      <div className="field">
        <label htmlFor="ig-format">Format</label>
        <select
          id="ig-format"
          value={format}
          onChange={(e) => setFormat(e.target.value as Format)}
          disabled={disabled || status === "loading"}
        >
          <option value="feed">Feed (post photo)</option>
          <option value="story">Story</option>
          <option value="reel">Reel (vidéo — non implémenté côté upload)</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="ig-caption">Légende</label>
        <textarea
          id="ig-caption"
          rows={3}
          style={{ minHeight: 90 }}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Texte du post Instagram (hashtags inclus)…"
          disabled={disabled || status === "loading"}
        />
      </div>

      <div className="ig-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onPublish}
          disabled={disabled || status === "loading"}
        >
          {status === "loading" ? "Envoi…" : "Publier sur Instagram"}
        </button>
        <span className="ig-status">
          Nécessite une app Meta validée (voir docs/META-INSTAGRAM-SETUP.md).
        </span>
      </div>

      {status === "ok" && <div className="alert alert-success" style={{ marginTop: ".8rem" }}>{message}</div>}
      {status === "error" && <div className="alert alert-error" style={{ marginTop: ".8rem" }}>{message}</div>}
    </div>
  );
}
