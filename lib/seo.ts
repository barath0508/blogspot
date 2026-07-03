import type { Metadata } from "next";
import { getSiteUrl } from "./seoHelper";

type GenerateSeoOptions = {
  title: string;
  excerpt?: string | null;
  content: string;
  meta_title?: string | null;
  meta_description?: string | null;
  seo_keywords?: string[] | string | null;
};

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article" | "profile" | "book";
};

const STOP_WORDS = new Set([
  "about","after","again","also","an","and","any","been","before","being","between",
  "both","but","by","can","could","did","do","does","for","from","have","had","has",
  "having","he","her","here","hers","him","his","how","if","in","into","is","it","its",
  "like","more","most","many","must","my","no","not","now","of","on","one","only","or",
  "other","our","out","over","said","same","she","should","since","some","such","than",
  "that","the","their","them","then","there","these","they","this","those","through",
  "to","too","under","up","very","was","we","were","what","when","where","which","while",
  "who","will","with","would","you","your"
]);

function normalizeKeywords(raw: string[] | string | null | undefined): string[] {
  const keywords = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : [];
  return [...new Set(
    keywords.map((k) => String(k || "").trim()).filter((k) => k.length > 0).slice(0, 12)
  )];
}

function extractKeywordsFromText(text: string, maxKeywords = 10): string[] {
  const words = text
    .toLowerCase()
    .replace(/[''""\"'`]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([w]) => w)
    .slice(0, maxKeywords);
}

function stripMarkdown(text: string): string {
  return text
    // Remove inline links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove images ![alt](url) -> empty
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Remove bold/italic formatting
    .replace(/[*_~`]/g, "")
    // Remove headers (# Title)
    .replace(/^#+\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "");
}

function buildMetaTitle(title: string): string {
  const cleanTitle = title.trim();
  const brand = "Trendly";
  if (cleanTitle.endsWith(brand)) {
    return cleanTitle.slice(0, 60);
  }
  const suffix = ` | ${brand}`;
  if (cleanTitle.length + suffix.length <= 60) {
    return cleanTitle + suffix;
  }
  const maxTitleLength = 60 - suffix.length;
  return cleanTitle.slice(0, maxTitleLength).trim() + suffix;
}

function buildMetaDescription(excerpt: string | null | undefined, content: string): string {
  const rawText = excerpt || content;
  const strippedText = stripMarkdown(rawText);
  const cleanText = strippedText
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanText.length > 155) {
    return cleanText.slice(0, 152).trim() + "...";
  }
  return cleanText;
}

export function generateSeoMetadata(options: GenerateSeoOptions) {
  const keywords = normalizeKeywords(options.seo_keywords);
  const resolvedKeywords = keywords.length
    ? keywords
    : extractKeywordsFromText(`${options.title} ${options.excerpt ?? ""} ${options.content}`);

  const meta_title = options.meta_title?.trim()
    ? options.meta_title.trim().slice(0, 60)
    : buildMetaTitle(options.title);

  const meta_description = options.meta_description?.trim()
    ? options.meta_description.trim().slice(0, 160)
    : buildMetaDescription(options.excerpt, options.content);

  return { meta_title, meta_description, seo_keywords: resolvedKeywords };
}

export async function pingSearchEngines(): Promise<void> {
  const base = getSiteUrl();
  if (!base) return;
  const sitemapUrl = encodeURIComponent(`${base}/sitemap.xml`);
  await Promise.allSettled([
    fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`, { signal: AbortSignal.timeout(8000) })
  ]);
}

/**
 * Submits a URL to IndexNow (Bing, Yandex, Seznam, Naver) for instant indexing.
 * Fires-and-forgets — never throws.
 */
export async function pingIndexNow(slug: string): Promise<void> {
  const base = getSiteUrl();
  const key = "f8d17c11209945da88ec4617d4cec8fb";
  if (!base) return;

  const url = `${base}/blog/${slug}`;

  // IndexNow supports multiple search engines — ping all at once
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://search.seznam.cz/indexnow",
    "https://yandex.com/indexnow"
  ];

  const body = JSON.stringify({
    host: new URL(base).hostname,
    key,
    keyLocation: `${base}/${key}.txt`,
    urlList: [url]
  });

  await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        signal: AbortSignal.timeout(8000)
      })
    )
  );
}

export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const imageUrl = options.imageUrl ?? `${getSiteUrl()}/og-default.png`;
  const metadataType = options.type ?? "website";

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords ?? ["technology", "AI", "news", "analysis", "Trendly"],
    alternates: {
      canonical: options.url,
      languages: {
        "en-US": options.url,
        "en-GB": options.url,
        "x-default": options.url,
      },
    },
    robots: { index: !options.noindex, follow: true },
    openGraph: {
      title: options.title,
      description: options.description,
      url: options.url,
      siteName: "Trendly",
      type: metadataType,
      locale: "en_US",
      images: [{ url: imageUrl, alt: options.title, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [imageUrl],
      site: "@trendly",
      creator: "@trendly"
    }
  };
}
