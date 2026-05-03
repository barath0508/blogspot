"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

export function BookmarkButton({ slug, className, withLabel }: { slug: string; className?: string; withLabel?: boolean }) {
  const { isBookmarked, toggleBookmark, isMounted } = useBookmarks();

  if (!isMounted) {
    return <div className={`${withLabel ? "w-24" : "w-8"} h-8 ${className || ""}`} />; // Placeholder
  }

  const saved = isBookmarked(slug);

  if (withLabel) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(slug);
        }}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-300 shadow-sm ${
          saved ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        } ${className || ""}`}
        aria-label={saved ? "Remove from saved" : "Save for later"}
      >
        <svg
          className={`h-5 w-5 transition-all duration-300 ${saved ? "fill-indigo-600 text-indigo-600 scale-110" : "fill-transparent text-gray-400 group-hover:text-indigo-500"}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="text-sm font-bold">{saved ? "Saved to list" : "Save for later"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug);
      }}
      className={`group relative flex items-center justify-center transition-all ${className || ""}`}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${saved ? "bg-indigo-100 scale-100 opacity-100" : "bg-gray-100 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"}`} />
      <svg
        className={`relative h-5 w-5 transition-all duration-300 ${saved ? "fill-indigo-600 text-indigo-600 scale-110" : "fill-transparent text-gray-400 group-hover:text-indigo-600"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
