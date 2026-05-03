import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "@/components/Toast";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Insight Daily";
const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world."
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Technology, AI & Ideas`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["technology", "artificial intelligence", "digital trends", "tech analysis", "innovation", "future of tech"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? ""]
    }
  },
  openGraph: {
    title: `${SITE_NAME} — Technology, AI & Ideas`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Technology, AI & Ideas`,
    description: SITE_DESCRIPTION,
    site: "@insightdaily"
  }
};

const PUBLISHER = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
    caption: SITE_NAME
  },
  sameAs: [
    "https://twitter.com/insightdaily",
    "https://linkedin.com/company/insightdaily"
  ]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string"
      }
    },
    PUBLISHER
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.pollinations.ai" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS Feed`} href={`${SITE_URL}/feed.xml`} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={`${jakarta.className} bg-[#fafafa] text-gray-900`}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname,anonymize_ip:true,cookie_flags:'SameSite=None;Secure'});`}
            </Script>
          </>
        )}
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-2.5 font-bold text-gray-900 tracking-tight">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105 text-sm font-black">I</span>
              <span className="text-lg tracking-tight">Insight<span className="text-indigo-600 font-extrabold">Daily</span></span>
            </Link>
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <Link href="/" className="rounded-xl px-3 py-2 sm:px-4 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Home</Link>
              <Link href="/?category=technology" className="hidden sm:block rounded-xl px-3 py-2 sm:px-4 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Topics</Link>
              <Link href={"/saved" as any} className="rounded-xl px-3 py-2 sm:px-4 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-1.5"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg><span className="hidden sm:inline">Saved</span></Link>
              <Link href="/admin" className="ml-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">Dashboard</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-5xl px-4 py-10 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-gray-100 bg-white mt-20">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4 max-w-sm">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-gray-900 w-fit">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-black">I</span>
                  <span className="text-lg">Insight<span className="text-indigo-600 font-extrabold">Daily</span></span>
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world — published automatically every 30 minutes.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <a href="https://twitter.com/insightdaily" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://linkedin.com/company/insightdaily" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="/sitemap.xml" target="_blank" rel="noopener" className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-medium ml-1">Sitemap</a>
                </div>
              </div>
              <div className="flex gap-12 text-sm">
                <div className="flex flex-col gap-2.5">
                  <span className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Explore</span>
                  <Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors">Home</Link>
                  <Link href="/?category=technology" className="text-gray-500 hover:text-indigo-600 transition-colors">Technology</Link>
                  <Link href="/?category=ai" className="text-gray-500 hover:text-indigo-600 transition-colors">Artificial Intelligence</Link>
                  <Link href="/?category=business" className="text-gray-500 hover:text-indigo-600 transition-colors">Business</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1">Company</span>
                  <Link href="/admin" className="text-gray-500 hover:text-indigo-600 transition-colors">Dashboard</Link>
                  <a href="mailto:hello@insightdaily.com" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact</a>
                  <a href="/sitemap.xml" target="_blank" rel="noopener" className="text-gray-500 hover:text-indigo-600 transition-colors">Sitemap</a>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400">
              <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
              <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Publishing live
              </span>
            </div>
          </div>
        </footer>
        <ToastContainer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
