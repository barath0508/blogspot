"use client";

import { useState, useRef, useCallback } from "react";

export function CopyCodeButton({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = useCallback(async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="code-block-wrapper group relative">
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
        className={`copy-code-btn absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
          copied
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-border/60 bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:border-primary hover:text-primary"
        }`}
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copy
          </>
        )}
      </button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
