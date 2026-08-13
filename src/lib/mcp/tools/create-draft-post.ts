import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "create_draft_post",
  title: "Criar rascunho",
  description:
    "Cria um novo artigo como rascunho (nunca publicado) no EmSegundos. Requer conta com função admin.",
  inputSchema: {
    title: z.string().trim().min(3).max(200).describe("Título do artigo."),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hifens.")
      .max(200)
      .describe("Slug único do artigo."),
    excerpt: z.string().trim().max(400).optional().describe("Resumo curto."),
    content: z.string().max(60000).optional().describe("Conteúdo em Markdown."),
    category_slug: z.string().trim().max(80).optional().describe("Slug da categoria."),
    series: z.string().trim().max(80).optional().describe("Série editorial."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, slug, excerpt, content, category_slug, series }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);

    let categoryId: string | null = null;
    if (category_slug) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (categoryError) return toolError(categoryError.message);
      if (!category) return toolError(`Categoria "${category_slug}" não encontrada.`);
      categoryId = category.id;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        excerpt: excerpt ?? null,
        content: content ?? "",
        category_id: categoryId,
        series: series ?? null,
        status: "draft",
        author_id: ctx.getUserId() ?? null,
      })
      .select("id,title,slug,status")
      .maybeSingle();
    if (error) return toolError(error.message);
    return jsonResult({ post: data });
  },
});