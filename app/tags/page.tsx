import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getSupabase } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { Hash, ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";
const SITE_URL = getSiteUrl();

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Tags — Explore Articles by Keywords",
  description: "Browse articles on Trendly using tags. Find quick insights by searching specific keywords like AI news, coding, startups, design, and developer guides.",
  url: `${SITE_URL}/tags`,
  imageUrl: `${SITE_URL}/og-default.png`,
});

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default async function TagsPage() {
  const supabase = getSupabase();

  const [{ data: tagsData }, { data: postTagsData }] = await Promise.all([
    supabase.from("tags").select("id, name, slug").order("name"),
    supabase.from("post_tags").select("tag_id, posts!inner(is_published)").eq("posts.is_published", true)
  ]);

  const tags = tagsData || [];
  const postTags = postTagsData || [];

  const countMap: Record<string, number> = {};
  postTags.forEach((pt: any) => {
    countMap[pt.tag_id] = (countMap[pt.tag_id] ?? 0) + 1;
  });

  const tagsWithCounts: TagItem[] = tags
    .map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: countMap[tag.id] ?? 0
    }))
    .filter((tag: any) => tag.count > 0) // Only show tags with published posts
    .sort((a: any, b: any) => b.count - a.count); // Sort by popularity

  // Calculate sizing tiers for tags cloud
  const maxCount = tagsWithCounts.length > 0 ? tagsWithCounts[0].count : 1;

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
        "name": "Tags",
        "item": `${SITE_URL}/tags`
      }
    ]
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/tags/#webpage`,
    "url": `${SITE_URL}/tags`,
    "name": "Tags — Explore Articles by Keywords | Trendly",
    "description": "Browse articles on Trendly using tags. Find quick insights by searching specific keywords like AI news, coding, startups, design, and developer guides.",
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    },
    "hasPart": tagsWithCounts.map((tag) => ({
      "@type": "WebPage",
      "name": tag.name,
      "url": `${SITE_URL}/tag/${tag.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedGradient />
      <Script id="tags-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="tags-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-20">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Tags</span>
        </nav>

        <header className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Discover by Keyword</span>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Popular keywords & <span className="text-primary">indexed subjects.</span>
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Navigate through Trendly's extensive coverage using indexes. Select a keyword to find targeted articles and analyses.
          </p>
        </header>

        {/* Dynamic Tag Cloud / Grid */}
        <div className="rounded-xl border border-border/40 bg-card p-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-center py-6">
            {tagsWithCounts.map((tag) => {
              // Calculate font weight and color density based on popularity
              const weightRatio = tag.count / maxCount;
              let fontStyle = "text-xs font-normal opacity-70 hover:opacity-100";
              
              if (weightRatio > 0.8) {
                fontStyle = "text-lg md:text-xl font-bold text-primary hover:text-primary/80";
              } else if (weightRatio > 0.5) {
                fontStyle = "text-base md:text-lg font-semibold text-foreground hover:text-primary";
              } else if (weightRatio > 0.25) {
                fontStyle = "text-sm font-medium text-foreground/80 hover:text-primary";
              }
              
              return (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className={`inline-flex items-center gap-1 rounded-full border border-border/60 bg-secondary/30 px-4 py-2 transition-all hover:border-primary/40 hover:-translate-y-0.5 ${fontStyle}`}
                >
                  <Hash className="h-3.5 w-3.5 opacity-55 shrink-0" />
                  <span>{tag.name}</span>
                  <span className="ml-1 text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded-full text-muted-foreground font-semibold">
                    {tag.count}
                  </span>
                </Link>
              );
            })}

            {tagsWithCounts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No tags found matching published articles.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed list view */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">All Tags Alphabetically</h2>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...tagsWithCounts]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-4 hover:border-primary/40 hover:bg-secondary/20 transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary" />
                    <span className="text-sm font-medium text-foreground truncate group-hover:text-primary">{tag.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded border border-border shrink-0">
                    {tag.count} post{tag.count !== 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
