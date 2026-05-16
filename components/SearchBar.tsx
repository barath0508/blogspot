"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    startTransition(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (val.trim()) next.set("q", val.trim());
      else next.delete("q");
      router.push(`/?${next.toString()}`, { scroll: false });
    });
  };

  const clear = () => {
    setQuery("");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    router.push(`/?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full">
      {/* Search icon */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-2 z-10">
        {isPending ? (
          <svg className="h-4.5 w-4.5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
        )}
      </div>

      <input
        id="search-posts"
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search articles..."
        className="input-base h-12 pl-11 pr-10 rounded-xl text-sm"
        aria-label="Search articles"
        autoComplete="off"
        suppressHydrationWarning
      />

      {query && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-muted-2 hover:text-foreground hover:bg-surface-2 transition-all"
          aria-label="Clear search"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
