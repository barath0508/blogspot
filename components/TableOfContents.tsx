"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll(".prose h2, .prose h3"));
      const parsed = elements.map((el) => {
        if (!el.id) {
          el.id = (el.textContent ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
        }
        return { id: el.id, text: el.textContent ?? "", level: Number(el.tagName[1]) };
      });
      setHeadings(parsed);

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) setActiveId(visible[0].target.id);
        },
        { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
      );
      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (headings.length === 0) return null;

  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className="toc-wrap group/toc [&_summary::-webkit-details-marker]:hidden"
      aria-label="Table of contents"
    >
      <summary
        onClick={(e) => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            e.preventDefault();
          }
        }}
        className="flex items-center justify-between cursor-pointer lg:cursor-default list-none select-none outline-none [&::-webkit-details-marker]:hidden"
      >
        <div className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">On this page</h3>
        </div>
        {/* Toggle icon for mobile only */}
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 lg:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <nav aria-label="Article sections" className="mt-4 border-t border-border/40 pt-4 lg:border-0 lg:pt-0">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                setIsOpen(false);
              }
            }}
            className={`toc-item ${h.level === 3 ? "level-3" : ""} ${activeId === h.id ? "active" : ""}`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </details>
  );
}
