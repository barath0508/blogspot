"use client";

import { useEffect, useState } from "react";
import { Mail, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const router = useRouter();

  const CURRENT_VERSION = "2026-07-03";
  const SEEN_KEY = "app_modal_seen";
  const VISIT_KEY = "app_visited";

  useEffect(() => {
    try {
      const visited = localStorage.getItem(VISIT_KEY);
      // CRITICAL SEO STEP: First visit bypass
      // If they have never visited, just log the visit and exit.
      // This prevents showing interstitials to new traffic from Google Search or Googlebot.
      if (!visited) {
        localStorage.setItem(VISIT_KEY, "1");
        return;
      }

      const seen = localStorage.getItem(SEEN_KEY);
      if (seen === CURRENT_VERSION) {
        return; // Already seen this version
      }

      // Show the modal to returning users after a small delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    } catch (e) {
      console.warn("localStorage not accessible:", e);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, CURRENT_VERSION);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        try {
          localStorage.setItem(SEEN_KEY, CURRENT_VERSION);
        } catch (e) {
          console.error(e);
        }
        // Redirect or close after a delay
        setTimeout(() => {
          setIsOpen(false);
          router.push("/newsletter/confirmed");
        }, 1500);
      } else {
        setStatus("idle");
        alert("Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("idle");
      alert("Network error. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="newsletterModal"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:bg-card/85">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>

          <h2
            id="modal-title"
            className="font-serif text-2xl font-bold text-foreground tracking-tight"
          >
            Join the Trendly Newsletter
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Get the latest autonomous AI technology trends, in-depth reports, and weekly updates delivered straight to your inbox.
          </p>

          {status === "success" ? (
            <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 p-4 text-primary animate-fade-in">
              <Check className="h-5 w-5" />
              <span className="font-semibold text-sm">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="h-11 w-full rounded-lg border border-border/60 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center text-sm"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
          )}

          <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
            By joining, you agree to our{" "}
            <a href="/privacy-policy" className="underline hover:text-primary transition-colors">
              Privacy Policy
            </a>{" "}
            and consent to receive digital updates. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
