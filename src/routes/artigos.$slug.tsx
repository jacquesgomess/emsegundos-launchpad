import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PostCard } from "@/components/site/PostCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getPublishedPost } from "@/lib/blog.functions";
import { formatDate, type PostDetail, type PostSummary } from "@/lib/blog.types";
import { Markdown, extractHeadings, youtubeId } from "@/lib/markdown";
import { SITE, siteUrl } from "@/lib/site";

export const Route = createFileRoute("/artigos/$slug")({
  loader: async ({ params }): Promise<{ post: PostDetail; related: PostSummary[] }> => {
    const result = await getPublishedPost({ data: { slug: params.slug } });
    if (!result.post) throw notFound();
    return { post: result.post, related: result.related };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Artigo indisponível — ${SITE.name}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const post = loaderData.post;
    const title = post.seo_title || `${post.title} — ${SITE.name}`;
    const description = post.seo_description || post.excerpt || SITE.description;
    const url = siteUrl(`/artigos/${params.slug}`);
    const image = post.og_image_url || post.cover_image_url || null;
    const video = youtubeId(post.youtube_url);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(image && /^https:\/\//.test(image)
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: post.canonical_url || url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description,
            inLanguage: "pt-BR",
            mainEntityOfPage: url,
            datePublished: post.published_at ?? undefined,
            dateModified: post.updated_content_at ?? post.published_at ?? undefined,
            author: { "@type": "Organization", name: post.author_name || SITE.name },
            publisher: { "@type": "Organization", name: SITE.name },
            ...(image ? { image } : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: siteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Artigos", item: siteUrl("/artigos") },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
        ...(video && post.published_at
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: post.title,
                  description,
                  uploadDate: post.published_at,
                  embedUrl: `https://www.youtube-nocookie.com/embed/${video}`,
                  thumbnailUrl: `https://i.ytimg.com/vi/${video}/hqdefault.jpg`,
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: PostPage,
  notFoundComponent: ArtigoNaoEncontrado,
  errorComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center text-muted-foreground">
        Não foi possível carregar este artigo agora. Tente atualizar a página.
      </div>
    </SiteLayout>
  ),
});

function ArtigoNaoEncontrado() {
  return (
    <SiteLayout>
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Artigo não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este endereço não corresponde a nenhum artigo publicado.
        </p>
        <Link
          to="/artigos"
          className="mt-6 inline-flex rounded-md bg-brand-orange px-4 py-2 text-sm font-bold text-brand-navy"
        >
          Ver todos os artigos
        </Link>
      </div>
    </SiteLayout>
  );
}

function PostPage() {
  const { post, related } = Route.useLoaderData() as {
    post: PostDetail;
    related: PostSummary[];
  };
  const headings = extractHeadings(post.content);
  const video = youtubeId(post.youtube_url);
  const shareUrl = siteUrl(`/artigos/${post.slug}`);

  return (
    <SiteLayout>
      <article className="container-page py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Artigos", to: "/artigos" },
            ...(post.category ? [{ label: post.category.name }] : []),
            { label: post.title },
          ]}
        />

        <header className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {post.category ? (
              <Link
                to="/categoria/$slug"
                params={{ slug: post.category.slug }}
                className="rounded-full bg-brand-teal/10 px-3 py-1 text-brand-teal"
              >
                {post.category.name}
              </Link>
            ) : null}
            {post.series ? (
              <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-brand-navy">
                {post.series}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-foreground md:text-4xl">{post.title}</h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          ) : null}
          <p className="mt-4 text-sm text-muted-foreground">
            {post.author_name ? <span>Por {post.author_name} · </span> : null}
            {post.published_at ? (
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            ) : null}
            {post.updated_content_at ? (
              <span>
                {" "}
                · Atualizado em{" "}
                <time dateTime={post.updated_content_at}>
                  {formatDate(post.updated_content_at)}
                </time>
              </span>
            ) : null}
            {post.reading_minutes ? <span> · {post.reading_minutes} min de leitura</span> : null}
          </p>
        </header>

        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? ""}
            width={1200}
            height={675}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 800px"
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        ) : null}

        {video ? (
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-brand-navy/5">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video}`}
              title={`Vídeo: ${post.title}`}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        ) : null}

        {post.has_affiliate_links ? (
          <p className="mt-8 rounded-xl border border-brand-orange/40 bg-brand-orange/10 p-4 text-sm text-foreground">
            Este conteúdo pode conter links de afiliados. Se você comprar por eles, podemos receber
            uma comissão sem custo adicional para você.{" "}
            <Link to="/aviso-de-afiliados" className="font-bold underline underline-offset-4">
              Entenda como funciona
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="article-prose min-w-0">
            <Markdown content={post.content} />
          </div>

          {headings.length > 1 ? (
            <nav
              aria-label="Sumário do artigo"
              className="order-first rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24 lg:order-none"
            >
              <h2 className="text-sm font-bold tracking-wide text-brand-navy uppercase">
                Neste artigo
              </h2>
              <ol className="mt-3 space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "pl-4" : undefined}>
                    <a
                      href={`#${h.id}`}
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>

        {post.tags.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {post.sources.length > 0 ? (
          <section
            className="mt-10 rounded-2xl border border-border bg-card p-6"
            aria-labelledby="fontes"
          >
            <h2 id="fontes" className="text-lg font-extrabold text-foreground">
              Fontes consultadas
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {post.sources.map((source) => (
                <li key={`${source.name}-${source.url}`}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-brand-navy underline underline-offset-4"
                    >
                      {source.name || source.url}
                    </a>
                  ) : (
                    <span>{source.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="compartilhar">
          <h2
            id="compartilhar"
            className="text-sm font-bold tracking-wide text-muted-foreground uppercase"
          >
            Compartilhar
          </h2>
          <ul className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
            <li>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-navy underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-navy underline-offset-4 hover:underline"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
                className="text-brand-navy underline-offset-4 hover:underline"
              >
                E-mail
              </a>
            </li>
          </ul>
        </section>

        {related.length > 0 ? (
          <section className="mt-14" aria-labelledby="relacionados">
            <h2 id="relacionados" className="text-2xl font-extrabold text-foreground">
              Continue lendo
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteLayout>
  );
}
