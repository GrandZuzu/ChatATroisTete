"use client";

import { useState } from "react";

type Result = {
  username: string;
  commentId: string;
  status: "sent" | "skipped" | "error" | "planned";
  detail?: string;
};

type Report = {
  ok: true;
  dryRun: boolean;
  fetched: number;
  targeted: number;
  results: Result[];
};

export function CommentToDmTool() {
  const [mediaId, setMediaId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [template, setTemplate] = useState(
    "Coucou @{username} ! Merci pour ton commentaire 🎭 Voici le lien des places : https://lechata3tetes.fr/billetterie"
  );
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  const run = async (dryRun: boolean) => {
    if (!dryRun) {
      const ok = window.confirm(
        "Envoyer réellement les DM ? Cette action est irréversible et chaque destinataire recevra un message."
      );
      if (!ok) return;
    }
    setStatus("loading");
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/instagram/comment-dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, template, keyword, dryRun }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur Instagram");
      setReport(data as Report);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setStatus("idle");
    }
  };

  const loading = status === "loading";

  return (
    <div>
      <div className="field">
        <label htmlFor="ic-media">ID du média (post)</label>
        <input
          id="ic-media"
          type="text"
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
          placeholder="17841400000000000"
          disabled={loading}
        />
        <span className="field-help">
          L'ID numérique du post, pas son lien. Récupère-le via l'API (voir
          InstaContact/README.md → « Trouver l'ID d'un post »).
        </span>
      </div>

      <div className="field">
        <label htmlFor="ic-keyword">Mot-clé (optionnel)</label>
        <input
          id="ic-keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="INFO"
          disabled={loading}
        />
        <span className="field-help">
          Si renseigné, ne contacte que les commentaires contenant ce mot
          (idéal pour un appel à l'action « commente INFO »).
        </span>
      </div>

      <div className="field">
        <label htmlFor="ic-template">Message</label>
        <textarea
          id="ic-template"
          rows={3}
          style={{ minHeight: 90 }}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          disabled={loading}
        />
        <span className="field-help">
          <code>{"{username}"}</code> est remplacé par le pseudo du
          commentateur.
        </span>
      </div>

      <div className="ig-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => run(true)}
          disabled={loading || !mediaId || !template}
        >
          {loading ? "…" : "Aperçu (aucun envoi)"}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => run(false)}
          disabled={loading || !mediaId || !template}
        >
          {loading ? "Envoi…" : "Envoyer les DM"}
        </button>
        <span className="ig-status">
          Nécessite les permissions Meta instagram_manage_comments +
          instagram_manage_messages.
        </span>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: ".8rem" }}>
          {error}
        </div>
      )}

      {report && (
        <div style={{ marginTop: "1.2rem" }}>
          <div
            className={`alert ${report.dryRun ? "alert-info" : "alert-success"}`}
          >
            {report.dryRun ? "Aperçu — aucun DM envoyé. " : "Campagne envoyée. "}
            {report.fetched} commentaire(s) lus, {report.targeted}{" "}
            destinataire(s) retenu(s)
            {!report.dryRun &&
              ` — ${report.results.filter((r) => r.status === "sent").length} envoyé(s), ${report.results.filter((r) => r.status === "error").length} en erreur`}
            .
          </div>

          {report.results.length > 0 && (
            <table className="article-table" style={{ marginTop: ".8rem" }}>
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Statut</th>
                  <th>{report.dryRun ? "Message prévu" : "Détail"}</th>
                </tr>
              </thead>
              <tbody>
                {report.results.map((r) => (
                  <tr key={r.commentId}>
                    <td>@{r.username}</td>
                    <td>
                      <span className={`status-pill status-${r.status === "sent" || r.status === "planned" ? "published" : "draft"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--c-muted)" }}>
                      {r.detail || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
