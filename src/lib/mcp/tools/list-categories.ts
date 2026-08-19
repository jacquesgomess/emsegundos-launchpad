import { defineTool } from "@lovable.dev/mcp-js";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_categories",
  title: "Listar categorias",
  description: "Lista as categorias editoriais do EmSegundos com nome e slug.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,description")
      .order("name");
    if (error) return toolError(error.message);
    return jsonResult({ categories: data ?? [] });
  },
});
