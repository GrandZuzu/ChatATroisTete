import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runCommentToDmCampaign } from "@/InstaContact/lib/instacontact";

/**
 * POST /api/instagram/comment-dm
 *
 * Campagne « Comment-to-DM » : envoie une réponse privée (DM) aux personnes
 * ayant commenté un post. C'est l'alternative conforme au ticket #486
 * (les *likers* ne sont ni listables ni contactables via l'API — voir
 * InstaContact/README.md).
 *
 * Body JSON : { mediaId, template, keyword?, dryRun?, maxSends? }
 * Par défaut dryRun = true (aperçu, aucun envoi).
 */
export async function POST(req: NextRequest) {
  // Auth gate — admin connecté uniquement
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    mediaId?: string;
    template?: string;
    keyword?: string;
    dryRun?: boolean;
    maxSends?: number;
  };

  const mediaId = body.mediaId?.trim();
  const template = body.template?.trim();
  if (!mediaId) {
    return NextResponse.json({ error: "mediaId manquant" }, { status: 400 });
  }
  if (!template) {
    return NextResponse.json({ error: "Message (template) manquant" }, { status: 400 });
  }

  const igUserId = process.env.INSTAGRAM_BUSINESS_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!igUserId || !accessToken) {
    return NextResponse.json(
      {
        error:
          "Instagram non configuré. Renseigne INSTAGRAM_BUSINESS_ID et INSTAGRAM_ACCESS_TOKEN (avec les permissions instagram_manage_comments + instagram_manage_messages) — voir docs/META-INSTAGRAM-SETUP.md.",
      },
      { status: 503 }
    );
  }

  try {
    const report = await runCommentToDmCampaign({
      igUserId,
      accessToken,
      mediaId,
      template,
      keyword: body.keyword?.trim() || undefined,
      // Sécurité : on n'envoie pour de vrai que si dryRun === false explicite.
      dryRun: body.dryRun !== false,
      maxSends: typeof body.maxSends === "number" ? body.maxSends : undefined,
    });
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
