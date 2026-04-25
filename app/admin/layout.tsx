import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin/login renders without the shell
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="brand-name" style={{ fontFamily: "var(--f-serif)" }}>
          Le Chat à 3 Têtes — Admin
        </Link>
        <nav>
          <Link href="/admin">Articles</Link>
          <Link href="/" target="_blank">Voir le site ↗</Link>
          <span style={{ opacity: 0.6, fontSize: 13 }}>{user.email}</span>
          <LogoutButton />
        </nav>
      </header>
      {children}
    </div>
  );
}
