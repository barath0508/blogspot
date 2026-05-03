"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "insightdaily_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bookmarks", e);
    }
  }, []);

  const toggleBookmark = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.includes(slug);
      const updated = isBookmarked
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Dispatch custom event so other tabs/components update
        window.dispatchEvent(new CustomEvent("bookmarks-updated", { detail: updated }));
      } catch (e) {
        console.error("Failed to save bookmarks", e);
      }
      
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.includes(slug),
    [bookmarks]
  );

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<string[]>) => {
      setBookmarks(e.detail);
    };

    window.addEventListener("bookmarks-updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("bookmarks-updated", handleUpdate as EventListener);
    };
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    isMounted,
  };
}
