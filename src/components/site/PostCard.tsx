import { Link } from "@tanstack/react-router";

import { formatDate, type PostSummary } from "@/lib/blog.types";

export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return (
    <article
      className={
        featured
          ? "grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2"
          : "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
      }
    >
      <Link
        to="/artigos/$slug"
        params={{ slug: post.slug }}
        tabIndex={-1}
        aria-hidden="true"
        className="block bg-brand-cream"
      >
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? ""}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            className={featured ? "h-full w-full object-cover" : "aspect-[16/9] w-full object-cover"}
          />
        ) : (
          <div
            className={`flex items-center justify-center bg-brand-navy/5 ${featured ? "h-full min-h-52" : "aspect-[16/9]"}`}
          >
            <span className="text-sm font-bold text-brand-navy/40">EmSegundos</span>
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:p-8" : ""}`}>
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
            <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-brand-gray">
              {post.series}
            </span>
          ) : null}
        </div>

        <h3 className={`mt-3 font-extrabold text-foreground ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
          <Link
            to="/artigos/$slug"
            params={{ slug: post.slug }}
            className="underline-offset-4 hover:underline"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        ) : null}

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {post.published_at ? <time dateTime={post.published_at}>{formatDate(post.published_at)}</time> : null}
          {post.reading_minutes ? <span>{post.reading_minutes} min de leitura</span> : null}
        </p>
      </div>
    </article>
  );
}