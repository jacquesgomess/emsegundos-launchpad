import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/como-pesquisamos")({
  head: () =>
    contentHead({
      title: "Como pesquisamos",
      description:
        "O método editorial do EmSegundos: origem das informações, uso de fontes, revisão e correção de conteúdos.",
      path: "/como-pesquisamos",
    }),
  component: () => (
    <ContentPage
      title="Como pesquisamos"
      description="Nosso método editorial, de forma transparente."
    >
      <h2>De onde vêm as informações</h2>
      <p>
        Partimos de documentação oficial de fabricantes, manuais de produtos, normas técnicas
        públicas e orientações de órgãos reguladores. Quando um assunto envolve interpretação,
        deixamos claro que se trata de recomendação geral, não de laudo técnico.
      </p>
      <h2>Uso de fontes</h2>
      <p>
        Artigos que dependem de dados externos trazem a lista de fontes ao final, com nome e link.
        Se uma informação não puder ser verificada em fonte confiável, ela não é publicada.
      </p>
      <h2>Testes e experiências práticas</h2>
      <p>
        Só descrevemos um teste quando ele realmente foi feito, explicando as condições e as
        limitações. Não atribuímos notas, rankings ou medições que não tenhamos apurado.
      </p>
      <h2>Revisão e atualização</h2>
      <p>
        Todo conteúdo passa por revisão antes da publicação. Quando um artigo é atualizado, a data
        de atualização aparece no topo da página.
      </p>
      <h2>Correções</h2>
      <p>
        Erros acontecem. Se você encontrar uma informação incorreta ou desatualizada, escreva para{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> e avaliaremos a correção.
      </p>
      <h2>Independência editorial</h2>
      <p>
        Eventuais links de afiliados nunca definem o que recomendamos nem a ordem em que as opções
        aparecem. Artigos com esse tipo de link exibem um aviso antes do primeiro link comercial.
      </p>
    </ContentPage>
  ),
});