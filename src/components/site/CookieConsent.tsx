import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { loadAnalytics, readConsent, saveConsent, type ConsentValue } from "@/lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = readConsent();
    if (current === "accepted") loadAnalytics();
    if (!current) setVisible(true);
  }, []);

  function decide(value: ConsentValue) {
    saveConsent(value);
    if (value === "accepted") loadAnalytics();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 shadow-[0_-2px_12px_rgba(20,38,61,0.08)]"
    >
      <div className="container-page flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de medição
          de audiência para entender quais conteúdos ajudam mais. Você pode recusar sem perder
          nenhum conteúdo.{" "}
          <Link
            to="/politica-de-cookies"
            className="font-bold text-brand-navy underline underline-offset-4"
          >
            Política de cookies
          </Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-md border-2 border-brand-navy px-4 py-2 text-sm font-bold text-brand-navy focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-md bg-brand-orange px-4 py-2 text-sm font-bold text-brand-navy focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
