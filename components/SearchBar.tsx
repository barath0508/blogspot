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
      router.push(`/?${next.toString()}`);
    });
  };

  const clear = () => {
    setQuery("");
    const next = new URLSearchParams(searchParams.toString());
    next.delete("q");
    router.push(`/?${next.toString()}`);
  };

  return (
    <div className="search-bar-wrap">
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
      <input
        id="search-posts"
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search articles..."
        className="search-input"
        aria-label="Search articles"
        autoComplete="off"
      />
      {isPending && <span className="search-spinner" aria-hidden="true" />}
      {query && !isPending && (
        <button onClick={clear} className="search-clear" aria-label="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
