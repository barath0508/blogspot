import type { Metadata } from "next";
import Script from "next/script";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seoHelper";
import reasons from "../api/no/reasons.json";
import { NoServiceContainer } from "./NoServiceContainer";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = buildPageMetadata({
  title: "No-as-a-Service | Professional Refusals",
  description: "Instantly generate professional, polite, or humorous refusal reasons. Say no with confidence.",
  url: `${SITE_URL}/no`,
  keywords: ["no as a service", "refusal generator", "say no politely", "productivity", "excuses", "Trendly"],
});

export default function NoAsAServicePage() {
  const initialReason = reasons[Math.floor(Math.random() * reasons.length)];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "No-as-a-Service",
        "item": `${SITE_URL}/no`
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/no/#webpage`,
    "url": `${SITE_URL}/no`,
    "name": "No-as-a-Service | Trendly",
    "description": "Instantly generate professional, polite, or humorous refusal reasons. Say no with confidence.",
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative flex items-center justify-center py-20 px-4">
      <Script id="no-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="no-page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      
      <NoServiceContainer initialReason={initialReason} />
    </div>
  );
}
