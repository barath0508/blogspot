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
    const next = new URLSearchParams(searchParams.toString());
    if (!value || (key === "category" && value === selectedCategory) || (key === "tag" && value === selectedTag)) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // clear search when filtering
    next.delete("q");
    router.push(`/?${next.toString()}`);
  };

  const clearAll = () => router.push("/");
  const hasFilter = selectedCategory || selectedTag;

  return (
    <div className="flex flex-col gap-3 w-full">
      {categories.length > 0 && (
        <div className="filter-pills">
          <span className="filter-group-label">Category</span>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateFilter("category", c.slug)}
              className={`filter-pill${selectedCategory === c.slug ? " active" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="filter-pills">
          <span className="filter-group-label">Tag</span>
          {tags.slice(0, 12).map((t) => (
            <button
              key={t.slug}
              onClick={() => updateFilter("tag", t.slug)}
              className={`filter-pill${selectedTag === t.slug ? " active" : ""}`}
            >
              #{t.name}
            </button>
          ))}
        </div>
      )}

      {hasFilter && (
        <div>
          <button
            onClick={clearAll}
            className="filter-pill"
            style={{ borderColor: "#fca5a5", color: "#dc2626", background: "#fef2f2" }}
          >
            ✕ Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
