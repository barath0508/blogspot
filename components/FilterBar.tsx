"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = { name: string; slug: string };
type Props = { categories: Option[]; tags: Option[] };

export function FilterBar({ categories, tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const selectedTag = searchParams.get("tag") ?? "";

  const updateFilter = (key: "category" | "tag", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/?${next.toString()}`);
  };

  const selectClass =
    "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className={selectClass} value={selectedCategory} onChange={(e) => updateFilter("category", e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select className={selectClass} value={selectedTag} onChange={(e) => updateFilter("tag", e.target.value)}>
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>

      {(selectedCategory || selectedTag) && (
        <button
          onClick={() => router.push("/")}
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 hover:shadow-sm transition-all"
        >
          Clear filters ✕
        </button>
      )}
    </div>
  );
}
