"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseTags, slugify, type ArticleStatus } from "@/lib/articles";

type SaveInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string;
  status: ArticleStatus;
};

function fromForm(formData: FormData): SaveInput {
  return {
    id: (formData.get("id") as string | null) || undefined,
    title: ((formData.get("title") as string) || "").trim(),
    slug: ((formData.get("slug") as string) || "").trim(),
    excerpt: ((formData.get("excerpt") as string) || "").trim(),
    content: (formData.get("content") as string) || "",
    cover_image_url: ((formData.get("cover_image_url") as string) || "").trim(),
    tags: (formData.get("tags") as string) || "",
    status: ((formData.get("status") as ArticleStatus) || "draft"),
  };
}

export async function saveArticle(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const input = fromForm(formData);
  if (!input.title) throw new Error("Le titre est requis");

  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const tags = parseTags(input.tags);

  const payload = {
    title: input.title,
    slug,
    excerpt: input.excerpt || null,
    content: input.content,
    cover_image_url: input.cover_image_url || null,
    tags,
    status: input.status,
    published_at:
      input.status === "published"
        ? (input.id ? undefined : new Date().toISOString())
        : null,
    author_id: user.id,
  };

  let id = input.id;
  if (id) {
    // Only set published_at when transitioning draft → published
    const { data: existing } = await supabase
      .from("articles")
      .select("status, published_at")
      .eq("id", id)
      .single();
    const updatedPayload: Record<string, unknown> = { ...payload };
    if (existing) {
      if (existing.status !== "published" && input.status === "published") {
        updatedPayload.published_at = new Date().toISOString();
      } else if (input.status === "published" && existing.published_at) {
        updatedPayload.published_at = existing.published_at;
      }
    }
    const { error } = await supabase.from("articles").update(updatedPayload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("articles")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = data!.id;
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  redirect(`/admin/articles/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/blog");
}
