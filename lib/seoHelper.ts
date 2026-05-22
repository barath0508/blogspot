export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/$/, "");
  }

  const publicVercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (publicVercel && publicVercel.trim() !== "") {
    return `https://${publicVercel}`.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim() !== "") {
    return `https://${vercelUrl}`.replace(/\/$/, "");
  }

  return "https://blogspot-phi.vercel.app";
}

export function isOptimizable(src: string | null | undefined): boolean {
  if (!src) return false;
  
  // Local paths are always optimizable by Next.js
  if (src.startsWith("/") || src.startsWith(".") || !src.includes("://")) {
    return true;
  }

  // Allowed external domains matching next.config.ts remotePatterns
  const optimizableHosts = [
    "image.pollinations.ai",
    "images.unsplash.com",
    "source.unsplash.com",
    "loremflickr.com",
    "i.pravatar.cc"
  ];

  try {
    const url = new URL(src);
    return optimizableHosts.some(host => url.hostname === host || url.hostname.endsWith("." + host));
  } catch (e) {
    return false;
  }
}

