import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { PostSummary } from "./blog.types";

/** Public, read-only Supabase client (anon role, RLS enforced). */
export function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}
const listSchema = z.object({
  categorySlug: z.string().max(80).optional(),
  search: z.string().max(120).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).max(5000).optional(),
  featured: z.boolean().optional(),
  series: z.string().max(80).optional(),
});

function toSummary(row: Record<string, unknown>): PostSummary {
  const category = row.category as { name: string; slug: string } | null;
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: (row.excerpt as string | null) ?? null,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    cover_image_alt: (row.cover_image_alt as string | null) ?? null,
    series: (row.series as string | null) ?? null,
    published_at: (row.published_at as string | null) ?? null,
    reading_minutes: (row.reading_minutes as number | null) ?? null,
    is_featured: Boolean(row.is_featured),
    category: category ? { name: category.name, slug: category.slug } : null,
  };
}


const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional(),
  elapsedMs: z.number().optional(),
});


export { listSchema, contactSchema, toSummary };
