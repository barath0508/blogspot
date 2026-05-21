"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie_consent";

interface CookieConsent {
  accepted: boolean;
  analytics: boolean;
  ads: boolean;
  updatedAt: string;
}

function parseConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === "object" && parsed !== null && "accepted" in parsed) {
      return parsed as CookieConsent;
    }
  } catch {
    if (stored === "accepted") {
      return { accepted: true, analytics: true, ads: true, updatedAt: new Date().toISOString() };
    }
    if (stored === "declined") {
      return { accepted: true, analytics: false, ads: false, updatedAt: new Date().toISOString() };
    }
  }

  return null;
}

function notifyConsentUpdated() {
  window.dispatchEvent(new Event("cookie-consent-updated"));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = parseConsent();
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    const consent: CookieConsent = {
      accepted: true,
      analytics: true,
      ads: true,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
    notifyConsentUpdated();
  };

  const rejectNonEssential = () => {
    const consent: CookieConsent = {
      accepted: true,
      analytics: false,
      ads: false,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
    notifyConsentUpdated();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-[calc(1.5rem+env(safe-area-inset-left,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))] md:left-[calc(1.5rem+env(safe-area-inset-left,0px))] md:right-auto md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:max-w-md z-[999] rounded-xl border border-border/60 bg-card/95 backdrop-blur-md p-5 shadow-2xl animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
            <span>We use cookies 🍪</span>
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use cookies to improve your experience, analyze traffic, and serve personalized ads.
            Choose "Accept all" to enable analytics and ads, or "Reject non-essential" to disable them.{" "}
            <Link href="/cookie-policy" className="text-primary hover:underline underline-offset-2 font-medium">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={rejectNonEssential}
            className="flex-1 text-center rounded-lg border border-border px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Reject
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 text-center rounded-lg bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
