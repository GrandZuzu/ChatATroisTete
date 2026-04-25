"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const redirect = new URLSearchParams(window.location.search).get("redirect") || "/admin";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div className="alert alert-success" style={{ marginTop: "1.2rem" }}>
        Lien envoyé à <strong>{email}</strong>. Ouvre ta boîte mail et clique
        sur le lien pour te connecter.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: "1.2rem" }}>
      {status === "error" && (
        <div className="alert alert-error">{errorMsg || "Erreur lors de l'envoi du lien."}</div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="toi@exemple.com"
          autoComplete="email"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Envoi…" : "Recevoir le lien"}
      </button>
    </form>
  );
}
