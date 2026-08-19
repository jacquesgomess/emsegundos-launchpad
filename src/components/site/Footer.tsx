import { Link } from "@tanstack/react-router";

import logoDark from "@/assets/logo-dark.svg";
import { CATEGORY_LINKS, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-brand-navy text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img
            src={logoDark}
            alt="EmSegundos"
            width={200}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-white/70">{SITE.tagline}</p>
          <p className="mt-2 max-w-sm text-sm text-white/70">{SITE.description}</p>
        </div>

        <nav aria-label="Categorias">
          <h2 className="text-sm font-bold tracking-wide text-brand-teal-light uppercase">
            Categorias
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORY_LINKS.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  className="text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/artigos"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Todos os artigos
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Páginas institucionais">
          <h2 className="text-sm font-bold tracking-wide text-brand-teal-light uppercase">
            Institucional
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/sobre"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/como-pesquisamos"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Como pesquisamos
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Contato
              </Link>
            </li>
            <li>
              <Link
                to="/politica-de-privacidade"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/politica-de-cookies"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Política de cookies
              </Link>
            </li>
            <li>
              <Link
                to="/aviso-de-afiliados"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Aviso de afiliados
              </Link>
            </li>
            <li>
              <Link
                to="/termos-de-uso"
                className="text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Termos de uso
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name}. Conteúdo informativo — não substitui orientação técnica
            profissional.
          </p>
          <p>
            Alguns conteúdos podem incluir links de afiliados, sempre identificados.{" "}
            <Link
              to="/aviso-de-afiliados"
              className="underline underline-offset-4 hover:text-white"
            >
              Saiba mais
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
