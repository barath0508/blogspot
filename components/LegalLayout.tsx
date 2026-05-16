import Link from "next/link";

type Props = {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, description, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-20">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-border/40">
          <h1 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">{title}</h1>
          <p className="mt-3 text-muted-foreground">{description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>

        {/* Content */}
        <div className="prose prose-sm max-w-none
          [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3
          [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc
          [&_li]:mb-1.5
          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
          [&_strong]:text-foreground [&_strong]:font-semibold">
          {children}
        </div>
      </main>
    </div>
  );
}
