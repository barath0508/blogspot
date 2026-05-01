import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const SITE_NAME = "Tech & Trends";
const SITE_DESCRIPTION = "Your daily source for AI-powered insights on technology, digital growth, and trending innovations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Next.js + Supabase`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["blog", "nextjs", "supabase", "technology", "trending", "AI"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: SITE_NAME
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fafafa] text-gray-900`}>
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/70 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-2.5 font-bold text-gray-900 tracking-tight text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105 text-sm font-black">T</span>
              Tech<span className="text-indigo-600 font-extrabold">Trends</span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                Home
              </Link>
              <Link href="/admin" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-5xl px-4 py-10 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-gray-100 bg-white mt-12">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 sm:px-6 text-sm text-gray-500">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900">Tech & Trends © {new Date().getFullYear()}</span>
              <span>All rights reserved.</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Systems Online
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
