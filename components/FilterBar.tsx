"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = { name: string; slug: string };
type Props = { categories: Option[] };

const CATEGORY_ICONS: Record<string, string> = {
  "technology": "💻", "artificial-intelligence": "🤖", "ai": "🤖",
  "software-development": "⚙️", "business": "📈", "startup": "🚀",
  "innovation": "💡", "cybersecurity": "🔐", "trending": "🔥",
  "science": "🔬", "health": "❤️", "entertainment": "🎬",
  "sports": "⚽", "politics": "🏛️",
};

function getIcon(slug: string) {
  return CATEGORY_ICONS[slug.toLowerCase()] ?? "📌";
}

export function FilterBar({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";

  const updateFilter = (slug: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!slug || slug === selectedCategory) {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    next.delete("q");
    router.push(`/?${next.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push("/", { scroll: false });
  const hasFilter = Boolean(selectedCategory);

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
      {/* All */}
      <button
        suppressHydrationWarning
        onClick={clearAll}
        className={`filter-pill ${!hasFilter ? "active" : ""}`}
        aria-pressed={!hasFilter}
      >
        <span aria-hidden="true">🗂️</span>
        All
      </button>

      {categories.map((c) => (
        <button
          key={c.slug}
          suppressHydrationWarning
          onClick={() => updateFilter(c.slug)}
          className={`filter-pill ${selectedCategory === c.slug ? "active" : ""}`}
          aria-pressed={selectedCategory === c.slug}
        >
          <span aria-hidden="true">{getIcon(c.slug)}</span>
          {c.name}
        </button>
      ))}

      {hasFilter && (
        <button
          suppressHydrationWarning
          onClick={clearAll}
          className="filter-pill border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600"
          aria-label="Clear filter"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
