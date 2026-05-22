"use client";

import { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { PostCard } from "@/components/PostCard";
import { getPostsBySlugs } from "./actions";
import { PostRecord } from "@/types/blog";
import Link from "next/link";

export default function SavedPostsPage() {
  const { bookmarks, isMounted } = useBookmarks();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isMounted) return;
    async function fetchSavedPosts() {
      if (bookmarks.length === 0) { setPosts([]); setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const fetched = await getPostsBySlugs(bookmarks);
        const sorted = fetched.sort((a, b) => bookmarks.indexOf(b.slug) - bookmarks.indexOf(a.slug));
        setPosts(sorted);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSavedPosts();
  }, [bookmarks, isMounted]);

  if (!isMounted) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <div className="space-y-10 animate-fade-up">
        {/* Header */}
        <section className="py-8 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Articles</h1>
            {posts.length > 0 && (
              <span className="text-xs font-semibold text-muted bg-surface-2 border border-border rounded-full px-2.5 py-0.5">
                {posts.length}
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            Your personal reading list. Saved articles are stored on your device.
          </p>
        </section>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl skeleton" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-2xl">
              🔖
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-foreground text-lg">No saved articles yet</p>
              <p className="text-sm text-muted max-w-xs">
                Tap the bookmark icon on any article to save it here for later reading.
              </p>
            </div>
            <Link href="/" className="btn btn-primary mt-2">
              Explore articles
            </Link>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Saved articles">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
