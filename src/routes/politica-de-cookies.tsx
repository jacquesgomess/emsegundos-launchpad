import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () =>
    contentHead({
      title: "Política de cookies",
      description:
        "Quais cookies e tecnologias semelhantes o EmSegundos utiliza e como você pode controlá-los no navegador.",
      path: "/politica-de-cookies",
    }),
  component: () => (
    <ContentPage title="Política de cookies" description="O que é armazenado no seu navegador.">
      <h2>O que são cookies</h2>
      <p>
        Cookies são pequenos arquivos que um site grava no navegador para lembrar informações entre
        as visitas.
      </p>
      <h2>Como usamos</h2>
      <ul>
        <li>
          <strong>Essenciais:</strong> necessários ao funcionamento do site e à área administrativa,
          incluindo a sessão de quem faz login.
        </li>
        <li>
          <strong>Terceiros:</strong> conteúdos incorporados, como vídeos do YouTube, podem gravar
          cookies próprios quando você interage com eles.
        </li>
      </ul>
      <p>
        Nesta versão do site não utilizamos cookies de publicidade nem rastreamento de perfil para
        anúncios.
      </p>
      <h2>Como controlar</h2>
      <p>
        Você pode bloquear ou apagar cookies nas configurações do seu navegador. Bloquear cookies
        essenciais pode impedir o login administrativo, mas não afeta a leitura dos artigos.
      </p>
      <h2>Dúvidas</h2>
      <p>
        Fale com a gente pelo <a href="/contato">formulário de contato</a>.
      </p>
    </ContentPage>
  ),
});
