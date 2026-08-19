import { auth, defineMcp } from "@lovable.dev/mcp-js";

import createDraftPostTool from "./tools/create-draft-post";
import getPostTool from "./tools/get-post";
import listCategoriesTool from "./tools/list-categories";
import listContactMessagesTool from "./tools/list-contact-messages";
import listPostsTool from "./tools/list-posts";
import setPostStatusTool from "./tools/set-post-status";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// value that survives publish unchanged.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "emsegundos-launchpad",
  title: "EmSegundos Launchpad",
  version: "0.1.0",
  instructions:
    "Ferramentas editoriais do blog EmSegundos. Use list_posts e get_post para consultar artigos, list_categories para categorias, create_draft_post para criar rascunhos, set_post_status para publicar ou despublicar e list_contact_messages para ler mensagens do formulário de contato. Ações de escrita exigem uma conta com função admin.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listPostsTool,
    getPostTool,
    listCategoriesTool,
    createDraftPostTool,
    setPostStatusTool,
    listContactMessagesTool,
  ],
});
