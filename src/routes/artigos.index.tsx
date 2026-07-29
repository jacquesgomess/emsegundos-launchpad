import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/PostCard";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listCategories, listPublishedPosts } from "@/lib/blog.functions";
import type { Category, PostSummary } from "@/lib/blog.types";
import { SITE, siteUrl } from "@/lib/site";

const PAGE_SIZE = 9;

type Search = { q?: string; categoria?: string; pagina?: number };

export const Route = createFileRoute("/artigos/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" && search.q.trim() ? search.q.slice(0, 120) : undefined,
    categoria:
      typeof search.categoria === "string" && search.categoria.trim()
        ? search.categoria.slice(0, 80)
        : undefined,
    pagina: Number(search.pagina) > 1 ? Math.min(Number(search.pagina), 200) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({
    deps,
  }): Promise<{ categories: Category[]; posts: PostSummary[]; total: number }> => {
    const page = deps.pagina ?? 1;
    const [categories, result] = await Promise.all([
      listCategories(),
      listPublishedPosts({
        data: {
          search: deps.q,
          categorySlug: deps.categoria,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        },
      }),
    ]);
    return { categories, posts: result.posts, total: result.total };
  },
  head: () => ({
    meta: [
      { title: `Artigos — ${SITE.name}` },
      {
        name: "description",
        content:
          "Todos os guias, tutoriais e comparativos do EmSegundos para resolver problemas de casa e da vida digital.",
      },
      { property: "og:title", content: `Artigos — ${SITE.name}` },
      {
        property: "og:description",
        content: "Guias, tutoriais e comparativos práticos publicados pelo EmSegundos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/artigos") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/artigos") }],
  }),
  component: ArtigosPage,
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center text-muted-foreground">
        Não foi possível carregar os artigos agora. Tente atualizar a página.
      </div>
    </SiteLayout>
  ),
});

function ArtigosPage() {
  const { categories, posts, total } = Route.useLoaderData() as {
    categories: Category[];
    posts: PostSummary[];
    total: number;
  };
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/artigos" });
  const [term, setTerm] = useState(search.q ?? "");

  useEffect(() => {
    setTerm(search.q ?? "");
  }, [search.q]);

  const page = search.pagina ?? 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <SiteLayout>
      <PageHeader
        title="Artigos"
        description="Conteúdos práticos para resolver problemas em casa, usar melhor a tecnologia e escolher com mais segurança."
      >
        <Breadcrumbs items={[{ label: "Artigos" }]} />
      </PageHeader>

      <div className="container-page py-10">
        <form
          role="search"
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ search: { ...search, q: term.trim() || undefined, pagina: undefined } });
          }}
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="busca" className="sr-only">
              Buscar artigos
            </label>
            <Input
              id="busca"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Buscar por título ou resumo"
              maxLength={120}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="navy">
            Buscar
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <FilterChip active={!search.categoria} to={{ ...search, categoria: undefined, pagina: undefined }}>
            Todas
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              active={search.categoria === category.slug}
              to={{ ...search, categoria: category.slug, pagina: undefined }}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>

        {posts.length > 0 ? (
          <>
            <p className="mt-8 text-sm text-muted-foreground">
              {total} {total === 1 ? "artigo encontrado" : "artigos encontrados"}
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Paginação"
                className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6"
              >
                {page > 1 ? (
                  <Link
                    to="/artigos"
                    search={{ ...search, pagina: page - 1 > 1 ? page - 1 : undefined }}
                    className="text-sm font-bold text-brand-navy underline-offset-4 hover:underline"
                  >
                    ← Página anterior
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    to="/artigos"
                    search={{ ...search, pagina: page + 1 }}
                    className="text-sm font-bold text-brand-navy underline-offset-4 hover:underline"
                  >
                    Próxima página →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-extrabold text-foreground">Nenhum artigo encontrado</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {search.q || search.categoria
                ? "Ajuste a busca ou remova os filtros para ver todos os conteúdos disponíveis."
                : "Ainda não há artigos publicados. Os conteúdos em preparação aparecem aqui após a revisão editorial."}
            </p>
            {search.q || search.categoria ? (
              <Button asChild variant="brandOutline" className="mt-5">
                <Link to="/artigos" search={{}}>
                  Limpar filtros
                </Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function FilterChip({
  active,
  to,
  children,
}: {
  active: boolean;
  to: Search;
  children: React.ReactNode;
}) {
  return (
    <Link
      to="/artigos"
      search={to}
      className={
        active
          ? "rounded-full bg-brand-navy px-4 py-2 text-sm font-bold text-white"
          : "rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-brand-navy hover:border-brand-teal"
      }
    >
      {children}
    </Link>
  );
}