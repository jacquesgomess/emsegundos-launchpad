# EmSegundos Launchpad

Crie a primeira versão funcional e publicável do site/blog EmSegundos.

OBJETIVO
Quero um site editorial rápido, responsivo, administrável e preparado para SEO, YouTube e monetização futura. A marca ajuda pessoas comuns a simplificar a casa, entender a tecnologia e escolher melhor. O MVP deve ser pequeno, confiável e pronto para receber artigos reais. Não crie um portal excessivamente complexo.

MARCA
Nome: EmSegundos
Posicionamento: Soluções práticas para sua casa e sua vida digital.
Slogan: Facilite a rotina. Escolha melhor.
Tom: claro, prático, acessível, confiável e didático. Evite exageros comerciais, jargão, textos genéricos, falsas avaliações e promessas absolutas.

IDENTIDADE VISUAL
Use os logotipos e o favicon que anexei. Não redesenhe nem substitua a marca.
Paleta:
- Azul Confiança: #14263D
- Turquesa Solução: #12A89D
- Turquesa Claro: #2DD4BF
- Laranja Ação: #F28A50
- Creme Casa: #F6F3EB
- Cinza Apoio: #526175
Tipografia: Manrope. Use 800 nos títulos, 700 em subtítulos e botões e 400 no corpo.
Crie uma interface editorial moderna, limpa e acolhedora. Use fundo creme, áreas brancas e azul-marinho. Reserve o laranja para ações e destaques. Evite excesso de gradientes, sombras, animações, carrosséis e aparência genérica de startup.

ARQUITETURA
Use o backend integrado do Lovable para banco de dados, autenticação e armazenamento de imagens. Não conecte serviços externos nesta primeira versão.
O conteúdo público deve ser rastreável por mecanismos de busca. O painel administrativo deve ser protegido por autenticação e por regras de acesso no banco.

PÁGINAS PÚBLICAS
Crie:
1. /
2. /artigos
3. /categoria/[slug]
4. /artigos/[slug]
5. /sobre
6. /como-pesquisamos
7. /contato
8. /politica-de-privacidade
9. /politica-de-cookies
10. /aviso-de-afiliados
11. página 404

MENU
Início, Artigos, Casa Prática, Tecnologia em Casa, Vida Digital e Sobre.
Não exiba o painel administrativo no menu público.

HOME
Crie:
- cabeçalho com o logotipo anexado, menu responsivo e botão “Ver artigos”;
- hero com o título “Soluções práticas para sua casa e sua vida digital.”;
- texto “Guias, tutoriais e comparativos para resolver problemas, usar melhor a tecnologia e escolher com mais segurança.”;
- botões “Ver soluções” e “Começar pelo Wi-Fi”;
- artigo em destaque;
- cards das três categorias;
- artigos recentes;
- seção com as séries “Resolva sem complicação”, “Entenda em segundos” e “Escolha melhor”;
- bloco curto sobre o método editorial;
- rodapé completo com páginas institucionais, categorias e aviso de afiliados.

CATEGORIAS
Cadastre:
1. Casa Prática — slug casa-pratica
2. Tecnologia em Casa — slug tecnologia-em-casa
3. Vida Digital — slug vida-digital

ARTIGOS
Cada artigo deve aceitar:
- título;
- slug exclusivo;
- resumo;
- conteúdo em Markdown com visualização;
- imagem de capa e texto alternativo;
- categoria;
- série editorial;
- autor;
- data de publicação e atualização;
- status rascunho ou publicado;
- destaque sim ou não;
- tempo de leitura;
- título SEO;
- meta description;
- imagem de compartilhamento;
- canonical opcional;
- URL opcional do YouTube;
- fontes como lista de nome e URL;
- tags;
- indicação de links de afiliados;
- artigos relacionados.

Cadastre como RASCUNHOS, sem lorem ipsum e sem publicar conteúdo incompleto:
1. “Wi-Fi fraco em casa? 8 formas de melhorar o sinal antes de gastar”
   slug: wifi-fraco-como-melhorar-o-sinal
   categoria: Tecnologia em Casa
   série: Resolva sem complicação
2. “Repetidor, roteador ou Mesh: qual resolve melhor cada problema?”
   slug: repetidor-roteador-ou-mesh
   categoria: Tecnologia em Casa
   série: Escolha melhor
3. “Onde colocar o roteador: melhores e piores lugares da casa”
   slug: onde-colocar-o-roteador
   categoria: Tecnologia em Casa
   série: Entenda em segundos

Crie resumos curtos e naturais para os registros, mas não invente testes, resultados ou recomendações. Deixe o corpo de cada artigo claramente como rascunho editorial, não público.

PÁGINA DE ARTIGO
Inclua breadcrumb, categoria, série, H1, resumo, autor, datas, tempo de leitura, imagem de capa, sumário automático de H2/H3, conteúdo, fontes, relacionados e compartilhamento discreto.
Exiba o vídeo do YouTube logo após a introdução somente quando uma URL válida estiver cadastrada. Não mostre “vídeo em breve” nem espaço vazio.
Quando has_affiliate_links estiver ativo, exiba um aviso claro antes do primeiro link comercial.

LISTAGEM
Em /artigos, crie busca, filtro por categoria e cards com imagem, categoria, título, resumo, data e tempo de leitura. Use paginação ou “Carregar mais”. Crie estados vazios úteis, sem conteúdo fictício.

PAINEL ADMINISTRATIVO
Crie:
- /admin/login
- /admin
- dashboard com contagem de publicados, rascunhos e categorias;
- lista de posts com busca e filtros;
- criar, editar, excluir, pré-visualizar, publicar e despublicar;
- editor Markdown com visualização;
- geração automática de slug com edição manual e validação de duplicidade;
- upload de imagens;
- gerenciamento de categorias;
- gerenciamento de fontes, SEO, URL do YouTube, tags, relacionados e aviso de afiliados;
- lista das mensagens do formulário de contato.

SEGURANÇA
- Não ofereça cadastro público.
- Proteja as rotas administrativas.
- Aplique regras de acesso no banco, não apenas validações na interface.
- Visitantes anônimos só podem ler posts publicados com data válida.
- Visitantes não podem acessar rascunhos, prévias privadas, mensagens ou arquivos administrativos.
- Apenas usuários com função admin podem alterar posts, categorias e mensagens.
- Não exponha chaves, tokens ou segredos no frontend.

MODELO DE DADOS
Crie tabelas adequadas para profiles, categories, posts e contact_messages.
Posts precisam suportar os campos editoriais e de SEO descritos acima. Fontes devem ser armazenadas de forma estruturada. Garanta unicidade dos slugs e relacionamentos corretos.

SEO E AEO
Implemente:
- HTML semântico e conteúdo público rastreável;
- metadados únicos;
- canonical;
- Open Graph e Twitter Cards;
- favicon anexado;
- sitemap.xml dinâmico com apenas conteúdo público;
- robots.txt;
- breadcrumbs;
- Organization ou WebSite na home;
- BlogPosting nos artigos;
- BreadcrumbList em páginas internas;
- VideoObject somente quando houver vídeo e dados suficientes;
- alt text em imagens;
- links internos;
- página 404;
- noindex para admin, login, rascunhos e prévias.
Use uma configuração central de URL-base para que canonical, sitemap, Open Graph e dados estruturados passem a usar o domínio definitivo quando ele for conectado.

ACESSIBILIDADE E DESEMPENHO
Priorize celular, sem rolagem horizontal. Garanta navegação por teclado, foco visível, contraste, rótulos de formulário, hierarquia de títulos e respeito a movimento reduzido.
Otimize imagens, use SVG no logotipo, lazy loading quando apropriado, dimensões reservadas e poucas dependências. Evite efeitos pesados.

CONTATO E LEGAIS
Crie um formulário de contato com nome, e-mail, assunto e mensagem. Valide os campos, adicione proteção simples contra spam e salve as mensagens com acesso restrito ao admin.
Escreva textos iniciais claros e responsáveis para Sobre, Como pesquisamos, Privacidade, Cookies e Aviso de Afiliados. Não invente endereço, CNPJ, equipe, avaliações, parceiros ou certificações. Use campos fáceis de atualizar quando faltarem informações específicas.

NÃO IMPLEMENTAR AGORA
Comentários, cadastro público, área de membros, loja, pagamentos, comparador automatizado, newsletter complexa, anúncios, geração automática de artigos, tradução e aplicativo móvel.

CRITÉRIOS DE CONCLUSÃO
- Nenhuma página com lorem ipsum.
- Nenhum botão sem ação.
- Nenhum link quebrado.
- Layout correto em celular e desktop.
- Rotas diretas funcionam ao atualizar a página.
- Rascunhos nunca aparecem publicamente.
- Admin protegido no frontend e no banco.
- Metadados e dados estruturados coerentes.
- Sitemap e robots.txt funcionando.
- Favicon e logotipo oficiais aplicados.
- Formulários com mensagens de sucesso e erro.
- Página 404 funcional.
- Sem dados, métricas ou avaliações inventadas.

Implemente agora a fundação completa. Antes de encerrar, teste os fluxos principais e me entregue um resumo com:
1. o que foi criado;
2. tabelas e regras de acesso;
3. como criar ou definir o primeiro administrador;
4. quais campos ainda precisam de conteúdo real;
5. o que devo testar antes de publicar.
Só faça perguntas se existir um bloqueio real que impeça a construção.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/26b1522c-38c7-481e-afc3-831736d43951).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Configuração para publicação

Defina estas variáveis no ambiente de hospedagem/Lovable Cloud:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
VITE_SITE_URL
```

`VITE_SITE_URL` deve conter o domínio definitivo com `https://` e sem barra no final.

### Primeiro administrador

O painel não oferece cadastro público. Para criar o primeiro acesso:

1. Em Supabase → Authentication → Users, crie o usuário com e-mail e senha forte.
2. Copie o UUID desse usuário.
3. No SQL Editor do Supabase, execute substituindo o valor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DO_USUARIO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

4. Aplique todas as migrações, incluindo
   `20260730190000_admin_panel_storage.sql`.
5. Entre em `/admin/login`.

Nunca coloque a service role key em uma variável iniciada por `VITE_`.
