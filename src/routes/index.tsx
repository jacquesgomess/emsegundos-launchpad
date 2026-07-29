import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, ClipboardCheck, Compass, Wrench } from "lucide-react";

import { PostCard } from "@/components/site/PostCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { listCategories, listPublishedPosts } from "@/lib/blog.functions";
import type { Category, PostSummary } from "@/lib/blog.types";
import { SITE, siteUrl } from "@/lib/site";

const CATEGORY_ICONS: Record<string, typeof Wrench> = {
  "casa-pratica": Wrench,
  "tecnologia-em-casa": Compass,
  "vida-digital": BookOpenCheck,
};

const SERIES = [
  {
    name: "Resolva sem complicação",
    description: "Passo a passo direto para destravar um problema comum do dia a dia.",
  },
  {
    name: "Entenda em segundos",
    description: "Explicações curtas para entender como algo funciona antes de decidir.",
  },
  {
    name: "Escolha melhor",
    description: "Comparativos honestos entre alternativas, com critérios claros.",
  },
];

export const Route = createFileRoute("/")({
  loader: async (): Promise<{
    categories: Category[];
    featured: PostSummary | null;
    recent: PostSummary[];
  }> => {
    const [categories, featured, recent] = await Promise.all([
      listCategories(),
      listPublishedPosts({ data: { featured: true, limit: 1 } }),
      listPublishedPosts({ data: { limit: 6 } }),
    ]);
    return { categories, featured: featured.posts[0] ?? null, recent: recent.posts };
  },
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.positioning}` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — ${SITE.positioning}` },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: siteUrl("/"),
          slogan: SITE.tagline,
          description: SITE.description,
        }),
      },
    ],
  }),
  component: Index,
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center text-muted-foreground">
        Não foi possível carregar os conteúdos agora. Atualize a página em instantes.
      </div>
    </SiteLayout>
  ),
});

function Index() {
  const { categories, featured, recent } = Route.useLoaderData();
  const rest = recent.filter((post) => post.id !== featured?.id).slice(0, 6);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-teal uppercase">
              {SITE.tagline}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-foreground md:text-5xl">
              {SITE.positioning}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{SITE.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg">
                <Link to="/artigos">Ver soluções</Link>
              </Button>
              <Button asChild variant="brandOutline" size="lg">
                <Link to="/categoria/$slug" params={{ slug: "tecnologia-em-casa" }}>
                  Começar pelo Wi-Fi
                </Link>
              </Button>
            </div>
          </div>

          <ul className="grid gap-4 rounded-2xl bg-brand-cream p-6 sm:grid-cols-2 lg:grid-cols-1">
            {SERIES.map((serie) => (
              <li key={serie.name} className="rounded-xl bg-background p-4">
                <p className="text-sm font-bold text-brand-navy">{serie.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{serie.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="destaque">
        <h2 id="destaque" className="text-2xl font-extrabold text-foreground">
          Em destaque
        </h2>
        <div className="mt-6">
          {featured ? (
            <PostCard post={featured} featured />
          ) : (
            <EmptyState message="Ainda não há artigo em destaque publicado. O primeiro conteúdo aparece aqui assim que for publicado." />
          )}
        </div>
      </section>

      <section className="container-page pb-14" aria-labelledby="categorias">
        <h2 id="categorias" className="text-2xl font-extrabold text-foreground">
          Escolha por onde começar
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Compass;
            return (
              <Link
                key={category.id}
                to="/categoria/$slug"
                params={{ slug: category.slug }}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand-teal"
              >
                <Icon className="h-6 w-6 text-brand-teal" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-extrabold text-foreground">{category.name}</h3>
                {category.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-navy">
                  Ver artigos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-14" aria-labelledby="recentes">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="recentes" className="text-2xl font-extrabold text-foreground">
            Artigos recentes
          </h2>
          <Link to="/artigos" className="text-sm font-bold text-brand-navy underline-offset-4 hover:underline">
            Ver todos os artigos
          </Link>
        </div>
        {rest.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState message="Nenhum artigo publicado ainda. Os conteúdos em preparação são publicados aqui após a revisão editorial." />
          </div>
        )}
      </section>

      <section className="border-y border-border bg-card" aria-labelledby="metodo">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <ClipboardCheck className="h-7 w-7 text-brand-teal" aria-hidden="true" />
            <h2 id="metodo" className="mt-4 text-2xl font-extrabold text-foreground">
              Como trabalhamos
            </h2>
          </div>
          <div>
            <p className="text-base text-muted-foreground">
              Escrevemos guias práticos com linguagem simples, indicamos as fontes consultadas e
              revisamos o conteúdo quando algo muda. Quando um artigo contém links de afiliados,
              isso é informado antes do primeiro link.
            </p>
            <Link
              to="/como-pesquisamos"
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-navy underline-offset-4 hover:underline"
            >
              Conheça o método editorial
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
