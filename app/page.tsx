import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const latest = posts[0];
  return {
    alternates: { canonical: SITE_URL },
    openGraph: {
      url: SITE_URL,
      images: latest?.cover_image ? [{ url: latest.cover_image, width: 1600, height: 900 }] : undefined
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

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("name,slug").order("name"),
    supabase.from("tags").select("name,slug").order("name")
  ]);

  const isFiltered = Boolean(params.category || params.tag || params.q);
  const featuredPost = !isFiltered ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="space-y-10">
      {/* ── Hero Section ── */}
      {!isFiltered && (
        <section className="animate-fade-up space-y-6 py-10 lg:py-14 text-center flex flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Updated Automatically 24/7
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 leading-[1.1]">
            Discover trending <br className="hidden sm:block" />
            <span className="gradient-text">tech &amp; digital insights</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-500 leading-relaxed">
            Stay ahead of the curve with AI-curated articles on technology, design, AI, and digital growth.
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
          <FilterBar categories={categories ?? []} tags={tags ?? []} />
        </Suspense>
        <p className="text-sm text-gray-400">
          {isFiltered
            ? `${posts.length} result${posts.length !== 1 ? "s" : ""} found`
            : `${posts.length} article${posts.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* ── Posts Grid ── */}
      {gridPosts.length === 0 && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center gap-3">
          <p className="text-4xl">📭</p>
          <p className="font-semibold text-gray-700 text-lg">
            {isFiltered ? "No articles match your search" : "No posts yet"}
          </p>
          <p className="text-sm text-gray-400">
            {isFiltered ? "Try different keywords or clear your filters." : "Check back soon — new articles publish automatically."}
          </p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
