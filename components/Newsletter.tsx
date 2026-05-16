"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

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
      if (res.ok) { setStatus("success"); setEmail(""); }
      else { setStatus("idle"); alert("Failed to subscribe. Please try again."); }
    } catch { setStatus("idle"); alert("Network error. Please try again."); }
  };

  return (
    <section className="border-y border-border/40 bg-secondary/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            <span className="text-balance">Stay in the loop</span>
          </h2>

          <p className="mt-3 text-muted-foreground lg:text-lg">
            <span className="text-pretty">
              Get the latest articles, insights, and updates delivered straight to your inbox. No spam, unsubscribe anytime.
            </span>
          </p>

          {status === "success" ? (
            <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-4 text-primary">
              <Check className="h-5 w-5" />
              <span className="font-medium">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="h-11 flex-1 rounded-md border border-border/60 bg-background px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70 whitespace-nowrap"
                suppressHydrationWarning
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}
