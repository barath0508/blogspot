"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
};

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!inView) { setCurrent(0); return; }

    const duration = 2000; // ms
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, target]);

  return (
    <span className="tabular-nums">
      {current.toLocaleString()}{suffix}
    </span>
  );
}

const STAT_ICONS = {
  articles: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  categories: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  views: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  frequency: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
};

type Props = {
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
};

export function StatsCounter({ totalArticles, totalCategories, totalViews }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats: Stat[] = [
    { value: totalArticles, suffix: "+", label: "Articles Published", icon: STAT_ICONS.articles },
    { value: totalCategories, suffix: "", label: "Topics Covered", icon: STAT_ICONS.categories },
    { value: totalViews, suffix: "+", label: "Total Reads", icon: STAT_ICONS.views },
    { value: 48, suffix: "/day", label: "New Articles Daily", icon: STAT_ICONS.frequency },
  ];

  return (
    <section ref={ref} className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stats-card group relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Decorative gradient */}
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {stat.icon}
                </div>
                <p className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
