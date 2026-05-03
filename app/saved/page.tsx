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
      if (bookmarks.length === 0) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedPosts = await getPostsBySlugs(bookmarks);
        // Sort posts based on the order they were bookmarked (newest first)
        // Since bookmarks array is chronological, reverse it to get newest first
        const sorted = fetchedPosts.sort((a, b) => {
          return bookmarks.indexOf(b.slug) - bookmarks.indexOf(a.slug);
        });
        setPosts(sorted);
      } catch (error) {
        console.error("Failed to fetch saved posts", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedPosts();
  }, [bookmarks, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="space-y-10">
      <section className="animate-fade-up py-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900 mb-4">
          Saved Articles
        </h1>
        <p className="text-lg text-gray-500">
          Your personal reading list. Articles you save are stored securely on your device.
        </p>
      </section>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-20 text-center gap-4 animate-fade-up">
          <p className="text-5xl">🔖</p>
          <p className="font-semibold text-gray-700 text-xl">
            You haven't saved any articles yet.
          </p>
          <p className="text-sm text-gray-500 max-w-sm">
            When you find an article you want to read later, tap the bookmark icon to save it here.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Explore articles
          </Link>
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
