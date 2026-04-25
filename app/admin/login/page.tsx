import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>Espace admin</h1>
        <p>
          Saisis ton email pour recevoir un lien de connexion. Pas de mot de
          passe à retenir.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
