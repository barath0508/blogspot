import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { Newsletter } from "@/components/Newsletter";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BackToTop } from "@/components/BackToTop";
import { getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Trendly";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const latest = posts[0];
  const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world.";
  return {
    alternates: { canonical: SITE_URL, types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
    openGraph: {
      url: SITE_URL, type: "website", locale: "en_US", siteName: SITE_NAME,
      title: `${SITE_NAME} — Technology, AI & Ideas`, description: SITE_DESCRIPTION,
      images: latest?.cover_image
        ? [{ url: latest.cover_image, width: 1600, height: 900, alt: latest.title }]
        : [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: SITE_NAME }]
    }
  };
}

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPublishedPosts({ category: params.category, tag: params.tag, q: params.q });
  const supabase = getSupabase();

  const { data: allCategories } = await supabase.from("categories").select("name,slug").order("name");
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
  const featuredPost = !isFiltered ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;
  const trendingPosts = !isFiltered ? posts.slice(0, 5) : [];

  const itemListJsonLd = !isFiltered && posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Latest articles on ${SITE_NAME}`,
    url: SITE_URL,
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 10).map((post, i) => ({
      "@type": "ListItem", position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title, image: post.cover_image ?? undefined, description: post.excerpt
    }))
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      {itemListJsonLd && (
        <Script id="itemlist-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <main>
        {/* ── Hero ── */}
        {!isFiltered && (
          <section className="py-12 lg:py-20">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <h1 className="font-serif text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                  <span className="text-balance">
                    Ideas that inspire.{" "}
                    <span className="text-primary">Stories that matter.</span>
                  </span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
                  <span className="text-pretty">
                    Expert analysis on AI, technology, and the breakthroughs defining the next decade — published automatically every 30 minutes.
                  </span>
                </p>
                <div className="mt-6 max-w-lg">
                  <Suspense><SearchBar /></Suspense>
                </div>
              </div>

              {/* Featured Post */}
              {featuredPost && <PostCard post={featuredPost} featured />}
            </div>
          </section>
        )}

        {/* ── Search Results ── */}
        {params.q && (
          <section className="py-12">
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

        {/* ── Trending ── */}
        {trendingPosts.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <div className="mb-8 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">Trending Now</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {trendingPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
                  >
                    <span className="absolute top-3 right-3 font-serif text-4xl font-bold text-muted-foreground/20 transition-colors group-hover:text-primary/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative">
                      <span className="text-xs font-medium text-primary">
                        {post.categories?.[0]?.name ?? "Article"}
                      </span>
                      <h3 className="mt-2 font-medium text-foreground line-clamp-2 transition-colors group-hover:text-primary text-sm">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "Draft"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Articles Grid ── */}
        <section id="articles" className="py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
                  {isFiltered ? "Results" : "Latest Articles"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {isFiltered
                    ? `${posts.length} article${posts.length !== 1 ? "s" : ""} found`
                    : "Fresh perspectives and insights"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Suspense>
                  <FilterBar categories={categories} />
                </Suspense>
              </div>
            </div>

            {gridPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center gap-3">
                <p className="font-serif text-xl font-semibold text-foreground">No articles found</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {isFiltered ? "Try different keywords or clear your filters." : "New articles are published automatically — check back shortly."}
                </p>
                {isFiltered && (
                  <Link href="/" className="mt-2 text-sm font-medium text-primary hover:text-primary/80">
                    Clear filters →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Categories ── */}
        {!isFiltered && categories.length > 0 && (
          <section id="categories" className="py-16 lg:py-24 border-t border-border/40">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <div className="mb-10 flex flex-col items-start gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">Explore Topics</h2>
                  <p className="mt-2 text-muted-foreground">Discover articles across various categories</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/?category=${cat.slug}`}
                    className="group rounded-lg border border-border/40 bg-card p-5 transition-all hover:border-primary/40 hover:bg-card/80"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{cat.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Browse {cat.name.toLowerCase()} articles</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter ── */}
        {!isFiltered && (
          <Newsletter />
        )}

        {/* ── About ── */}
        {!isFiltered && (
          <section id="about" className="py-16 lg:py-24">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <span className="text-sm font-medium text-primary">About Us</span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-foreground lg:text-3xl">
                    <span className="text-balance">We believe in the power of well-crafted content</span>
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    <span className="text-pretty">
                      Trendly was founded with a simple mission: to deliver high-signal analysis on technology and AI. Our AI-powered pipeline curates trending topics and generates expert-level articles every 30 minutes.
                    </span>
                  </p>
                  <div className="mt-8 flex gap-8">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{posts.length}+</p>
                      <p className="text-sm text-muted-foreground">Articles Published</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">30min</p>
                      <p className="text-sm text-muted-foreground">Publish Frequency</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">AI</p>
                      <p className="text-sm text-muted-foreground">Powered Engine</p>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary lg:aspect-[4/3]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-serif text-2xl font-bold text-primary">T</span>
                      </div>
                      <p className="font-serif text-lg font-semibold text-foreground">Trendly</p>
                      <p className="text-sm text-muted-foreground">Est. 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
