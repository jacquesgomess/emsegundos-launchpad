import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type OAuthDetails = {
  client?: { name?: string | null } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: unknown }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: unknown }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: unknown }>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id: typeof search.authorization_id === "string" ? search.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Parâmetro authorization_id ausente.");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/admin/login", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  head: () => ({
    meta: [
      { title: "Autorizar acesso — EmSegundos" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="container-page py-20">
      <h1 className="text-2xl font-extrabold text-foreground">Não foi possível autorizar</h1>
      <p className="mt-2 text-sm text-muted-foreground">{errorMessage(error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "um aplicativo";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const { data, error: decisionError } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (decisionError) {
      setBusy(false);
      setError(errorMessage(decisionError));
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um endereço de retorno.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-bold tracking-wide text-brand-teal uppercase">Autorização</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground">
          Conectar {clientName} à sua conta
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Ao aprovar, {clientName} poderá usar as ferramentas do EmSegundos em seu nome, com as
          mesmas permissões da sua conta.
        </p>
        {error ? (
          <p role="alert" className="mt-4 text-sm font-bold text-destructive">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <Button variant="navy" disabled={busy} onClick={() => decide(true)}>
            {busy ? "Processando…" : "Aprovar"}
          </Button>
          <Button variant="brandOutline" disabled={busy} onClick={() => decide(false)}>
            Recusar
          </Button>
        </div>
      </div>
    </main>
  );
}
