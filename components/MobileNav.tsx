"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background border-l border-border/40 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <Link href="/" onClick={() => setOpen(false)} className="font-serif text-lg font-bold text-foreground">
                The Chronicle
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col p-4 flex-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href as any} onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/40 last:border-0">
                  {l.label}
                </Link>
              ))}
              <Link href="/admin" onClick={() => setOpen(false)}
                className="mt-4 flex h-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Subscribe
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
