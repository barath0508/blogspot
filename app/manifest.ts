import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trendly",
    short_name: "Trendly",
    description: "Trending technology news and AI-powered insights — updated every 6 hours.",
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
