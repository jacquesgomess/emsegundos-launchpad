import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "get_post",
  title: "Ver artigo",
  description: "Retorna um artigo completo do EmSegundos pelo slug, incluindo conteúdo e SEO.",
  inputSchema: { slug: z.string().trim().min(1).max(200).describe("Slug do artigo.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("posts")
      .select("*, category:categories(name,slug)")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return toolError(error.message);
    if (!data) return toolError(`Nenhum artigo encontrado com o slug "${slug}".`);
    return jsonResult({ post: data });
  },
});
