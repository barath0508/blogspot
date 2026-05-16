import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "This page doesn't exist. Explore our latest technology, AI, and business articles.",
  robots: { index: false, follow: true }
};

const LINKS = [
  { href: "/", label: "Home", icon: "🏠", desc: "Back to homepage" },
  { href: "/?category=technology", label: "Technology", icon: "💻", desc: "Latest tech news" },
  { href: "/?category=artificial-intelligence", label: "AI", icon: "🤖", desc: "AI & machine learning" },
  { href: "/?category=business", label: "Business", icon: "📈", desc: "Business & startups" },
];

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 py-16 animate-fade-up">
      {/* 404 */}
      <div className="relative mb-8 select-none">
        <span className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tighter text-surface-3">
          404
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tighter gradient-text"
          aria-hidden="true"
        >
          404
        </span>
      </div>

      <div className="max-w-md mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-base text-muted leading-relaxed">
          We couldn&apos;t find what you were looking for. It might have moved, been renamed, or perhaps never existed.
        </p>
      </div>

      {/* Quick links */}
      <div className="w-full max-w-lg mb-10">
        <p className="text-xs font-semibold text-muted-2 uppercase tracking-widest mb-4">Explore instead</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href as any}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center hover:border-accent/30 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <span className="text-2xl">{l.icon}</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{l.label}</span>
              <span className="text-xs text-muted">{l.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/" className="btn btn-primary gap-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Homepage
      </Link>
    </div>
  );
}
