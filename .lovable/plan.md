# EmSegundos: o que falta para ir ao ar e monetizar

Auditoria do estado atual: a base técnica (rotas, SEO, RLS, admin, sitemap, robots) está pronta. O que bloqueia a publicação e a monetização é conteúdo, imagens e a camada de medição/consentimento.

## Situação real hoje

- 1 artigo publicado e 2 rascunhos.
- Nenhum dos 3 posts tem imagem de capa: cards, home e Open Graph ficam sem imagem, e o compartilhamento no WhatsApp/Facebook sai sem miniatura.
- Site ainda não publicado e sem domínio próprio; a URL-base usa o endereço padrão do Lovable.
- Sem analytics, sem banner de consentimento de cookies e sem qualquer estrutura de anúncios ou de links de afiliados.

## Bloqueios para colocar no ar (ordem sugerida)

1. **Capas dos artigos.** Gerar/enviar imagem de capa 1200x675 com texto alternativo para o artigo publicado e para os dois rascunhos. Isso corrige cards vazios e a pré-visualização social.
2. **Volume mínimo de conteúdo.** Publicar os 2 rascunhos de Wi-Fi já estruturados (com conteúdo real, sem dados inventados) para o site abrir com 3 artigos coerentes na categoria Tecnologia em Casa.
3. **Publicar** e, em seguida, conectar o domínio definitivo; a URL-base passa a alimentar canonical, sitemap, Open Graph e dados estruturados automaticamente.

## Preparar para monetizar

4. **Banner de consentimento de cookies** (aceitar/recusar, escolha guardada no navegador, sem carregar scripts antes do aceite). É pré-requisito para anúncios e analytics de forma responsável, e a Política de cookies precisa refletir a escolha real.
5. **Analytics de audiência**, carregado apenas após consentimento, para saber quais artigos rendem antes de vender espaço ou entrar em rede de anúncios.
6. **Blocos de afiliado no conteúdo.** Componente de recomendação em Markdown (produto, motivo, botão) com `rel="sponsored nofollow noopener"` e o aviso de afiliados já existente exibido acima do primeiro link.
7. **Slots de anúncio reservados** (topo do artigo, meio do conteúdo, rodapé da listagem) com altura fixa para não causar deslocamento de layout. Ficam vazios até você ter conta aprovada em rede de anúncios.
8. **Requisitos de aprovação em rede de anúncios**: páginas de Privacidade, Cookies, Sobre, Contato e Como pesquisamos já existem; falta apenas conteúdo suficiente e domínio próprio. Recomendo pelo menos 10-15 artigos publicados antes de submeter.

## Melhorias de qualidade recomendadas

- Página de categoria com texto introdutório próprio (hoje depende só da descrição do banco) para ganhar valor de busca.
- Links internos entre os 3 artigos de Wi-Fi (relacionados já suportados no modelo de dados).
- Imagem social padrão do site para páginas sem capa (home, listagem, institucionais).
- Revisão de contraste do laranja sobre creme em botões pequenos e de foco visível em campos do formulário de contato.

## Detalhes técnicos

- Capas: upload no bucket `blog-images` (público) e gravação em `cover_image_url` / `cover_image_alt`.
- Consentimento: componente client-only em `src/components/site/`, montado no `SiteLayout`, estado em `localStorage`; scripts de terceiros só após aceite.
- Analytics: usar o analytics nativo do Lovable para visitas; adicionar Google Analytics só se você quiser funis e eventos.
- Afiliados: extensão do renderizador em `src/lib/markdown.tsx` e reuso da flag `has_affiliate_links`.
- Slots de anúncio: componente com `min-height` reservado, sem script até a rede ser conectada.
- Sem alteração de schema, RLS ou identidade visual.

## O que depende de você

- Aprovar quais itens entram agora (sugestão: 1, 2, 3, 4, 5).
- Informar o domínio, se já tiver.
- Definir se a monetização inicial será afiliados, anúncios ou ambos.
