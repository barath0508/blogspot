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
    <div className="fixed bottom-0 left-0 right-0 z-[999] border-t border-border bg-card/95 backdrop-blur-md shadow-2xl animate-fade-up">
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">We use cookies 🍪</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and serve personalized ads.
              Choose "Accept all" to enable analytics and ads, or "Reject non-essential" to disable them.
              <Link href="/cookie-policy" className="text-primary hover:underline underline-offset-2">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center shrink-0">
            <button
              onClick={rejectNonEssential}
              className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Reject non-essential
            </button>
            <button
              onClick={acceptAll}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
