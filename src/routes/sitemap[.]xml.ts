import { createFileRoute } from "@tanstack/react-router";

import { getBaseUrl } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/artigos",
  "/sobre",
  "/como-pesquisamos",
  "/contato",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/aviso-de-afiliados",
  "/termos-de-uso",
];

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { publicClient } = await import("@/lib/blog.server");
        const supabase = publicClient();
        // Canonical host first, so sitemap URLs always match <link rel="canonical">.
        const base = (
          process.env.SITE_URL ||
          getBaseUrl() ||
          new URL(request.url).origin
        ).replace(/\/$/, "");

        const [{ data: posts }, { data: categories }] = await Promise.all([
          supabase
            .from("posts")
            .select("slug,published_at,updated_content_at")
            .eq("status", "published")
            .not("published_at", "is", null)
            .lte("published_at", new Date().toISOString())
            .order("published_at", { ascending: false })
            .limit(2000),
          supabase.from("categories").select("slug").order("sort_order", { ascending: true }),
        ]);

        const urls: string[] = [];
        for (const path of STATIC_PATHS) {
          urls.push(`<url><loc>${escapeXml(`${base}${path}`)}</loc></url>`);
        }
        for (const category of categories ?? []) {
          urls.push(`<url><loc>${escapeXml(`${base}/categoria/${category.slug}`)}</loc></url>`);
        }
        for (const post of posts ?? []) {
          const lastmod = post.updated_content_at ?? post.published_at;
          urls.push(
            `<url><loc>${escapeXml(`${base}/artigos/${post.slug}`)}</loc>${
              lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""
            }</url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=600",
          },
        });
      },
    },
  },
});
