export type Source = { name: string; url: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  series: string | null;
  published_at: string | null;
  reading_minutes: number | null;
  is_featured: boolean;
  category: { name: string; slug: string } | null;
};

export type PostDetail = PostSummary & {
  content: string;
  author_name: string | null;
  updated_content_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  youtube_url: string | null;
  sources: Source[];
  tags: string[];
  has_affiliate_links: boolean;
  related_post_ids: string[];
};

export const SUMMARY_COLUMNS =
  "id,title,slug,excerpt,cover_image_url,cover_image_alt,series,published_at,reading_minutes,is_featured,category:categories(name,slug)";

export const DETAIL_COLUMNS = `${SUMMARY_COLUMNS},content,author_name,updated_content_at,seo_title,seo_description,og_image_url,canonical_url,youtube_url,sources,tags,has_affiliate_links,related_post_ids`;

export function parseSources(value: unknown): Source[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      item && typeof item === "object"
        ? {
            name: String((item as Record<string, unknown>).name ?? "").trim(),
            url: String((item as Record<string, unknown>).url ?? "").trim(),
          }
        : { name: "", url: "" },
    )
    .filter((s) => s.name.length > 0 || s.url.length > 0);
}

export function formatDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
