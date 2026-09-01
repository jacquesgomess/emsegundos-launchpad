import { Fragment, type ReactNode } from "react";

import { AffiliatePick, parseAffiliatePick } from "@/components/site/AffiliatePick";

export type Heading = { id: string; text: string; level: 2 | 3 };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function extractHeadings(markdown: string): Heading[] {
  const out: Heading[] = [];
  const used = new Set<string>();
  let inFence = false;
  for (const raw of markdown.split("\n")) {
    if (raw.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(raw.trim());
    if (!m) continue;
    const text = stripInline(m[2]);
    let id = slugifyHeading(text) || `secao-${out.length + 1}`;
    while (used.has(id)) id = `${id}-${out.length + 1}`;
    used.add(id);
    out.push({ id, text, level: m[1].length === 2 ? 2 : 3 });
  }
  return out;
}

function stripInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function isSafeHref(href: string): boolean {
  const value = href.trim().toLowerCase();
  return (
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:")
  );
}

/** Minimal, dependency-free inline renderer (no raw HTML is ever injected). */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("![")) {
      const m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(token);
      if (m && isSafeHref(m[2])) {
        nodes.push(<img key={key} src={m[2]} alt={m[1]} loading="lazy" decoding="async" />);
      } else nodes.push(token);
    } else if (token.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (m && isSafeHref(m[2])) {
        const external = /^https?:/i.test(m[2]);
        nodes.push(
          <a
            key={key}
            href={m[2]}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[1]}
          </a>,
        );
      } else nodes.push(token);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  const usedIds = new Set<string>();
  let i = 0;
  let key = 0;

  const headingId = (text: string) => {
    let id = slugifyHeading(text) || `secao-${usedIds.size + 1}`;
    while (usedIds.has(id)) id = `${id}-${usedIds.size + 1}`;
    usedIds.add(id);
    return id;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const info = trimmed.slice(3).trim().toLowerCase();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      if (info === "afiliado" || info === "afiliados") {
        const pick = parseAffiliatePick(code.join("\n"));
        if (pick) {
          blocks.push(<AffiliatePick key={key++} data={pick} />);
          continue;
        }
      }
      blocks.push(
        <pre key={key++}>
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const inline = renderInline(text, `h${key}`);
      if (level === 1) blocks.push(<h2 key={key++}>{inline}</h2>);
      else if (level === 2) {
        blocks.push(
          <h2 key={key++} id={headingId(stripInline(text))}>
            {inline}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3 key={key++} id={headingId(stripInline(text))}>
            {inline}
          </h3>,
        );
      } else blocks.push(<h4 key={key++}>{inline}</h4>);
      i++;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(<blockquote key={key++}>{renderInline(quote.join(" "), `q${key}`)}</blockquote>);
      continue;
    }

    const bullet = /^[-*+]\s+/;
    const ordered = /^\d+[.)]\s+/;
    if (bullet.test(trimmed) || ordered.test(trimmed)) {
      const isOrdered = ordered.test(trimmed);
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (isOrdered ? ordered.test(t) : bullet.test(t)) {
          items.push(t.replace(isOrdered ? ordered : bullet, ""));
          i++;
        } else if (t === "") {
          break;
        } else {
          items[items.length - 1] += ` ${t}`;
          i++;
        }
      }
      const ListTag = isOrdered ? "ol" : "ul";
      blocks.push(
        <ListTag key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li${key}-${idx}`)}</li>
          ))}
        </ListTag>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      const t = lines[i].trim();
      if (/^(#{1,6})\s/.test(t) || t.startsWith(">") || t.startsWith("```")) break;
      paragraph.push(t);
      i++;
    }
    blocks.push(<p key={key++}>{renderInline(paragraph.join(" "), `p${key}`)}</p>);
  }

  return <Fragment>{blocks}</Fragment>;
}

export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Returns the YouTube video id for a valid watch/short/embed URL, else null. */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const m = /^\/(embed|shorts|v)\/([^/?]+)/.exec(parsed.pathname);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Divide o conteúdo em duas partes num limite de H2 próximo ao meio, para
 * inserir um espaço de anúncio sem cortar frases. Sem H2 suficiente, devolve
 * o conteúdo inteiro na primeira parte.
 */
export function splitAtMiddleHeading(markdown: string): [string, string] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const middle = lines.length / 2;
  let inFence = false;
  let best = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!/^##\s+/.test(t)) continue;
    if (best === -1 || Math.abs(i - middle) < Math.abs(best - middle)) best = i;
  }
  if (best <= 0 || best >= lines.length - 3) return [markdown, ""];
  return [lines.slice(0, best).join("\n"), lines.slice(best).join("\n")];
}
