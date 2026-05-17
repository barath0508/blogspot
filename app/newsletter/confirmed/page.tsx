import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Subscription Confirmed",
  description: "Your newsletter subscription is confirmed. Enjoy the latest Trendly articles delivered straight to your inbox.",
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app"}/newsletter/confirmed`,
  noindex: true,
});

export default function NewsletterConfirmed() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center animate-fade-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">You&apos;re subscribed!</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Welcome to Trendly. You&apos;ll receive the latest AI-powered insights on technology, AI, and digital trends directly in your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Browse Articles
          </Link>
          <Link href="/saved" className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            Saved Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
