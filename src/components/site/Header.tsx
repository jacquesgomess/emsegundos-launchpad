import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-light.svg";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Início", exact: true },
  { to: "/artigos" as const, label: "Artigos" },
  { to: "/categoria/$slug" as const, params: { slug: "casa-pratica" }, label: "Casa Prática" },
  {
    to: "/categoria/$slug" as const,
    params: { slug: "tecnologia-em-casa" },
    label: "Tecnologia em Casa",
  },
  { to: "/categoria/$slug" as const, params: { slug: "vida-digital" }, label: "Vida Digital" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="EmSegundos, página inicial">
          <img
            src={logo}
            alt="EmSegundos"
            width={170}
            height={41}
            fetchPriority="high"
            decoding="async"
            className="h-9 w-auto"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              params={"params" in item ? item.params : undefined}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <Link to="/artigos">Ver artigos</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-border bg-card lg:hidden">
          <nav
            aria-label="Navegação principal (celular)"
            className="container-page flex flex-col py-2"
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={"params" in item ? item.params : undefined}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base font-bold text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="brand" className="mt-2 mb-3">
              <Link to="/artigos" onClick={() => setOpen(false)}>
                Ver artigos
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
