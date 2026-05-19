"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type ReadNextPost = {
  slug: string;
  title: string;
  cover_image: string | null;
  category?: string;
};

export function ReadNextBar({ post }: { post: ReadNextPost | null }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!post || dismissed) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      // Show after 60% scroll, hide when near the bottom (95%) to avoid overlap with footer
      if (scrollPercent > 0.6 && scrollPercent < 0.95) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post, dismissed]);

  if (!post || dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-500 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <div className="read-next-bar relative flex items-center gap-4 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl p-3 shadow-2xl shadow-background/50">
          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors shadow-sm"
            aria-label="Dismiss"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Thumbnail */}
          {post.cover_image && (
            <Link href={`/blog/${post.slug}`} className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            </Link>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Read Next</span>
              {post.category && (
                <>
                  <span className="text-border">·</span>
                  <span className="text-[10px] text-muted-foreground">{post.category}</span>
                </>
              )}
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="block text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {post.title}
            </Link>
          </div>

          {/* Arrow */}
          <Link
            href={`/blog/${post.slug}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label={`Read: ${post.title}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
