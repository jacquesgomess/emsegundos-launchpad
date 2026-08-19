/**
 * Central site configuration.
 * When the definitive domain is connected, set VITE_SITE_URL (or edit
 * FALLBACK_BASE_URL) and canonical URLs, sitemap, Open Graph and structured
 * data all follow automatically.
 */
const FALLBACK_BASE_URL = "https://project--26b1522c-38c7-481e-afc3-831736d43951.lovable.app";

export const SITE = {
  name: "EmSegundos",
  tagline: "Facilite a rotina. Escolha melhor.",
  positioning: "Soluções práticas para sua casa e sua vida digital.",
  description:
    "Guias, tutoriais e comparativos para resolver problemas, usar melhor a tecnologia e escolher com mais segurança.",
  locale: "pt_BR",
  series: ["Resolva sem complicação", "Entenda em segundos", "Escolha melhor"] as const,
};

export function getBaseUrl(): string {
  const fromEnv =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) || FALLBACK_BASE_URL;
  return String(fromEnv || "").replace(/\/$/, "");
}

/** Absolute URL when a base URL is configured, otherwise a root-relative path. */
export function siteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${clean}`;
}

export const LEGAL_PAGES = [
  { to: "/sobre", label: "Sobre" },
  { to: "/como-pesquisamos", label: "Como pesquisamos" },
  { to: "/contato", label: "Contato" },
  { to: "/politica-de-privacidade", label: "Política de privacidade" },
  { to: "/politica-de-cookies", label: "Política de cookies" },
  { to: "/aviso-de-afiliados", label: "Aviso de afiliados" },
  { to: "/termos-de-uso", label: "Termos de uso" },
] as const;

export const CATEGORY_LINKS = [
  { slug: "casa-pratica", label: "Casa Prática" },
  { slug: "tecnologia-em-casa", label: "Tecnologia em Casa" },
  { slug: "vida-digital", label: "Vida Digital" },
] as const;
