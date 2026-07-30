import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  head: () =>
    contentHead({
      title: "Sobre",
      description:
        "O EmSegundos publica guias práticos para resolver problemas de casa e da vida digital com linguagem simples e critérios claros.",
      path: "/sobre",
    }),
  component: () => (
    <ContentPage
      title="Sobre o EmSegundos"
      description="Soluções práticas para sua casa e sua vida digital."
    >
      <p>
        O EmSegundos é um site editorial independente. Publicamos guias, tutoriais e comparativos
        para ajudar quem precisa resolver um problema doméstico ou entender melhor a tecnologia que
        já usa em casa.
      </p>
      <h2>O que você encontra aqui</h2>
      <ul>
        <li>
          <strong>Casa Prática:</strong> soluções para a rotina da casa, organização e manutenção
          simples.
        </li>
        <li>
          <strong>Tecnologia em Casa:</strong> internet, Wi-Fi, aparelhos conectados e ajustes que
          evitam gasto desnecessário.
        </li>
        <li>
          <strong>Vida Digital:</strong> uso seguro e consciente de aplicativos, contas e serviços
          online.
        </li>
      </ul>
      <h2>Como escrevemos</h2>
      <p>
        Cada texto começa pelo problema real de quem lê, explica o contexto em linguagem acessível e
        termina com passos possíveis de executar. Não prometemos resultados garantidos nem
        apresentamos opiniões como se fossem testes de laboratório.
      </p>
      <h3>O que não fazemos</h3>
      <ul>
        <li>Não publicamos avaliações, notas ou medições que não tenhamos realizado.</li>
        <li>Não aceitamos conteúdo pago disfarçado de matéria editorial.</li>
        <li>Não usamos textos genéricos apenas para ocupar espaço.</li>
      </ul>
      <h2>Falar com a equipe</h2>
      <p>
        Sugestões, correções e dúvidas podem ser enviadas pelo formulário da página de contato ou
        para <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </ContentPage>
  ),
});