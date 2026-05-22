import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getSupabase } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { ArrowRight, Cpu, Layers, MessageSquare, ShieldAlert, Sparkles, Terminal, TrendingUp, Zap } from "lucide-react";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";
const SITE_URL = getSiteUrl();

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Topics — Explore Articles by Category",
  description: "Browse Trendly articles by category. Find insights on artificial intelligence, software development, startups, cybersecurity, and digital trends.",
  url: `${SITE_URL}/categories`,
  imageUrl: `${SITE_URL}/og-default.png`,
});

// Curated definitions for known categories to make them look professional
const CATEGORY_META: Record<string, { desc: string; color: string; icon: any }> = {
  "technology": {
    desc: "In-depth coverage of emerging gadgets, digital transformation, and general tech innovations.",
    color: "from-blue-500 to-cyan-500 border-blue-500/20 text-blue-500 bg-blue-500/10",
    icon: Cpu
  },
  "artificial-intelligence": {
    desc: "Machine learning breakthroughs, neural networks, LLMs, automation, and the ethics of AI.",
    color: "from-purple-500 to-indigo-500 border-purple-500/20 text-purple-500 bg-purple-500/10",
    icon: Sparkles
  },
  "software-development": {
    desc: "Guides, frameworks, and reviews of languages, tools, architectures, and engineering practices.",
    color: "from-emerald-500 to-teal-500 border-emerald-500/20 text-emerald-500 bg-emerald-500/10",
    icon: Terminal
  },
  "business": {
    desc: "Analyses of enterprise solutions, technology markets, corporate developments, and finance.",
    color: "from-amber-500 to-orange-500 border-amber-500/20 text-amber-500 bg-amber-500/10",
    icon: Layers
  },
  "startup": {
    desc: "Spotlights on founders, venture capital, early-stage growth strategies, and disruptors.",
    color: "from-orange-500 to-red-500 border-orange-500/20 text-orange-500 bg-orange-500/10",
    icon: Zap
  },
  "innovation": {
    desc: "Breakthrough inventions, moonshot concepts, and creative paradigms changing our world.",
    color: "from-teal-500 to-green-500 border-teal-500/20 text-teal-500 bg-teal-500/10",
    icon: Sparkles
  },
  "cybersecurity": {
    desc: "Critical updates on digital security, privacy concerns, encryption, and threat analysis.",
    color: "from-red-500 to-rose-500 border-red-500/20 text-red-500 bg-red-500/10",
    icon: ShieldAlert
  },
  "trending": {
    desc: "Real-time updates on high-velocity stories captures directly from digital trends.",
    color: "from-rose-500 to-pink-500 border-rose-500/20 text-rose-500 bg-rose-500/10",
    icon: TrendingUp
  }
};

const DEFAULT_META = {
  desc: "Browse our articles and discover detailed analyses on topics of interest.",
  color: "from-slate-500 to-zinc-500 border-border text-muted-foreground bg-secondary/40",
  icon: MessageSquare
};

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default async function CategoriesPage() {
  const supabase = getSupabase();

  const [{ data: categoriesData }, { data: postCategoriesData }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    supabase.from("post_categories").select("category_id, posts!inner(is_published)").eq("posts.is_published", true)
  ]);

  const categories = categoriesData || [];
  const postCategories = postCategoriesData || [];

  const countMap: Record<string, number> = {};
  postCategories.forEach((pc: any) => {
    countMap[pc.category_id] = (countMap[pc.category_id] ?? 0) + 1;
  });

  const categoriesWithCounts: CategoryItem[] = categories
    .map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: countMap[cat.id] ?? 0
    }))
    .filter((cat: any) => cat.count > 0) // Only show categories with published posts
    .sort((a: any, b: any) => b.count - a.count); // Sort by post count desc

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Topics",
        "item": `${SITE_URL}/categories`
      }
    ]
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/categories/#webpage`,
    "url": `${SITE_URL}/categories`,
    "name": "Topics — Explore Articles by Category | Trendly",
    "description": "Browse Trendly articles by category. Find insights on artificial intelligence, software development, startups, cybersecurity, and digital trends.",
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    },
    "hasPart": categoriesWithCounts.map((cat) => ({
      "@type": "WebPage",
      "name": cat.name,
      "url": `${SITE_URL}/category/${cat.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedGradient />
      <Script id="categories-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="categories-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-20">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Topics</span>
        </nav>

        <header className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Explore by Topic</span>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Diverse perspectives, <span className="text-primary">one publication.</span>
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Discover in-depth analysis, tutorials, and latest findings organized by tech sectors. Our AI generates comprehensive articles on these categories every 6 hours.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCounts.map((cat) => {
            const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META;
            const Icon = meta.icon;
            
            return (
              <Link 
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border/40 bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${meta.color} mb-5`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {meta.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-medium">
                  <span className="text-muted-foreground">
                    {cat.count} article{cat.count !== 1 ? "s" : ""}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform duration-200">
                    Explore
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
