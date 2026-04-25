"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "article-images";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "bin";
      const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      {value ? (
        <div style={{ marginBottom: ".6rem" }}>
          <img
            src={value}
            alt="Aperçu de l'image de couverture"
            style={{
              maxWidth: 320,
              width: "100%",
              borderRadius: 8,
              border: "1px solid var(--c-line)",
            }}
          />
        </div>
      ) : null}
      <input
        type="file"
        accept="image/*"
        onChange={onFile}
        disabled={uploading}
      />
      {value && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onChange("")}
          style={{ marginLeft: ".6rem", padding: ".4rem .8rem", fontSize: 13 }}
        >
          Retirer
        </button>
      )}
      {uploading && <span className="field-help" style={{ marginLeft: ".6rem" }}>Upload…</span>}
      {error && <div className="alert alert-error" style={{ marginTop: ".6rem" }}>{error}</div>}
    </div>
  );
}
