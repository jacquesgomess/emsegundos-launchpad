import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_posts",
  title: "Listar artigos",
  description:
    "Lista artigos do blog EmSegundos com paginação (limit/offset), filtros de status (rascunho/publicado), categoria, intervalo de datas de publicação e busca por título. Retorna total e paginação.",
  inputSchema: {
    status: z.enum(["draft", "published"]).optional().describe("Filtrar por status do artigo."),
    search: z.string().trim().max(120).optional().describe("Busca por título."),
    category_slug: z.string().trim().max(80).optional().describe("Slug da categoria."),
    published_from: z
      .string()
      .trim()
      .max(40)
      .optional()
      .describe("Data mínima de publicação (ISO, ex. 2026-01-01)."),
    published_to: z
      .string()
      .trim()
      .max(40)
      .optional()
      .describe("Data máxima de publicação (ISO, ex. 2026-12-31)."),
    order_by: z
      .enum(["updated_at", "published_at", "title"])
      .optional()
      .describe("Campo de ordenação (padrão updated_at)."),
    ascending: z.boolean().optional().describe("Ordem crescente (padrão false)."),
    limit: z.number().int().min(1).max(50).optional().describe("Máximo de artigos (padrão 20)."),
    offset: z
      .number()
      .int()
      .min(0)
      .max(5000)
      .optional()
      .describe("Quantos artigos pular para paginar (padrão 0)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (
    {
      status,
      search,
      category_slug,
      published_from,
      published_to,
      order_by,
      ascending,
      limit,
      offset,
    },
    ctx,
  ) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const take = limit ?? 20;
    const skip = offset ?? 0;
    let categoryId: string | undefined;

    if (category_slug) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (categoryError) return toolError(categoryError.message);
      if (!category)
        return jsonResult({
          posts: [],
          total: 0,
          limit: take,
          offset: skip,
          has_more: false,
          note: `Categoria "${category_slug}" não encontrada.`,
        });
      categoryId = category.id;
    }

    let query = supabase
      .from("posts")
      .select(
        "id,title,slug,status,series,excerpt,published_at,updated_at,is_featured,reading_minutes,category:categories(name,slug)",
        { count: "exact" },
      )
      .order(order_by ?? "updated_at", { ascending: ascending ?? false, nullsFirst: false })
      .range(skip, skip + take - 1);
    if (status) query = query.eq("status", status);
    if (search) query = query.ilike("title", `%${search}%`);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (published_from) query = query.gte("published_at", published_from);
    if (published_to) query = query.lte("published_at", published_to);
    const { data, count, error } = await query;
    if (error) return toolError(error.message);
    const total = count ?? 0;
    return jsonResult({
      posts: data ?? [],
      total,
      limit: take,
      offset: skip,
      has_more: skip + (data?.length ?? 0) < total,
    });
  },
});
