import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Tech & Trends";
const SITE_DESCRIPTION = "Your daily source for AI-powered insights on technology, digital growth, and trending innovations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Tech, AI & Digital Insights`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["technology blog", "AI insights", "digital growth", "tech trends", "nextjs blog", "trending tech"],
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
  openGraph: {
    title: `${SITE_NAME} — Tech, AI & Digital Insights`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Tech, AI & Digital Insights`,
    description: SITE_DESCRIPTION,
    site: "@techtrends"
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string"
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://image.pollinations.ai" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={`${jakarta.className} bg-[#fafafa] text-gray-900`}>
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-2 font-bold text-gray-900 tracking-tight text-lg">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105 text-sm font-black">T</span>
              <span className="truncate">Tech<span className="text-indigo-600 font-extrabold hidden sm:inline">Trends</span></span>
            </Link>
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <Link href="/" className="rounded-xl px-3 py-2 sm:px-4 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                Home
              </Link>
              <Link href="/admin" className="rounded-xl px-3 py-2 sm:px-4 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-5xl px-4 py-10 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-gray-100 bg-white mt-16">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-3 max-w-xs">
                <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg w-fit">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black">T</span>
                  <span>Tech<span className="text-indigo-600 font-extrabold">Trends</span></span>
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  AI-powered insights on technology, digital growth, and trending innovations — updated automatically 24/7.
                </p>
              </div>
              <div className="flex gap-10 text-sm">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Navigate</span>
                  <Link href="/" className="text-gray-500 hover:text-indigo-600 transition-colors">Home</Link>
                  <Link href="/admin" className="text-gray-500 hover:text-indigo-600 transition-colors">Admin</Link>
                  <a href="/sitemap.xml" className="text-gray-500 hover:text-indigo-600 transition-colors" target="_blank" rel="noopener">Sitemap</a>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Connect</span>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">Twitter / X</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400">
              <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
              <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Systems Online
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
