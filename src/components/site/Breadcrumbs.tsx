import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Você está aqui" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li className="flex items-center gap-1">
          <Link to="/" className="hover:text-foreground hover:underline">
            Início
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.to && index < items.length - 1 ? (
              <Link to={item.to} className="hover:text-foreground hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-bold text-foreground">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}