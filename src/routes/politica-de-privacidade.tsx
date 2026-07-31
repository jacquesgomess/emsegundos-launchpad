import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    contentHead({
      title: "Política de privacidade",
      description:
        "Como o EmSegundos coleta, usa e protege os dados enviados pelo formulário de contato e pela navegação no site.",
      path: "/politica-de-privacidade",
    }),
  component: () => (
    <ContentPage
      title="Política de privacidade"
      description="Como tratamos os dados de quem visita o site."
    >
      <h2>Dados que coletamos</h2>
      <p>
        Coletamos apenas os dados que você envia voluntariamente pelo formulário de contato: nome,
        e-mail, assunto e mensagem. Não pedimos documentos, endereço ou dados financeiros.
      </p>
      <h2>Para que usamos</h2>
      <p>
        As mensagens são usadas exclusivamente para responder ao seu contato e melhorar o conteúdo
        do site. Não vendemos nem compartilhamos esses dados com terceiros para fins comerciais.
      </p>
      <h2>Armazenamento e acesso</h2>
      <p>
        As mensagens ficam armazenadas em banco de dados com acesso restrito à administração do
        site, protegido por autenticação e regras de acesso no próprio banco.
      </p>
      <h2>Dados de navegação</h2>
      <p>
        O site pode registrar informações técnicas básicas necessárias ao funcionamento e à
        segurança, como endereço IP e tipo de navegador. Conteúdos incorporados de terceiros, como
        vídeos do YouTube, seguem as políticas dos respectivos serviços.
      </p>
      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção ou exclusão dos dados enviados pelo{" "}
        <a href="/contato">formulário de contato</a>.
      </p>
      <h2>Alterações</h2>
      <p>
        Esta política pode ser atualizada para refletir mudanças no site. A versão vigente é sempre
        a publicada nesta página.
      </p>
    </ContentPage>
  ),
});
