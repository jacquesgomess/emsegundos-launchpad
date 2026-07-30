import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/blog.functions";
import { SITE, siteUrl } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: `Contato — ${SITE.name}` },
      {
        name: "description",
        content:
          "Envie sugestões, correções ou dúvidas para a equipe do EmSegundos pelo formulário de contato.",
      },
      { property: "og:title", content: `Contato — ${SITE.name}` },
      {
        property: "og:description",
        content: "Fale com a equipe do EmSegundos: sugestões, correções e dúvidas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/contato") },
    ],
    links: [{ rel: "canonical", href: siteUrl("/contato") }],
  }),
  component: ContatoPage,
});

type Status = { type: "idle" } | { type: "ok" } | { type: "error"; message: string };

function ContatoPage() {
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus({ type: "idle" });
    try {
      await sendContactMessage({
        data: {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          subject: String(data.get("subject") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
          elapsedMs: Date.now() - startedAt.current,
        },
      });
      form.reset();
      startedAt.current = Date.now();
      setStatus({ type: "ok" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : "Não foi possível enviar a mensagem. Tente novamente.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <SiteLayout>
      <PageHeader
        title="Contato"
        description="Sugestões de pauta, correções e dúvidas sobre os conteúdos são bem-vindas."
      >
        <Breadcrumbs items={[{ label: "Contato" }]} />
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5" noValidate={false}>
          <div>
            <label htmlFor="name" className="text-sm font-bold text-foreground">
              Nome
            </label>
            <Input id="name" name="name" required minLength={2} maxLength={100} className="mt-2" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-foreground">
              E-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={255}
              className="mt-2"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="subject" className="text-sm font-bold text-foreground">
              Assunto
            </label>
            <Input
              id="subject"
              name="subject"
              required
              minLength={2}
              maxLength={150}
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-bold text-foreground">
              Mensagem
            </label>
            <Textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={7}
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">Mínimo de 10 caracteres.</p>
          </div>

          {/* Honeypot: invisível para pessoas, preenchido por robôs. */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="website">Não preencha este campo</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <Button type="submit" variant="brand" disabled={sending}>
            {sending ? "Enviando..." : "Enviar mensagem"}
          </Button>

          <div aria-live="polite" role="status">
            {status.type === "ok" ? (
              <p className="rounded-xl border border-brand-teal/40 bg-brand-teal/10 p-4 text-sm text-foreground">
                Mensagem enviada. Obrigado pelo contato — respondemos assim que possível.
              </p>
            ) : null}
            {status.type === "error" ? (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                {status.message}
              </p>
            ) : null}
          </div>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-extrabold text-foreground">Outras formas de falar</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Prefere e-mail? Escreva para{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="font-bold text-brand-navy underline underline-offset-4"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Para correções, informe o endereço do artigo e o trecho que precisa de ajuste.
          </p>
        </aside>
      </div>
    </SiteLayout>
  );
}