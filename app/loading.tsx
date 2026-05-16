export default function Loading() {
  return (
    <div className="space-y-14 animate-fade-in">
      {/* Hero skeleton */}
      <div className="rounded-2xl bg-surface-2 h-64 skeleton" />

      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-7 w-40 skeleton rounded-lg" />
        <div className="h-6 w-20 skeleton rounded-full" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[80, 60, 90, 70, 80].map((w, i) => (
          <div key={i} className={`h-9 skeleton rounded-full`} style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Cards grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="h-52 skeleton" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-3.5 w-24 skeleton rounded-md" />
              <div className="h-5 w-full skeleton rounded-md" />
              <div className="h-5 w-3/4 skeleton rounded-md" />
              <div className="h-4 w-full skeleton rounded-md mt-1" />
              <div className="h-4 w-2/3 skeleton rounded-md" />
              <div className="h-px bg-border mt-2" />
              <div className="h-4 w-20 skeleton rounded-md" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
