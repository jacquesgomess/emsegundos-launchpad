import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$")({
  // Real 404 status: crawlers must not treat missing pages as valid content.
  loader: () => {
    throw notFound();
  },
  head: () => ({
    meta: [
      { title: `Página não encontrada — ${SITE.name}` },
      { name: "description", content: "O endereço solicitado não existe ou foi movido." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundBoundary() {
  return <NotFoundPage />;
}

function NotFoundPage() {
  return (
    <SiteLayout>
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-6xl font-extrabold text-brand-teal">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">Página não encontrada</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          O endereço que você abriu não existe ou foi movido.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/artigos"
            className="rounded-md bg-brand-orange px-4 py-2 text-sm font-bold text-brand-navy"
          >
            Ver artigos
          </Link>
          <Link
            to="/"
            className="rounded-md border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy"
          >
            Ir para a página inicial
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
