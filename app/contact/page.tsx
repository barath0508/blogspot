import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Twitter, Linkedin, Rss } from "lucide-react";

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
              icon: Twitter,
              title: "Twitter / X",
              desc: "Follow us for the latest updates",
              value: "@trendly",
              href: "https://twitter.com/trendly",
            },
            {
              icon: Linkedin,
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
