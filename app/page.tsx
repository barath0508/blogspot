import type { Metadata } from "next";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 120;

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
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPublishedPosts({ category: params.category, tag: params.tag });
  const supabase = getSupabase();

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("name,slug").order("name"),
    supabase.from("tags").select("name,slug").order("name")
  ]);

  const isFiltered = Boolean(params.category || params.tag);

  return (
    <div className="space-y-12">
      {!isFiltered && (
        <section className="animate-fade-up space-y-6 py-12 lg:py-16 text-center flex flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Updated Automatically 24/7
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 leading-[1.1]">
            Discover trending <br className="hidden sm:block"/>
            <span className="gradient-text">tech &amp; digital insights</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-500 leading-relaxed">
            Stay ahead of the curve with our curated, high-quality articles on technology, design, AI, and digital growth.
          </p>
        </section>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar categories={categories ?? []} tags={tags ?? []} />
        <p className="text-sm text-gray-400 shrink-0">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-2xl">📭</p>
          <p className="mt-2 font-medium text-gray-700">No posts yet</p>
          <p className="text-sm text-gray-400">Check back soon — new articles publish automatically.</p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      )}
    </div>
  );
}
