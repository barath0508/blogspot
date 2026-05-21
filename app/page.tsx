import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { Newsletter } from "@/components/Newsletter";
import { BackToTop } from "@/components/BackToTop";
import { getPublishedPosts, POSTS_PER_PAGE } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { StatsCounter } from "@/components/StatsCounter";
import { NewsletterCompact } from "@/components/NewsletterCompact";
import { Flame, Rss, ArrowRight, BookOpen, Compass, Tag } from "lucide-react";
import { getSiteUrl } from "@/lib/seoHelper";

export const revalidate = 60;

const SITE_URL = getSiteUrl();
const SITE_NAME = "Trendly";
const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world.";

type HomeSearchParams = { category?: string; tag?: string; q?: string; page?: string };

function buildCanonicalSearchUrl(searchParams: HomeSearchParams) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.tag) params.set("tag", searchParams.tag);
  if (searchParams.q) params.set("q", searchParams.q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `${SITE_URL}${qs ? `/?${qs}` : "/"}`;
}

export async function generateMetadata({ searchParams }: { searchParams: HomeSearchParams }): Promise<Metadata> {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const categoryLabel = searchParams.category ? searchParams.category.replace(/-/g, " ") : undefined;
  const tagLabel = searchParams.tag ? searchParams.tag.replace(/-/g, " ") : undefined;

  let title = `${SITE_NAME} — Technology, AI & Ideas`;
  let description = SITE_DESCRIPTION;

  if (searchParams.q) {
    title = `Search results for "${searchParams.q}" | ${SITE_NAME}`;
    description = `Browse Trendly articles matching "${searchParams.q}" on AI, technology, startups, and digital trends.`;
  } else if (categoryLabel) {
    title = `${categoryLabel} articles | ${SITE_NAME}`;
    description = `Latest ${categoryLabel} articles from Trendly — AI-powered news, analysis, and opinion on ${categoryLabel}.`;
  } else if (tagLabel) {
    title = `Posts tagged ${tagLabel} | ${SITE_NAME}`;
    description = `Explore Trendly articles tagged ${tagLabel} for fresh insights on AI, technology, and digital trends.`;
  }

  if (page > 1) {
    title = `Page ${page} · ${title}`;
    description = `Page ${page} of results. ${description}`;
  }

  const canonicalUrl = buildCanonicalSearchUrl(searchParams);
  const { posts } = await getPublishedPosts({ category: searchParams.category, tag: searchParams.tag, q: searchParams.q, page });
  const latest = posts[0];

  return buildPageMetadata({
    title,
    description,
    url: canonicalUrl,
    keywords: ["technology", "AI", "trendly", "news", "analysis"],
    imageUrl: latest?.cover_image ?? undefined,
  });
}

export default async function Home({
  searchParams
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const supabase = getSupabase();

  const [{ posts, total }, { data: popularPostsData }, { data: allCategories }] = await Promise.all([
    getPublishedPosts({ category: params.category, tag: params.tag, q: params.q, page }),
    supabase
      .from("posts")
      .select("title, slug, cover_image, published_at, view_count")
      .eq("is_published", true)
      .order("view_count", { ascending: false })
      .limit(4),
    supabase.from("categories").select("name,slug").order("name")
  ]);

  const PREFERRED = ["technology", "artificial-intelligence", "software-development", "business", "startup", "innovation", "cybersecurity", "trending"];
  const categories = ((allCategories || []) as { name: string; slug: string }[])
    .sort((a, b) => {
      const ai = PREFERRED.includes(a.slug) ? 1 : 0;
      const bi = PREFERRED.includes(b.slug) ? 1 : 0;
      if (ai !== bi) return bi - ai;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);

  const isFiltered = Boolean(params.category || params.tag || params.q);
  const featuredPost = !isFiltered && page === 1 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const popularPosts = (popularPostsData || []) as { title: string; slug: string; cover_image: string | null; published_at: string; view_count: number }[];
  const SectionTitleTag = (!isFiltered && page === 1) || params.q ? "h2" : "h1";

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    if (params.tag) sp.set("tag", params.tag);
    if (params.q) sp.set("q", params.q);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/?${qs}` : "/";
  };

  const itemListJsonLd = !isFiltered && page === 1 && posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Latest articles on ${SITE_NAME}`,
    url: SITE_URL,
    numberOfItems: total,
    itemListElement: posts.slice(0, 10).map((post, i) => ({
      "@type": "ListItem", position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title, image: post.cover_image ?? undefined, description: post.excerpt
    }))
  } : null;

  return (
    <div className="min-h-screen bg-background">
      {itemListJsonLd && (
        <Script id="itemlist-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <main>
        {/* ── Hero ── */}
        {!isFiltered && page === 1 && (
          <section className="relative py-12 lg:py-20 overflow-hidden">
            <AnimatedGradient />
            <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <h1 className="font-serif text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                  <span className="text-balance">
                    Ideas that inspire.{" "}
                    <span className="text-primary">Stories that matter.</span>
                  </span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Expert analysis on AI, technology, and the breakthroughs defining the next decade — published automatically every 30 minutes.
                </p>
                <div className="mt-6 max-w-lg">
                  <Suspense><SearchBar /></Suspense>
                </div>
              </div>
              {featuredPost && <PostCard post={featuredPost} featured />}
            </div>
          </section>
        )}

        {/* ── Search header ── */}
        {params.q && (
          <section className="py-10">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <h1 className="font-serif text-2xl font-bold text-foreground mb-6">
                Results for <span className="text-primary">"{params.q}"</span>
              </h1>
              <div className="max-w-lg mb-8">
                <Suspense><SearchBar /></Suspense>
              </div>
            </div>
          </section>
        )}

        {/* ── Stats ── */}
        {!isFiltered && page === 1 && (
          <StatsCounter
            totalArticles={total}
            totalCategories={categories.length}
            totalViews={50000} // Fetch from DB is mocked for now
          />
        )}

        {/* ── Trending strip ── */}
        {!isFiltered && page === 1 && posts.length > 0 && (
          <section className="py-8 border-y border-border/40 bg-secondary/30">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                <span className="shrink-0 text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                  Trending:
                </span>
                {posts.slice(0, 6).map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    {post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Articles Layout: Left/Main Grid + Right Sidebar ── */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            
            {/* Header info */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <SectionTitleTag className="font-serif text-2xl font-bold text-foreground">
                  {isFiltered ? "Results" : page > 1 ? `Page ${page}` : "Latest Articles"}
                </SectionTitleTag>
                <p className="mt-1 text-sm text-muted-foreground">
                  {total} article{total !== 1 ? "s" : ""}
                  {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
                </p>
              </div>
              <Suspense>
                <FilterBar categories={categories} />
              </Suspense>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_320px] items-start">
              
              {/* ── Left Column: Articles Grid ── */}
              <div className="min-w-0">
                {gridPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center gap-3">
                    <p className="font-serif text-xl font-semibold text-foreground">No articles found</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {isFiltered ? "Try different keywords or clear your filters." : "New articles are published automatically — check back shortly."}
                    </p>
                    {isFiltered && (
                      <Link href="/" className="mt-2 text-sm font-medium text-primary hover:text-primary/80">Clear filters →</Link>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {gridPosts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
                    <Link
                      href={buildPageUrl(page - 1)}
                      aria-disabled={page <= 1}
                      className={`inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        page <= 1
                          ? "pointer-events-none border-border/40 text-muted-foreground/40"
                          : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Prev
                    </Link>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let p: number;
                        if (totalPages <= 7) p = i + 1;
                        else if (page <= 4) p = i + 1;
                        else if (page >= totalPages - 3) p = totalPages - 6 + i;
                        else p = page - 3 + i;
                        return (
                          <Link
                            key={p}
                            href={buildPageUrl(p)}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                              p === page
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                            }`}
                          >
                            {p}
                          </Link>
                        );
                      })}
                    </div>

                    <Link
                      href={buildPageUrl(page + 1)}
                      aria-disabled={page >= totalPages}
                      className={`inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        page >= totalPages
                          ? "pointer-events-none border-border/40 text-muted-foreground/40"
                          : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      Next
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </nav>
                )}
              </div>

              {/* ── Right Column: Sidebar ── */}
              <aside className="space-y-8 lg:sticky lg:top-24">
                
                {/* Publication Info widget */}
                <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-xl" />
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    <BookOpen className="h-4 w-4 text-primary" />
                    About Trendly
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground">Next-Gen Technology Insights</h3>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Trendly is a fully automated, AI-powered technology publication tracking breakthroughs in artificial intelligence, software design, business disruptors, and engineering. Updated every 30 minutes.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href="/about" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      Learn how it works <ArrowRight className="h-3 w-3" />
                    </Link>
                    <a href={`${SITE_URL}/feed.xml`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Rss className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      RSS Feed Publication
                    </a>
                  </div>
                </div>

                {/* Popular Stories widget */}
                {popularPosts.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                      <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">Popular Stories</h3>
                    </div>
                    <div className="space-y-4">
                      {popularPosts.map((pop, idx) => (
                        <Link key={pop.slug} href={`/blog/${pop.slug}`} className="flex gap-4 group">
                          <span className="font-serif text-xl font-extrabold text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 w-6 self-start mt-0.5">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {pop.title}
                            </h4>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {new Date(pop.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {(pop.view_count || 0).toLocaleString()} reads
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explore Topics (Categories cloud) widget */}
                {categories.length > 0 && (
                  <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Compass className="h-4 w-4 text-primary" />
                      <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Link 
                          key={cat.slug} 
                          href={`/category/${cat.slug}`}
                          className="rounded-full border border-border bg-card/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <Link href="/categories" className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 transition-all duration-200">
                        Explore all →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Sticky Sidebar Newsletter widget */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    <Tag className="h-4 w-4" />
                    Weekly Digest
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">Stay ahead of trends</h3>
                  <p className="my-2.5 text-xs leading-relaxed text-muted-foreground">
                    Get monthly high-signal tech digests compiled by our editor algorithms.
                  </p>
                  <NewsletterCompact />
                </div>

              </aside>

            </div>

          </div>
        </section>

        {/* ── Footer newsletter callout ── */}
        {!isFiltered && page === 1 && <Newsletter />}

        {/* ── Category Cloud section (Bottom) ── */}
        {!isFiltered && page === 1 && categories.length > 0 && (
          <section className="py-12 lg:py-16 border-t border-border/40 bg-secondary/5">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Explore Topics</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}
                    className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
