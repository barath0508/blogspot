"use client";

export function SearchTrigger() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
        )
      }
      className="inline-flex h-8 items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-3 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
      aria-label="Search (Cmd+K)"
      title="Search (Cmd+K)"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
      Search
      <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium">⌘K</kbd>
    </button>
  );
}
