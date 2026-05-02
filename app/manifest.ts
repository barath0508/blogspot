import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tech & Trends",
    short_name: "TechTrends",
    description: "Your daily source for AI-powered insights on technology, digital growth, and trending innovations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    categories: ["news", "technology", "education"],
    lang: "en-US",
    dir: "ltr"
  };
}
