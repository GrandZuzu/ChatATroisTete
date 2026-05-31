import { CommentToDmTool } from "./CommentToDmTool";

export const metadata = {
  title: "InstaContact — Admin",
};

const igConfigured = Boolean(
  process.env.INSTAGRAM_BUSINESS_ID && process.env.INSTAGRAM_ACCESS_TOKEN
);

export default function InstaContactPage() {
  return (
    <main className="admin-main">
      <div className="admin-header">
        <h1>InstaContact</h1>
      </div>

      <div className="alert alert-info" style={{ marginBottom: "1.2rem" }}>
        <strong>Pourquoi pas « tous ceux qui ont liké » ?</strong> Instagram
        n'expose pas la liste des comptes qui ont liké un post, et envoyer des
        DM non sollicités est interdit par ses règles (risque de bannissement).
        À la place, cet outil utilise le mécanisme <em>officiel</em> de réponses
        privées : on contacte les personnes qui ont <strong>commenté</strong>{" "}
        ton post (1 DM par personne, dans les 7 jours). Détails et alternatives
        dans <code>InstaContact/README.md</code>.
      </div>

      {!igConfigured && (
        <div className="alert alert-error" style={{ marginBottom: "1.2rem" }}>
          Instagram n'est pas encore configuré (<code>INSTAGRAM_BUSINESS_ID</code>{" "}
          / <code>INSTAGRAM_ACCESS_TOKEN</code> manquants, avec les permissions{" "}
          <code>instagram_manage_comments</code> +{" "}
          <code>instagram_manage_messages</code>). L'aperçu et l'envoi
          renverront une erreur tant que ce n'est pas fait — voir{" "}
          <code>docs/META-INSTAGRAM-SETUP.md</code>.
        </div>
      )}

      <CommentToDmTool />
    </main>
  );
}
