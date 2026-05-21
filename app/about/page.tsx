import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Rss, Mail } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";
const SITE_URL = getSiteUrl();
const CONTACT_EMAIL = "hello@trendly.com";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description: `Learn about ${SITE_NAME} — our mission, editorial process, and the technology behind our AI-powered publication.`,
  url: `${SITE_URL}/about`,
  keywords: ["about", "Trendly", "technology", "AI", "editorial"],
});

export default function About() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": `${SITE_URL}/about`
      }
    ]
  };

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about/#webpage`,
    "url": `${SITE_URL}/about`,
    "name": "About Us | Trendly",
    "description": `Learn about ${SITE_NAME} — our mission, editorial process, and the technology behind our AI-powered publication.`,
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    },
    "mainEntity": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": `${SITE_URL}/icon-512.png`,
      "description": "An AI-powered technology publication delivering expert-level analysis on artificial intelligence, software development, and the ideas shaping our digital future."
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script id="about-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="about-page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }} />
      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        {/* Hero */}
        <header className="mb-16">
          <span className="text-sm font-medium text-primary">About Us</span>
          <h1 className="mt-2 font-serif text-4xl font-bold text-foreground lg:text-5xl">
            We believe in the power of <span className="text-primary">well-crafted content</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {SITE_NAME} is an AI-powered technology publication delivering expert-level analysis on artificial intelligence, software development, and the ideas shaping our digital future.
          </p>
        </header>

        {/* Mission */}
        <section className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-card p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trendly was founded with a simple mission: to democratize access to high-quality technology journalism by combining AI efficiency with editorial standards.
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground mb-3">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use Google Gemini AI to identify trending topics and generate comprehensive articles, then publish them automatically every 30 minutes. All content is clearly disclosed as AI-assisted.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16 rounded-lg border border-border/40 bg-card p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">By the numbers</h2>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: "48+", label: "Articles per day" },
              { value: "30min", label: "Publish frequency" },
              { value: "100%", label: "AI-assisted content" },
              { value: "Free", label: "Always free to read" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial process */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Our Editorial Process</h2>
          <div className="space-y-4">
            {[
              { step: "01", title: "Trend Detection", desc: "Our system monitors Google Trends every 30 minutes to identify the most relevant and timely topics." },
              { step: "02", title: "AI Content Generation", desc: "Google Gemini generates a comprehensive, SEO-optimized article with proper structure, headings, and metadata." },
              { step: "03", title: "Quality Checks", desc: "Automated checks validate content length, structure, and metadata before publication." },
              { step: "04", title: "Publication", desc: "Articles are published with full SEO metadata, structured data, and cover images generated by AI." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 rounded-lg border border-border/40 bg-card p-5">
                <span className="font-serif text-2xl font-bold text-primary/30 shrink-0 w-10">{item.step}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Disclosure */}
        <section className="mb-16 rounded-lg border border-primary/20 bg-primary/5 p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-3">AI Content Disclosure</h2>
          <p className="text-muted-foreground leading-relaxed">
            In the interest of full transparency, all articles on {SITE_NAME} are generated using artificial intelligence (Google Gemini). While we strive for accuracy, AI-generated content may contain errors. We encourage readers to verify important information from primary sources. See our <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for full details.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-lg border border-border/40 bg-card p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Mail, label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
              { icon: Rss, label: "RSS Feed", value: "Subscribe to our feed", href: `${SITE_URL}/feed.xml` },
              { icon: () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "Twitter / X", value: "@trendly", href: "https://twitter.com/trendly" },
              { icon: () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, label: "LinkedIn", value: "Trendly", href: "https://linkedin.com/company/trendly" },
            ].map((item) => (
              <a key={item.label} href={item.href} target={item.href.startsWith("mailto") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex items-center gap-3 rounded-lg border border-border/40 p-4 hover:border-primary/40 transition-colors group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
