/**
 * Consentimento de cookies/medição.
 * Nenhum script de terceiros é carregado antes de "accepted".
 */
export type ConsentValue = "accepted" | "rejected";

const STORAGE_KEY = "emsegundos.consent.v1";
const EVENT = "emsegundos:consent";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "accepted" || raw === "rejected" ? raw : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* navegador sem armazenamento: apenas segue sem persistir */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function onConsentChange(handler: (value: ConsentValue) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<ConsentValue>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/**
 * Carrega a medição de audiência apenas depois do aceite.
 * O ID só existe quando VITE_GA_MEASUREMENT_ID é configurado; sem ele,
 * o site usa apenas as métricas nativas de hospedagem (sem cookies).
 */
let analyticsLoaded = false;

export function loadAnalytics(): void {
  if (typeof window === "undefined" || analyticsLoaded) return;
  const id = import.meta.env?.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!id) return;
  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => w.dataLayer!.push(args);
  gtag("js", new Date());
  gtag("config", id, { anonymize_ip: true });
}
