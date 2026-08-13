import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_posts",
  title: "Listar artigos",
  description:
    "Lista artigos do blog EmSegundos com filtros de status (rascunho/publicado), busca por título e limite.",
  inputSchema: {
    status: z.enum(["draft", "published"]).optional().describe("Filtrar por status do artigo."),
    search: z.string().trim().max(120).optional().describe("Busca por título."),
    limit: z.number().int().min(1).max(50).optional().describe("Máximo de artigos (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("posts")
      .select(
        "id,title,slug,status,series,excerpt,published_at,updated_at,is_featured,reading_minutes,category:categories(name,slug)",
      )
      .order("updated_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return toolError(error.message);
    return jsonResult({ posts: data ?? [] });
  },
});