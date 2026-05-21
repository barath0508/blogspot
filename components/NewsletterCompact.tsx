"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function NewsletterCompact() {
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
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("idle");
        alert("Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("idle");
      alert("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-primary text-xs">
        <Check className="h-4 w-4 shrink-0" />
        <span className="font-semibold">Subscribed successfully!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors disabled:opacity-75"
      >
        {status === "loading" ? "Joining..." : "Subscribe to Newsletter"}
      </button>
    </form>
  );
}
