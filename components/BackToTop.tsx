"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [readNextVisible, setReadNextVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setReadNextVisible(customEvent.detail.visible);
    };
    window.addEventListener("read-next-bar-toggle", handleToggle);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("read-next-bar-toggle", handleToggle);
    };
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed right-[calc(1.5rem+env(safe-area-inset-right,0px))] z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border shadow-lg text-muted hover:text-foreground hover:border-border-2 hover:shadow-xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      } ${
        readNextVisible ? "bottom-[calc(92px+env(safe-area-inset-bottom,0px))]" : "bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
