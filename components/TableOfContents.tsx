"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Give the markdown a moment to render before finding headings
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll(".prose h2, .prose h3"));
      
      const parsedHeadings = elements.map((elem) => {
        // If the markdown renderer didn't assign an ID, assign one based on text
        if (!elem.id) {
          elem.id = elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";
        }
        return {
          id: elem.id,
          text: elem.textContent || "",
          level: Number(elem.tagName.substring(1)),
        };
      });

      setHeadings(parsedHeadings);

      // Intersection Observer for scroll spy
      const callback = (entries: IntersectionObserverEntry[]) => {
        // Find all intersecting headings
        const visibleHeadings = entries.filter(entry => entry.isIntersecting);
        if (visibleHeadings.length > 0) {
          // Set active to the topmost visible heading
          setActiveId(visibleHeadings[0].target.id);
        }
      };

      const observer = new IntersectionObserver(callback, { rootMargin: "0px 0px -80% 0px" });
      elements.forEach((elem) => observer.observe(elem));

      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-28 p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-[calc(100vh-140px)] overflow-y-auto">
      <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">On this page</h3>
      <nav className="flex flex-col gap-2.5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-sm transition-all duration-200 ${
              heading.level === 3 ? "ml-4" : ""
            } ${
              activeId === heading.id
                ? "text-purple-600 font-bold translate-x-1"
                : "text-gray-500 hover:text-gray-900 hover:translate-x-1"
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
