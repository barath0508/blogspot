import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { Newsletter } from "@/components/Newsletter";
import { getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Insight Daily";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const latest = posts[0];
  const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world.";
  return {
    alternates: {
      canonical: SITE_URL,
      types: { "application/rss+xml": `${SITE_URL}/feed.xml` }
    },
    openGraph: {
      url: SITE_URL,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Technology, AI & Ideas`,
      description: SITE_DESCRIPTION,
      images: latest?.cover_image
        ? [{ url: latest.cover_image, width: 1600, height: 900, alt: latest.title }]
        : undefined
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

  const PREFERRED_CATEGORIES = [
    "technology",
    "artificial-intelligence",
    "software-development",
    "business",
    "startup",
    "innovation",
    "cybersecurity",
    "trending"
  ];

  const categories = (allCategories || [])
    .sort((a, b) => {
      const aPref = PREFERRED_CATEGORIES.includes(a.slug) ? 1 : 0;
      const bPref = PREFERRED_CATEGORIES.includes(b.slug) ? 1 : 0;
      if (aPref !== bPref) return bPref - aPref;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 8);

  const isFiltered = Boolean(params.category || params.tag || params.q);
  const featuredPost = !isFiltered ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  const itemListJsonLd = !isFiltered && posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Latest articles on ${SITE_NAME}`,
    url: SITE_URL,
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 10).map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
      image: post.cover_image ?? undefined,
      description: post.excerpt
    }))
  } : null;

  const breadcrumbJsonLd = isFiltered ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { 
        "@type": "ListItem", 
        position: 2, 
        name: params.category ? `Category: ${params.category}` : params.tag ? `Tag: ${params.tag}` : "Search", 
        item: `${SITE_URL}/?${params.category ? `category=${params.category}` : params.tag ? `tag=${params.tag}` : `q=${params.q}`}` 
      }
    ]
  } : null;

  return (
    <div className="space-y-10">
      {itemListJsonLd && (
        <Script id="itemlist-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}
      {breadcrumbJsonLd && (
        <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}
      {/* ── Hero Section ── */}
      {!isFiltered && (
        <section className="animate-fade-up space-y-6 py-10 lg:py-14 text-center flex flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            New articles every 30 minutes
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 leading-[1.1]">
            The pulse of <br className="hidden sm:block" />
            <span className="gradient-text">technology &amp; ideas</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-500 leading-relaxed">
            Expert analysis on AI, software, business, and the breakthroughs defining the next decade.
          </p>
          <Suspense>
            <SearchBar />
          </Suspense>
        </section>
      )}

      {/* ── Search Results Header ── */}
      {params.q && (
        <div className="flex items-center gap-3">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      )}

      {/* ── Featured Post ── */}
      {featuredPost && (
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col gap-4">
        <Suspense>
          <FilterBar categories={categories ?? []} />
        </Suspense>
        <p className="text-sm text-gray-400">
          {isFiltered
            ? `${posts.length} result${posts.length !== 1 ? "s" : ""} found`
            : `${posts.length} article${posts.length !== 1 ? "s" : ""} published`}
        </p>
      </div>

      {/* ── Posts Grid ── */}
      {gridPosts.length === 0 && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center gap-3">
          <p className="text-4xl">📭</p>
          <p className="font-semibold text-gray-700 text-lg">
            {isFiltered ? "No articles match your search" : "No articles yet"}
          </p>
          <p className="text-sm text-gray-400">
            {isFiltered ? "Try different keywords or clear your filters." : "New articles are published automatically — check back shortly."}
          </p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      )}

      {/* ── Newsletter CTA ── */}
      {!isFiltered && (
        <div className="pt-10">
          <Newsletter />
        </div>
      )}
    </div>
  );
}
