import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Rss } from "lucide-react";

const SITE_NAME = "Trendly";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app";
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE_NAME} team. We welcome feedback, corrections, and partnership inquiries.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: { index: true, follow: true },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        <header className="mb-12">
          <span className="text-sm font-medium text-primary">Contact</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">Get in touch</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We welcome feedback, corrections, partnership inquiries, and press requests. Our team typically responds within 48 hours.
          </p>
        </header>

        {/* Contact cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          {[
            {
              icon: Mail,
              title: "General Inquiries",
              desc: "Questions, feedback, or corrections",
              value: CONTACT_EMAIL,
              href: `mailto:${CONTACT_EMAIL}`,
            },
            {
              icon: Mail,
              title: "Advertising",
              desc: "Partnership and advertising opportunities",
              value: `ads@trendly.com`,
              href: `mailto:ads@trendly.com`,
            },
            {
              icon: () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
              title: "Twitter / X",
              desc: "Follow us for the latest updates",
              value: "@trendly",
              href: "https://twitter.com/trendly",
            },
            {
              icon: () => <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
              title: "LinkedIn",
              desc: "Connect with us professionally",
              value: "Trendly",
              href: "https://linkedin.com/company/trendly",
            },
          ].map((item) => (
            <a key={item.title} href={item.href}
              target={item.href.startsWith("mailto") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="flex items-start gap-4 rounded-lg border border-border/40 bg-card p-5 hover:border-primary/40 transition-colors group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                <p className="text-sm text-primary mt-1">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* RSS */}
        <div className="rounded-lg border border-border/40 bg-card p-6 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Rss className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">RSS Feed</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Subscribe to our RSS feed to get new articles delivered directly to your feed reader.</p>
          <a href={`${SITE_URL}/feed.xml`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {SITE_URL}/feed.xml
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        {/* Content correction */}
        <div className="rounded-lg border border-border/40 bg-secondary/30 p-6">
          <h2 className="font-semibold text-foreground mb-2">Report a Content Issue</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Found an error or inaccuracy in one of our articles? Since our content is AI-generated, occasional errors may occur. Please email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>{" "}
            with the article URL and a description of the issue. We take accuracy seriously and will review all reports promptly.
          </p>
        </div>
      </main>
    </div>
  );
}
