import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publish, type IgFormat } from "@/lib/instagram";

export async function POST(req: NextRequest) {
  // Auth gate — only signed-in admins
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    articleId?: string;
    format?: IgFormat;
    caption?: string;
  };

  const { articleId, format = "feed", caption = "" } = body;
  if (!articleId) {
    return NextResponse.json({ error: "articleId manquant" }, { status: 400 });
  }

  const { data: article, error } = await supabase
    .from("articles")
    .select("title, excerpt, cover_image_url, status")
    .eq("id", articleId)
    .single();

  if (error || !article) {
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }
  if (!article.cover_image_url) {
    return NextResponse.json(
      { error: "L'article doit avoir une image de couverture publique." },
      { status: 400 }
    );
  }

  const igUserId = process.env.INSTAGRAM_BUSINESS_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!igUserId || !accessToken) {
    return NextResponse.json(
      {
        error:
          "Instagram non configuré. Renseigne INSTAGRAM_BUSINESS_ID et INSTAGRAM_ACCESS_TOKEN — voir docs/META-INSTAGRAM-SETUP.md.",
      },
      { status: 503 }
    );
  }

  try {
    const finalCaption = caption || article.excerpt || article.title;
    const mediaId = await publish({
      igUserId,
      accessToken,
      format,
      imageUrl: article.cover_image_url,
      caption: finalCaption,
    });
    return NextResponse.json({ ok: true, media_id: mediaId });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
