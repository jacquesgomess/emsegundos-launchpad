import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_contact_messages",
  title: "Listar mensagens de contato",
  description:
    "Lista as mensagens enviadas pelo formulário de contato do EmSegundos. Requer conta com função admin.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Máximo de mensagens (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id,name,email,subject,message,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) return toolError(error.message);
    return jsonResult({ messages: data ?? [] });
  },
});
