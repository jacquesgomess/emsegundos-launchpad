import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "set_post_status",
  title: "Publicar ou despublicar artigo",
  description:
    "Altera o status de um artigo do EmSegundos entre rascunho e publicado. Publicar define a data de publicação quando ela estiver vazia.",
  inputSchema: {
    slug: z.string().trim().min(1).max(200).describe("Slug do artigo."),
    status: z.enum(["draft", "published"]).describe("Novo status do artigo."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ slug, status }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);

    const { data: current, error: readError } = await supabase
      .from("posts")
      .select("id,published_at")
      .eq("slug", slug)
      .maybeSingle();
    if (readError) return toolError(readError.message);
    if (!current) return toolError(`Nenhum artigo encontrado com o slug "${slug}".`);

    const { data, error } = await supabase
      .from("posts")
      .update({
        status,
        published_at:
          status === "published" ? (current.published_at ?? new Date().toISOString()) : null,
      })
      .eq("id", current.id)
      .select("id,title,slug,status,published_at")
      .maybeSingle();
    if (error) return toolError(error.message);
    return jsonResult({ post: data });
  },
});
