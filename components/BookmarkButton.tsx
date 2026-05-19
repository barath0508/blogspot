"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

export function BookmarkButton({
  slug,
  className,
  withLabel,
}: {
  slug: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isBookmarked, toggleBookmark, isMounted } = useBookmarks();

  if (!isMounted) {
    return <div className={`${withLabel ? "w-28" : "w-8"} h-8 rounded-lg bg-surface-2 ${className ?? ""}`} />;
  }

  const saved = isBookmarked(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(slug);
  };

  if (withLabel) {
    return (
      <button
        onClick={handleClick}
        aria-label={saved ? "Remove from saved" : "Save for later"}
        title={saved ? "Remove from saved" : "Save for later"}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          saved
            ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400"
            : "border-border bg-surface text-muted hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
        } ${className ?? ""}`}
      >
        <svg
          className={`h-4 w-4 transition-all duration-200 ${saved ? "scale-110" : ""}`}
          fill={saved ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save for later"}
      title={saved ? "Remove from saved" : "Save for later"}
      className={`flex items-center justify-center transition-all duration-200 ${
        saved ? "text-indigo-600 dark:text-indigo-400" : "text-muted hover:text-indigo-600 dark:hover:text-indigo-400"
      } ${className ?? ""}`}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${saved ? "scale-110" : ""}`}
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
