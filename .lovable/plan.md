# Pré-publicação EmSegundos: o que falta

Auditei o estado atual (rotas, metadados, banco). A base está pronta, mas há 5 pendências antes de publicar — 3 corrijo no código, 2 dependem de você.

## Bloqueios reais

1. **Nenhum artigo publicado.** O banco tem 3 posts, todos como rascunho. Home, /artigos e /categoria/* aparecerão vazias para visitantes, e o sitemap sairá sem artigos. É o comportamento correto das regras de acesso, mas não é um site publicável.
2. **Nenhum administrador.** Não existe usuário cadastrado nem função admin atribuída, então /admin/login ainda não dá acesso a ninguém.

## Correções que farei no código

3. **robots.txt incompleto** — falta a linha `Sitemap:` e falta bloquear `/admin`. Adicionar `Disallow: /admin` no bloco geral e apontar o sitemap.
4. **URL-base não configurada** — `VITE_SITE_URL` está vazio, então canonical, Open Graph e dados estruturados usam caminhos relativos. Definir o domínio de publicação como padrão em `src/lib/site.ts`, mantendo a variável de ambiente com prioridade quando o domínio definitivo for conectado.
5. **Metadados do admin** — `/admin` já está `noindex`; confirmar que `/admin/login` e as telas de rascunho/prévia herdam o mesmo comportamento.

## Ações manuais suas

- Criar o primeiro usuário admin (posso guiar pelo painel de backend e atribuir a função depois que o usuário existir).
- Revisar e publicar pelo menos 1 artigo real (os 3 rascunhos seguem sem corpo definitivo, por decisão anterior de não inventar conteúdo).
- Conectar o domínio definitivo em Project settings, após a primeira publicação, caso queira URL própria.

## Checklist de publicação

- [ ] 1+ artigo publicado com capa, resumo, categoria e meta description
- [ ] Admin criado e login testado em /admin/login
- [ ] robots.txt com Sitemap e Disallow /admin
- [ ] /sitemap.xml retornando apenas conteúdo público
- [ ] Rotas diretas (/artigos/[slug], /categoria/[slug], 404) funcionando após refresh
- [ ] Formulário de contato enviando e mensagem visível só para o admin

## Detalhes técnicos

- `public/robots.txt`: adicionar `Disallow: /admin` no bloco `User-agent: *` e a linha `Sitemap`.
- `src/lib/site.ts`: preencher `FALLBACK_BASE_URL` com a URL publicada; `getBaseUrl()` continua priorizando `VITE_SITE_URL`.
- `src/routes/sitemap[.]xml.ts`: já usa `SITE_URL` com fallback para a origem da requisição — sem mudanças.
- Sem alteração de schema, RLS ou layout.