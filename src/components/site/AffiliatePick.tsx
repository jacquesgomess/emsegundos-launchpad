import { Link } from "@tanstack/react-router";

/**
 * Bloco de recomendação de afiliado usado dentro do conteúdo em Markdown.
 * O link comercial sempre sai com rel="sponsored nofollow noopener".
 */
export type AffiliatePickData = {
  produto: string;
  motivo?: string;
  url: string;
  botao?: string;
  observacao?: string;
};

export function AffiliatePick({ data }: { data: AffiliatePickData }) {
  return (
    <aside className="not-prose my-8 rounded-2xl border border-brand-teal/30 bg-brand-teal/5 p-5">
      <p className="text-xs font-bold tracking-wide text-brand-teal uppercase">Recomendação</p>
      <h3 className="mt-2 text-lg font-extrabold text-foreground">{data.produto}</h3>
      {data.motivo ? <p className="mt-2 text-sm text-muted-foreground">{data.motivo}</p> : null}
      <a
        href={data.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-4 inline-flex rounded-md bg-brand-orange px-4 py-2 text-sm font-bold text-brand-navy"
      >
        {data.botao || "Ver opções"}
      </a>
      <p className="mt-3 text-xs text-muted-foreground">
        {data.observacao ? `${data.observacao} ` : ""}Link de afiliado: podemos receber comissão sem
        custo adicional para você.{" "}
        <Link to="/aviso-de-afiliados" className="underline underline-offset-4">
          Saiba mais
        </Link>
        .
      </p>
    </aside>
  );
}

/** Converte o bloco ```afiliado ... ``` em dados validados, ou null. */
export function parseAffiliatePick(body: string): AffiliatePickData | null {
  const fields: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const m = /^\s*([a-zA-Zçã]+)\s*:\s*(.+)$/.exec(line);
    if (m) fields[m[1].toLowerCase()] = m[2].trim();
  }
  const produto = fields["produto"];
  const url = fields["url"];
  if (!produto || !url || !/^https:\/\//i.test(url)) return null;
  return {
    produto,
    url,
    motivo: fields["motivo"],
    botao: fields["botao"],
    observacao: fields["observacao"],
  };
}
