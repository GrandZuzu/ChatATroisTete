"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const onClick = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={onClick}
      className="btn btn-outline"
      style={{ padding: ".35rem .8rem", fontSize: 13 }}
    >
      Déconnexion
    </button>
  );
}
