import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import logo from "@/assets/logo-light.svg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — EmSegundos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" aria-label="Voltar ao EmSegundos">
            <img src={logo} alt="EmSegundos" width={150} height={36} className="h-8 w-auto" />
          </Link>
          <span className="text-sm font-bold text-muted-foreground">Área administrativa</span>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
