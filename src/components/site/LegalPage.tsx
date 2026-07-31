import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { SITE, siteUrl } from "@/lib/site";

export function contentHead({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const fullTitle = `${title} — ${SITE.name}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl(path) },
    ],
    links: [{ rel: "canonical", href: siteUrl(path) }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: siteUrl("/") },
            { "@type": "ListItem", position: 2, name: title, item: siteUrl(path) },
          ],
        }),
      },
    ],
  };
}

export function ContentPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <PageHeader title={title} description={description}>
        <Breadcrumbs items={[{ label: title }]} />
      </PageHeader>
      <div className="container-page py-10">
        <div className="article-prose max-w-3xl">{children}</div>
      </div>
    </SiteLayout>
  );
}
