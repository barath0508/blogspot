import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { TrendlyLogo } from "@/components/TrendlyLogo";
import { CookieBanner } from "@/components/CookieBanner";
import { CommandPalette } from "@/components/CommandPalette";
import { SearchTrigger } from "@/components/SearchTrigger";
import { getSiteUrl } from "@/lib/seoHelper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

const SITE_URL = getSiteUrl();
const SITE_NAME = "Trendly";
const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world.";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME} — Technology, AI & Ideas`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ["technology news","artificial intelligence","digital trends","tech analysis","innovation","future of tech","AI news","software development","startup news","cybersecurity","machine learning","data science"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: SITE_URL, types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google4867b014d6b90931", other: { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "f8d17c11209945da88ec4617d4cec8fb"] } },
  openGraph: { title: `${SITE_NAME} — Technology, AI & Ideas`, description: SITE_DESCRIPTION, url: SITE_URL, siteName: SITE_NAME, type: "website", locale: "en_US", images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: SITE_NAME }] },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — Technology, AI & Ideas`, description: SITE_DESCRIPTION, site: "@trendly", images: [`${SITE_URL}/og-default.png`] }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, inLanguage: "en-US", publisher: { "@id": `${SITE_URL}/#organization` }, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` }, "query-input": "required name=search_term_string" } },
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: `${SITE_URL}/icon-512.png`, width: 512, height: 512, caption: SITE_NAME }, sameAs: ["https://twitter.com/trendly","https://linkedin.com/company/trendly"] }
  ]
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category/technology", label: "Technology" },
  { href: "/categories", label: "Topics" },
  { href: "/about", label: "About" },
];

const FOOTER_LINKS = {
  explore: [
    { href: "/", label: "Home" },
    { href: "/category/technology", label: "Technology" },
    { href: "/category/artificial-intelligence", label: "Artificial Intelligence" },
    { href: "/category/business", label: "Business" },
    { href: `${SITE_URL}/feed.xml`, label: "RSS Feed" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/sitemap.xml", label: "Sitemap" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.pollinations.ai" />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS Feed`} href={`${SITE_URL}/feed.xml`} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} — Latest Articles`} href={`${SITE_URL}/feed.xml`} />
        {/* Feedly source metadata */}
        <meta name="webfeeds:cover" content={`${SITE_URL}/og-default.png`} />
        <meta name="webfeeds:icon" content={`${SITE_URL}/icon-512.png`} />
        <meta name="webfeeds:logo" content={`${SITE_URL}/icon-512.png`} />
        <meta name="webfeeds:accentColor" content="#0d9488" />
        <meta name="webfeeds:related" content="layout=card&target=browser" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Google Publisher Center */}
        <meta name="google-news-publication" content="Trendly" />
        <link rel="author" href={`${SITE_URL}/humans.txt`} />
        <link rel="sitemap" type="application/xml" href={`${SITE_URL}/sitemap.xml`} />
        <link rel="sitemap" type="application/xml" title="Google News Sitemap" href={`${SITE_URL}/google-news-sitemap.xml`} />
        {/* Google Subscribe with Google (SwG) — Google News integration */}
        <script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <a href="#main-content" className="skip-link">Skip to content</a>

        <Script id="swg-init" strategy="afterInteractive">{`
          (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAow1c3GDA:openaccess",
              clientOptions: { theme: "light", lang: "en-GB" },
            });
          });
        `}</Script>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname,anonymize_ip:true});`}</Script>
          </>
        )}
        <Script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

        {/* ── Header ── */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))] lg:px-8 lg:pl-[calc(2rem+env(safe-area-inset-left,0px))] lg:pr-[calc(2rem+env(safe-area-inset-right,0px))]">
            <Link href="/" className="flex items-center group" aria-label={`${SITE_NAME} — Home`}>
              <TrendlyLogo className="h-7 w-auto text-foreground transition-transform duration-300 group-hover:scale-[1.02]" />
            </Link>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href as any}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <SearchTrigger />
              <ThemeToggle />
              <Link href="/admin"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Subscribe
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <MobileNav links={NAV_LINKS} />
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-border/40 bg-card py-12 lg:py-16" aria-label="Site footer">
          <div className="mx-auto max-w-6xl px-4 pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))] lg:px-8 lg:pl-[calc(2rem+env(safe-area-inset-left,0px))] lg:pr-[calc(2rem+env(safe-area-inset-right,0px))]">
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Link href="/" className="inline-block">
                  <span className="font-serif text-xl font-bold text-foreground">{SITE_NAME}</span>
                </Link>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  A modern publication exploring technology, AI, and the ideas shaping our future. Written by experts and powered by AI.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  {[
                    { label: "Twitter", href: "https://twitter.com/trendly", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { label: "LinkedIn", href: "https://linkedin.com/company/trendly", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { label: "RSS", href: `${SITE_URL}/feed.xml`, icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="3" cy="17" r="2"/><path d="M3 7a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V7z"/><path d="M3 3a14 14 0 0 1 14 14h-2A12 12 0 0 0 3 5V3z"/></svg> },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {([
                { title: "Content", links: FOOTER_LINKS.explore },
                { title: "Company", links: FOOTER_LINKS.company },
              ] as const).map((col) => (
                <div key={col.title}>
                  <h4 className="mb-4 text-sm font-semibold text-foreground">{col.title}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href as any} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "Terms of Service", href: "/terms-of-service" },
                    { label: "Cookie Policy", href: "/cookie-policy" },
                    { label: "Disclaimer", href: "/disclaimer" },
                  ].map((l) => (
                    <li key={l.label}>
                      <Link href={l.href as any} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 lg:flex-row">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by AI — publishing every 30 minutes.
              </p>
            </div>
          </div>
        </footer>

        <CommandPalette />
        </ThemeProvider>
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
