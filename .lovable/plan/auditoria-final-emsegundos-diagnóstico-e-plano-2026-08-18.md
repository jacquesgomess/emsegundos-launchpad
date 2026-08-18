# Auditoria final EmSegundos — diagnóstico e plano

Análise real feita sobre código, banco (RLS, grants, storage), HTML renderizado no servidor, sitemap, robots e conteúdo publicado. Nada foi alterado.

## 1. Estado técnico (verificado)

- Tipos: `tsgo --noEmit` passa sem erros.
- Lint: 255 erros, **todos de formatação** (Prettier) nos arquivos do MCP e 10 avisos inofensivos de fast-refresh. Nenhum bug de código, nenhum import morto detectado.
- Rotas testadas (`/`, `/artigos`, `/artigos/[slug]`, `/categoria/[slug]`, `/contato`, `/sobre`, `/admin`, `/admin/login`, `/sitemap.xml`, `/robots.txt`): todas respondem 200 e funcionam em acesso direto.
- Conteúdo: 3 artigos **publicados**, todos com capa, alt, resumo, SEO title/description e tempo de leitura. Nenhum rascunho pendente, nenhum lorem ipsum, nenhum dado inventado. Nenhum artigo com vídeo (VideoObject não se aplica hoje).
- Metadados: home com WebSite + Organization; artigo com BlogPosting + BreadcrumbList, canonical absoluto, og:image e twitter:image reais. `/admin`, `/admin/login` e 404 com `noindex`.
- Menu, rodapé, CTAs e links institucionais apontam para rotas existentes.

## 2. Problemas encontrados

### CRÍTICO
1. **404 responde HTTP 200 (soft 404).** `/rota-inexistente` renderiza a página 404 mas com status 200. O Google indexa páginas inexistentes como conteúdo válido — é um dos motivos clássicos de reprovação em avaliação de qualidade.

### ALTO
2. **Formulário de contato sem limite de envio.** `contact_messages` aceita INSERT anônimo; honeypot e tempo mínimo estão no servidor do app, mas um bot pode chamar a API do banco direto e inundar a tabela. Falta limite por IP/tempo e/ou um campo de controle.
3. **Grants amplos para visitantes anônimos.** O papel anônimo tem INSERT/UPDATE/DELETE nas 5 tabelas. Hoje o RLS bloqueia tudo, então **não há vazamento real**, mas não existe defesa em profundidade: uma policy futura escrita errada viraria falha grave. Recomendo revogar o que não é usado.
4. **Tabela `profiles` legível por qualquer visitante** (nome, bio, avatar de todos os usuários). Hoje só existe o perfil do admin, mas o correto é expor apenas perfis ligados a artigos publicados.
5. **Sem Termos de Uso e sem página de autoria.** Faltam para E-E-A-T e para requisitos gerais de redes de anúncios (transparência de quem publica e sob quais regras).
6. **Volume de conteúdo insuficiente para monetização.** 3 artigos (2,7k–4,7k caracteres), todos da mesma subtemática (Wi-Fi). AdSense e similares avaliam profundidade e cobertura: o realista é 15–25 artigos distribuídos nas 3 categorias antes de solicitar.

### MÉDIO
7. **Sitemap usa a origem da requisição, não a URL-base central.** Fora de produção gera URLs do preview e pode divergir do canonical. Também não há `lastmod` nas páginas fixas.
8. **Sem Analytics e sem verificação do Search Console.** `VITE_GA_MEASUREMENT_ID` está vazio (o consentimento já está pronto e só carrega após aceite) e não há meta de verificação nem envio de sitemap.
9. **Sem `og:image` na home** — links compartilhados da página inicial ficam sem imagem.
10. **Fonte Manrope via Google Fonts** — recurso de terceiro bloqueando renderização e enviando IP do visitante ao Google antes de qualquer consentimento (ponto a revisar em privacidade).
11. **Domínio próprio não conectado.** `FALLBACK_BASE_URL` e `robots.txt` apontam para o endereço `*.lovable.app`; canonical, sitemap e OG só ficam definitivos após o domínio.
12. **Sem `manifest.webmanifest`** e sem ícones PNG (só favicon SVG).

### BAIXO
13. 255 erros de formatação do Prettier (ruído em qualquer verificação futura).
14. Sem `Cache-Control` explícito nas rotas de conteúdo; sem `<meta theme-color>`.

### OPORTUNIDADE
15. Espaços de anúncio com altura reservada (evita CLS), bloco de recomendação de afiliado padronizado, página de série editorial, links internos entre artigos da mesma categoria, RSS.

## 3. Segurança e banco — resposta direta

Testado: RLS ativo nas 5 tabelas; visitante anônimo **não** lê rascunhos, mensagens nem dados administrativos; escrita em posts, categorias, mensagens e imagens exige função `admin` verificada por função `security definer` (`has_role`), não pela interface. Storage `blog-images` é público apenas para leitura; upload/alteração/exclusão só admin. Nenhuma chave secreta no frontend (só a chave publicável, que é pública por design). Manipular o frontend **não** dá acesso administrativo. Pendências reais: itens 2, 3 e 4.

## 4. Notas (0–100)

Tecnologia 88 · Segurança 82 · UX/UI 85 · Mobile 85 · SEO 80 · Conteúdo 45 · Performance 82 · Monetização 35 · Analytics 20 · Prontidão para produção 78
**Geral: 71**

## 5. "Eu colocaria o EmSegundos no ar agora?"

**SIM, COM PEQUENAS CORREÇÕES.** A base é sólida e não há falha de segurança explorável. Antes de publicar: corrigir o soft 404, proteger o formulário de contato, apertar os grants e a leitura de `profiles`, publicar Termos de Uso e autoria, e ligar Analytics + Search Console. Monetização com anúncios não deve ser solicitada agora — o bloqueio é volume e diversidade de conteúdo, não código.

## 6. Plano de ação

**P1 — CRÍTICO**
- Soft 404 → devolver status 404 na rota curinga e no `notFoundComponent`. Arquivos: `src/routes/$.tsx`, `src/routes/__root.tsx`.

**P2 — ALTO**
- Limite de envio no contato (janela por IP + validação server-side reforçada). Arquivos: `src/lib/blog.functions.ts`, `src/lib/blog.server.ts`, migração.
- Revogar grants não usados de anônimo/autenticado; restringir SELECT de `profiles` a perfis com artigo publicado. Arquivos: migração SQL.
- Criar `/termos-de-uso` e bloco de autoria/atualização no artigo. Arquivos: `src/routes/termos-de-uso.tsx`, `src/lib/site.ts`, `src/routes/artigos.$slug.tsx`, `src/components/site/Footer.tsx`, `src/routes/sitemap[.]xml.ts`.

**P3 — MÉDIO**
- Sitemap usando a URL-base central + `lastmod`. Arquivo: `src/routes/sitemap[.]xml.ts`.
- GA4 opcional já com consentimento + meta de verificação do Search Console. Arquivos: `src/lib/consent.ts`, `src/routes/__root.tsx`.
- `og:image` da home, `manifest.webmanifest`, ícones PNG, `theme-color`. Arquivos: `public/`, `src/routes/index.tsx`, `src/routes/__root.tsx`.
- Fonte Manrope autohospedada (remove terceiro e melhora LCP). Arquivos: `src/styles.css`, `public/fonts/`.
- `bunx prettier --write .` para zerar o lint.

**P4 — FUTURO (após lançamento)**
- Plano editorial de 15–25 artigos cobrindo as 3 categorias, com links internos.
- Slots de anúncio com altura reservada e componente de recomendação de afiliado.
- Página de série editorial, RSS, painel de métricas de conteúdo.
- Conectar domínio próprio e atualizar `robots.txt`/URL-base.

## Detalhes técnicos
Sem mudança de layout ou identidade visual. As alterações de banco são duas migrações pequenas (grants/`profiles` e controle de flood no contato); nenhuma policy será alterada sem sua aprovação.
