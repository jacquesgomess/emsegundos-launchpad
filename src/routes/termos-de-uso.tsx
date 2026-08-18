import { createFileRoute } from "@tanstack/react-router";

import { ContentPage, contentHead } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/termos-de-uso")({
  head: () =>
    contentHead({
      title: "Termos de uso",
      description:
        "Regras de uso do conteúdo do EmSegundos, limites de responsabilidade, direitos autorais e como falar com a equipe.",
      path: "/termos-de-uso",
    }),
  component: () => (
    <ContentPage
      title="Termos de uso"
      description="As condições para usar o conteúdo publicado no site."
    >
      <h2>Quem somos</h2>
      <p>
        O {SITE.name} é um site editorial independente que publica guias, tutoriais e comparativos
        em português sobre casa, tecnologia doméstica e vida digital. Ao navegar pelo site, você
        concorda com as condições descritas nesta página.
      </p>

      <h2>Finalidade do conteúdo</h2>
      <p>
        Todo o conteúdo tem caráter informativo e educativo. Ele não substitui a avaliação de um
        profissional habilitado, o manual do fabricante do seu equipamento nem o suporte técnico da
        sua operadora ou fornecedor. Procedimentos técnicos devem ser feitos por sua conta e risco,
        respeitando as instruções do fabricante e as normas de segurança aplicáveis.
      </p>

      <h2>Limitação de responsabilidade</h2>
      <p>
        Escrevemos com cuidado, testamos o que é possível testar e revisamos os textos, mas não
        garantimos que todas as informações estejam permanentemente atualizadas ou que funcionem em
        qualquer equipamento, versão de software ou situação. O {SITE.name} não se responsabiliza
        por perdas, danos, prejuízos ou custos decorrentes de decisões tomadas com base no conteúdo
        publicado.
      </p>

      <h2>Direitos autorais</h2>
      <p>
        Textos, imagens e materiais produzidos pelo {SITE.name} são protegidos por direito autoral.
        Você pode citar trechos curtos com crédito e link para a página original. Reprodução
        integral, tradução, adaptação ou uso comercial exigem autorização prévia por escrito.
      </p>

      <h2>Conteúdo comercial</h2>
      <p>
        Alguns artigos podem incluir links de afiliados, sempre identificados no próprio artigo.
        Comissões não influenciam recomendações. As regras completas estão no aviso de afiliados.
      </p>

      <h2>Links para outros sites</h2>
      <p>
        Indicamos fontes e páginas de terceiros para você conferir informações. Não controlamos
        esses sites e não respondemos pelo conteúdo, pelas práticas de privacidade ou pelas
        condições comerciais deles.
      </p>

      <h2>Uso permitido</h2>
      <p>
        É proibido usar o site para coleta automatizada em massa, tentativas de acesso não
        autorizado, envio de mensagens abusivas pelo formulário de contato ou qualquer atividade que
        prejudique o funcionamento do serviço e a experiência de outras pessoas.
      </p>

      <h2>Dados pessoais</h2>
      <p>
        O tratamento de dados enviados pelo formulário de contato e o uso de cookies estão descritos
        na política de privacidade e na política de cookies.
      </p>

      <h2>Alterações</h2>
      <p>
        Estes termos podem ser atualizados para refletir mudanças no site ou na legislação. A versão
        vigente é sempre a publicada nesta página.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre estes termos, pedidos de autorização de uso ou correções de conteúdo podem ser
        enviados pela página de contato.
      </p>
    </ContentPage>
  ),
});
