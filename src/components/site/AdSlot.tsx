/**
 * Espaço de anúncio com altura reservada.
 *
 * Enquanto nenhuma rede de anúncios estiver aprovada e configurada
 * (`VITE_ADS_ENABLED`), o slot apenas reserva o espaço no layout: nada é
 * exibido, nenhum script de terceiro é carregado e o texto do artigo não
 * "salta" quando os anúncios entrarem no ar (evita CLS).
 */
const RESERVED_HEIGHT: Record<AdSlotPlacement, string> = {
  "article-top": "min-h-[100px] md:min-h-[110px]",
  "article-mid": "min-h-[250px] md:min-h-[280px]",
  "list-footer": "min-h-[100px] md:min-h-[110px]",
};

export type AdSlotPlacement = "article-top" | "article-mid" | "list-footer";

function adsEnabled(): boolean {
  return String(import.meta.env?.VITE_ADS_ENABLED ?? "") === "true";
}

export function AdSlot({
  placement,
  className,
}: {
  placement: AdSlotPlacement;
  className?: string;
}) {
  const enabled = adsEnabled();

  return (
    <div
      data-ad-slot={placement}
      aria-hidden={!enabled}
      className={[
        "w-full",
        RESERVED_HEIGHT[placement],
        enabled
          ? "flex items-center justify-center rounded-xl border border-dashed border-border bg-card/60 text-xs text-muted-foreground"
          : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {enabled ? <span>Publicidade</span> : null}
    </div>
  );
}
