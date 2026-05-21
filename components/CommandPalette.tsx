"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: { name: string }[];
};

type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
};

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "info" },
  { label: "Contact", href: "/contact", icon: "mail" },
  { label: "Saved Articles", href: "/saved", icon: "bookmark" },
];

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  mail: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  bookmark: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  ),
  article: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  theme: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build flat item list
  const items: PaletteItem[] = [];

  // Article results
  if (query.trim().length > 0) {
    results.forEach((r) => {
      items.push({
        id: `article-${r.id}`,
        label: r.title,
        hint: r.categories?.[0]?.name,
        icon: ICONS.article,
        action: () => { router.push(`/blog/${r.slug}`); setOpen(false); },
        group: "Articles",
      });
    });
  }

  // Navigation
  NAV_ITEMS.forEach((n) => {
    if (!query.trim() || n.label.toLowerCase().includes(query.toLowerCase())) {
      items.push({
        id: `nav-${n.href}`,
        label: n.label,
        hint: n.href,
        icon: ICONS[n.icon],
        action: () => { router.push(n.href); setOpen(false); },
        group: "Navigation",
      });
    }
  });

  // Actions
  if (!query.trim() || "toggle theme".includes(query.toLowerCase()) || "dark light".includes(query.toLowerCase())) {
    items.push({
      id: "action-theme",
      label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      icon: ICONS.theme,
      action: () => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); },
      group: "Actions",
    });
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search articles with debounce
  const searchArticles = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/?q=${encodeURIComponent(q.trim())}`, { headers: { Accept: "text/html" } });
      // We can't easily parse server-rendered HTML, so use a lightweight approach:
      // fetch from our own search page and parse results
      // Actually, let's use a simpler API approach — search through the Supabase client
      // For simplicity, we'll use the existing search page URL approach
      const searchUrl = `/?q=${encodeURIComponent(q.trim())}`;
      // Use a lightweight search via the same page mechanism
      setResults([]); // Will be populated from the API below
      
      const apiRes = await fetch(`/api/posts/search?q=${encodeURIComponent(q.trim())}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        setResults(data.posts ?? []);
      }
    } catch {
      // Silently fail search
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchArticles(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchArticles]);

  // Clamp active index
  useEffect(() => {
    setActiveIndex(0);
  }, [query, results.length]);

  // Keyboard navigation within palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && items[activeIndex]) {
      e.preventDefault();
      items[activeIndex].action();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  // Group items
  const groups: { name: string; items: (PaletteItem & { flatIndex: number })[] }[] = [];
  let flatIdx = 0;
  items.forEach((item) => {
    let group = groups.find((g) => g.name === item.group);
    if (!group) { group = { name: item.group, items: [] }; groups.push(group); }
    group.items.push({ ...item, flatIndex: flatIdx++ });
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Palette */}
      <div className="fixed inset-x-0 top-[15vh] z-[101] mx-auto w-full max-w-lg px-4 animate-scale-in">
        <div className="cmd-palette overflow-hidden rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-border/40 px-4">
            <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search articles, navigate, or run actions..."
              className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {searching && (
              <svg className="h-4 w-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-secondary px-1.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
            {items.length === 0 && query.trim().length > 1 && !searching ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">No results found</p>
                <p className="mt-1 text-xs text-muted-foreground/60">Try different keywords</p>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.name} className="mb-1">
                  <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {group.name}
                  </p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      data-index={item.flatIndex}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(item.flatIndex)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        item.flatIndex === activeIndex
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className={`shrink-0 ${item.flatIndex === activeIndex ? "text-primary" : "text-muted-foreground"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      {item.hint && (
                        <span className="shrink-0 text-xs text-muted-foreground/60">{item.hint}</span>
                      )}
                      {item.flatIndex === activeIndex && (
                        <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-secondary px-1.5 text-[10px] font-medium text-muted-foreground">
                          ↵
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-2">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-secondary px-1">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-secondary px-1">↵</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-secondary px-1">esc</kbd> Close</span>
            </div>
            <span className="text-[10px] font-medium text-primary/60">Trendly</span>
          </div>
        </div>
      </div>
    </>
  );
}
