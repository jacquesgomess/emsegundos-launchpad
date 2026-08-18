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

type ContactInput = z.infer<typeof contactSchema>;

const MAX_MESSAGES_PER_WINDOW = 3;
const WINDOW_MINUTES = 60;

/** Anonymous, non-reversible origin fingerprint used only for flood control. */
async function hashOrigin(value: string): Promise<string> {
  const data = new TextEncoder().encode(`emsegundos:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

/**
 * Stores a contact message server-side with a per-origin rate limit.
 * Writes go through the admin client, so visitors have no direct table access.
 */
export async function storeContactMessage(data: ContactInput): Promise<{ ok: true }> {
  const { getRequest, getRequestIP } = await import("@tanstack/react-start/server");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const request = getRequest();
  const ip =
    getRequestIP({ xForwardedFor: true }) ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ipHash = await hashOrigin(ip);

  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await supabaseAdmin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if ((count ?? 0) >= MAX_MESSAGES_PER_WINDOW) {
    throw new Error(
      "Você já enviou várias mensagens recentemente. Tente novamente em cerca de uma hora.",
    );
  }

  const { error } = await supabaseAdmin.from("contact_messages").insert({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    ip_hash: ipHash,
  });
  if (error) throw new Error("Não foi possível enviar a mensagem. Tente novamente.");
  return { ok: true };
}
