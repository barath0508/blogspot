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
