"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const COOKIE_CONSENT_KEY = "cookie_consent";
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (typeof parsed === "object" && parsed !== null) return parsed;
    if (stored === "accepted") return { ads: true, analytics: true, accepted: true };
    if (stored === "declined") return { ads: false, analytics: false, accepted: true };
  } catch {
    return null;
  }
  return null;
}

export function AdSenseAd({ slotId, className }: { slotId: string; className?: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    setAllowed(Boolean(consent?.ads) && Boolean(ADSENSE_CLIENT_ID) && Boolean(slotId));

    const handleConsentChange = () => {
      const next = getConsent();
      setAllowed(Boolean(next?.ads) && Boolean(ADSENSE_CLIENT_ID) && Boolean(slotId));
    };

    window.addEventListener("cookie-consent-updated", handleConsentChange);
    return () => window.removeEventListener("cookie-consent-updated", handleConsentChange);
  }, [slotId]);

  useEffect(() => {
    if (!allowed) return;
    if (!ADSENSE_CLIENT_ID || !slotId) return;

    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const pushAd = () => {
      if (window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
        } catch (error) {
          console.error("AdSense push failed", error);
        }
      }
    };

    const timeout = window.setTimeout(pushAd, 500);
    return () => window.clearTimeout(timeout);
  }, [allowed, slotId]);

  if (!allowed) return null;

  return (
    <div className={className ?? "my-10"}>
      <ins
        className="adsbygoogle block mx-auto"
        style={{ display: "block", minHeight: "100px" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
