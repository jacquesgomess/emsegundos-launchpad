import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/aviso-de-afiliados")({
  head: () =>
    contentHead({
      title: "Aviso de afiliados",
      description:
        "Como o EmSegundos usa links de afiliados e por que isso não interfere nas recomendações editoriais.",
      path: "/aviso-de-afiliados",
    }),
  component: () => (
    <ContentPage
      title="Aviso de afiliados"
      description="Transparência sobre links comerciais no site."
    >
      <h2>O que são links de afiliados</h2>
      <p>
        Alguns artigos podem conter links para lojas parceiras. Se você comprar por esses links, o
        EmSegundos pode receber uma comissão, sem nenhum custo adicional para você.
      </p>
      <h2>Como sinalizamos</h2>
      <p>
        Todo artigo com esse tipo de link exibe um aviso visível antes do primeiro link comercial.
        Quando não há aviso, o artigo não contém links de afiliados.
      </p>
      <h2>Independência editorial</h2>
      <p>
        Comissões não determinam quais produtos citamos, a ordem em que aparecem nem o conteúdo das
        análises. Escrevemos primeiro e só depois avaliamos se há um link útil para quem lê.
      </p>
      <h2>Preços e disponibilidade</h2>
      <p>
        Preços e condições pertencem às lojas e podem mudar a qualquer momento. Confira sempre a
        informação diretamente na página do vendedor antes de comprar.
      </p>
      <h2>Dúvidas</h2>
      <p>
        Envie sua dúvida pelo <a href="/contato">formulário de contato</a>.
      </p>
    </ContentPage>
  ),
});
