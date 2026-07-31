import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/PostCard";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { getCategoryBySlug, listPublishedPosts } from "@/lib/blog.functions";
import type { Category, PostSummary } from "@/lib/blog.types";
import { SITE, siteUrl } from "@/lib/site";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }): Promise<{ category: Category; posts: PostSummary[] }> => {
    const category = await getCategoryBySlug({ data: { slug: params.slug } });
    if (!category) throw notFound();
    const result = await listPublishedPosts({ data: { categorySlug: params.slug, limit: 24 } });
    return { category, posts: result.posts };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Categoria indisponível — ${SITE.name}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { category } = loaderData;
    const title = `${category.name} — ${SITE.name}`;
    const description =
      category.description ?? `Artigos da categoria ${category.name} publicados pelo ${SITE.name}.`;
    const url = siteUrl(`/categoria/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: siteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Artigos", item: siteUrl("/artigos") },
              { "@type": "ListItem", position: 3, name: category.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CategoriaPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Categoria não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este endereço não corresponde a nenhuma categoria do site.
        </p>
        <Link
          to="/artigos"
          className="mt-6 inline-flex rounded-md bg-brand-orange px-4 py-2 text-sm font-bold text-brand-navy"
        >
          Ver todos os artigos
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center text-muted-foreground">
        Não foi possível carregar esta categoria agora. Tente atualizar a página.
      </div>
    </SiteLayout>
  ),
});

function CategoriaPage() {
  const { category, posts } = Route.useLoaderData() as {
    category: Category;
    posts: PostSummary[];
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Categoria"
        title={category.name}
        description={category.description ?? undefined}
      >
        <Breadcrumbs items={[{ label: "Artigos", to: "/artigos" }, { label: category.name }]} />
      </PageHeader>

      <div className="container-page py-10">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-lg font-extrabold text-foreground">
              Ainda não há artigos publicados nesta categoria
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Os conteúdos em preparação aparecem aqui depois da revisão editorial.
            </p>
            <Link
              to="/artigos"
              className="mt-5 inline-flex rounded-md border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy"
            >
              Ver todos os artigos
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
