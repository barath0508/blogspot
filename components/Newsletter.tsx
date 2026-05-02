"use client";

import { useState } from "react";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
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
        // If it fails, revert to idle so they can try again
        setStatus("idle");
        alert("Failed to subscribe. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Network error. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-16 sm:px-12 sm:py-20 animate-fade-up">
      {/* Decorative background blobs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl mix-blend-multiply" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl mix-blend-multiply" />
      
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Get the latest insights delivered to your inbox
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Join thousands of readers who stay ahead of the curve with our weekly roundup of tech, AI, and digital trends.
        </p>

        {status === "success" ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-2xl bg-green-50 px-6 py-8 border border-green-100 animate-fade-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-green-800">You're on the list!</p>
            <p className="text-sm text-green-600">Keep an eye on your inbox for our next update.</p>
          </div>
        ) : (
          <form onSubmit={subscribe} className="mt-8 sm:mx-auto sm:flex sm:max-w-lg items-center gap-3">
            <div className="flex-1 min-w-0 relative">
              <label htmlFor="cta-email" className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="cta-email"
                type="email"
                className="block w-full rounded-xl border border-gray-200 pl-11 py-3.5 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                suppressHydrationWarning
              />
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="submit"
                disabled={status === "loading"}
                className="block w-full rounded-xl bg-gray-900 px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                suppressHydrationWarning
              >
                {status === "loading" ? "Subscribing..." : "Subscribe →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
