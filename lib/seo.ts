type GenerateSeoOptions = {
  title: string;
  excerpt?: string | null;
  content: string;
  meta_title?: string | null;
  meta_description?: string | null;
  seo_keywords?: string[] | string | null;
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

function buildMetaTitle(title: string, keywords: string[]): string {
  const suffix = keywords.slice(0, 2).join(", ");
  const candidate = suffix ? `${title.trim()} | ${suffix}` : title.trim();
  return candidate.slice(0, 60).trim();
}

function buildMetaDescription(excerpt: string | null | undefined, content: string, keywords: string[]): string {
  const source = (excerpt || content).replace(/\s+/g, " ").trim().slice(0, 150);
  const keywordText = keywords.length ? ` Keywords: ${keywords.slice(0, 5).join(", ")}` : "";
  return `${source}${keywordText}`.slice(0, 160).trim();
}

export function generateSeoMetadata(options: GenerateSeoOptions) {
  const keywords = normalizeKeywords(options.seo_keywords);
  const resolvedKeywords = keywords.length
    ? keywords
    : extractKeywordsFromText(`${options.title} ${options.excerpt ?? ""} ${options.content}`);

  const meta_title = options.meta_title?.trim()
    ? options.meta_title.trim().slice(0, 60)
    : buildMetaTitle(options.title, resolvedKeywords);

  const meta_description = options.meta_description?.trim()
    ? options.meta_description.trim().slice(0, 160)
    : buildMetaDescription(options.excerpt, options.content, resolvedKeywords);

  return { meta_title, meta_description, seo_keywords: resolvedKeywords };
}

export async function pingSearchEngines(): Promise<void> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (!base) return;
  const sitemapUrl = encodeURIComponent(`${base}/sitemap.xml`);
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, { signal: AbortSignal.timeout(8000) }),
    fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`, { signal: AbortSignal.timeout(8000) })
  ]);
}
