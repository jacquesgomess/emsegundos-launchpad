import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { publicClient, listSchema, contactSchema, toSummary } from "./blog.server";
import {
  DETAIL_COLUMNS,
  SUMMARY_COLUMNS,
  parseSources,
  type Category,
  type PostDetail,
  type PostSummary,
} from "./blog.types";

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const limit = data.limit ?? 9;
    const offset = data.offset ?? 0;

    let query = supabase
      .from("posts")
      .select(SUMMARY_COLUMNS, { count: "exact" })
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (data.featured) query = query.eq("is_featured", true);
    if (data.series) query = query.eq("series", data.series);
    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      if (term) query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
    }
    if (data.categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", data.categorySlug)
        .maybeSingle();
      if (!category) return { posts: [] as PostSummary[], total: 0 };
      query = query.eq("category_id", category.id);
    }

    const { data: rows, count, error } = await query;
    if (error) throw new Error(error.message);
    return {
      posts: (rows ?? []).map((row) => toSummary(row as Record<string, unknown>)),
      total: count ?? 0,
    };
  });

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
});

export const getCategoryBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().max(80) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("categories")
      .select("id,name,slug,description,sort_order")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as Category | null) ?? null;
  });

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().max(120) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("posts")
      .select(DETAIL_COLUMNS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { post: null as PostDetail | null, related: [] as PostSummary[] };

    const record = row as Record<string, unknown>;
    const post: PostDetail = {
      ...toSummary(record),
      content: String(record.content ?? ""),
      author_name: (record.author_name as string | null) ?? null,
      updated_content_at: (record.updated_content_at as string | null) ?? null,
      seo_title: (record.seo_title as string | null) ?? null,
      seo_description: (record.seo_description as string | null) ?? null,
      og_image_url: (record.og_image_url as string | null) ?? null,
      canonical_url: (record.canonical_url as string | null) ?? null,
      youtube_url: (record.youtube_url as string | null) ?? null,
      sources: parseSources(record.sources),
      tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
      has_affiliate_links: Boolean(record.has_affiliate_links),
      related_post_ids: Array.isArray(record.related_post_ids)
        ? (record.related_post_ids as string[])
        : [],
    };

    let related: PostSummary[] = [];
    if (post.related_post_ids.length > 0) {
      const { data: relatedRows } = await supabase
        .from("posts")
        .select(SUMMARY_COLUMNS)
        .in("id", post.related_post_ids)
        .eq("status", "published")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .limit(3);
      related = (relatedRows ?? []).map((r) => toSummary(r as Record<string, unknown>));
    }
    if (related.length === 0 && post.category) {
      const { data: fallback } = await supabase
        .from("posts")
        .select(SUMMARY_COLUMNS)
        .neq("id", post.id)
        .eq("status", "published")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(3);
      related = (fallback ?? [])
        .map((r) => toSummary(r as Record<string, unknown>))
        .filter((r) => r.category?.slug === post.category?.slug)
        .slice(0, 3);
    }

    return { post, related };
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Simple spam protection: hidden honeypot field + minimum fill time.
    if (data.website && data.website.trim().length > 0) return { ok: true };
    if (typeof data.elapsedMs === "number" && data.elapsedMs < 2500) {
      throw new Error("Envio muito rápido. Tente novamente em alguns segundos.");
    }
    const supabase = publicClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error("Não foi possível enviar a mensagem. Tente novamente.");
    return { ok: true };
  });
