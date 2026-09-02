# EmSegundos: o que falta para ir ao ar e monetizar

Estado verificado agora: os itens críticos e altos da auditoria (soft 404, proteção do contato, grants, `profiles`, Termos de uso, autoria) já estão no código. Faltam medição, domínio e, principalmente, conteúdo.

## O que está pronto

- 3 artigos publicados, todos com capa, resumo, SEO e autoria; nenhum rascunho pendente.
- 404 real, sitemap dinâmico com `lastmod`, robots.txt, `manifest.webmanifest`, ícones, `theme-color`, fonte autohospedada, aviso de cookies com consentimento.

## O que ainda bloqueia

1. **Site não publicado.** Nenhuma URL pública ativa hoje.
2. **Sem domínio próprio.** Canonical, sitemap e Open Graph usam o endereço `*.lovable.app`. Depois de conectar o domínio, atualizar a URL-base e o `robots.txt`.
3. **Sem medição.** `VITE_GA_MEASUREMENT_ID` vazio (o consentimento já está pronto e só carrega após aceite) e Search Console sem verificação nem sitemap enviado.
4. **Conteúdo insuficiente e concentrado.** 3 artigos, todos em Tecnologia em Casa; Casa Prática e Vida Digital estão vazias. AdSense avalia profundidade e cobertura — o realista é 15–25 artigos distribuídos nas 3 categorias.

## Plano em 4 etapas

**Etapa 1 — Ir ao ar (hoje)**

- Publicar o site.
- Conectar o domínio e trocar a URL-base central + `Sitemap:` do `robots.txt`.
- Adicionar a meta de verificação do Search Console e enviar o sitemap.
- Ativar GA4 opcional já atrelado ao consentimento (só precisa do ID de medição).

**Etapa 2 — Estrutura para monetizar (sem anúncio ativo)**

- Componente de slot de anúncio com altura reservada (topo do artigo, meio do conteúdo, rodapé da listagem), vazio até haver rede aprovada — evita deslocamento de layout depois.
- Bloco de recomendação de afiliado em Markdown (produto, motivo, botão) com `rel="sponsored nofollow noopener"` e o aviso de afiliados acima do primeiro link.

**Etapa 3 — Conteúdo até o volume de aprovação**

- Plano editorial de 15–25 artigos: pelo menos 5 em Casa Prática e 5 em Vida Digital, o resto ampliando Tecnologia em Casa para além de Wi-Fi.
- Links internos entre artigos da mesma categoria e texto introdutório próprio em cada página de categoria.
- Somente depois disso solicitar AdSense.

**Etapa 4 — Refino**

- RSS, página de série editorial, `Cache-Control` nas rotas de conteúdo.
- `bunx prettier --write .` para zerar o ruído de lint.

## Detalhes técnicos

Etapa 1 mexe em `src/lib/site.ts`, `public/robots.txt`, `src/routes/__root.tsx` e `src/lib/consent.ts`. Etapa 2 cria componentes em `src/components/site/` e estende `src/lib/markdown.tsx`. Nenhuma mudança de schema, RLS ou identidade visual.

## O que depende de você

- Domínio definitivo (ou autorização para publicar já no endereço Lovable).
- ID de medição do GA4, se quiser analytics além do nativo.
- Confirmar se a monetização inicial será afiliados, anúncios ou ambos, e quais etapas implemento agora.
