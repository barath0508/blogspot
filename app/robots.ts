import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seoHelper";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/login", "/checkout", "/test.html", "/*-draft.html"],
        crawlDelay: 1
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/?q=", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/?q=", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "CCBot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/checkout", "/test.html", "/*-draft.html"]
      },
      {
        userAgent: "Omgilibot",
        disallow: ["/"]
      }
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/google-news-sitemap.xml`, `${SITE_URL}/feed.xml`],
    host: SITE_URL
  };
}
