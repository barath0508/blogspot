import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_URL = getSiteUrl();
const SITE_NAME = "Trendly";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getPublishedPosts({ tag: slug });
  if (posts.length === 0) return { title: "Tag not found" };

  const tagName = posts[0].tags?.find((tag) => tag.slug === slug)?.name ?? slug.replace(/-/g, " ");
  const title = `${tagName} articles | ${SITE_NAME}`;
  const description = `Find the latest Trendly articles tagged ${tagName}.`;
  const url = `${SITE_URL}/tag/${slug}`;

  return buildPageMetadata({
    title,
    description,
    url,
    keywords: [tagName, "Trendly", "technology", "AI", "articles"],
    imageUrl: `${SITE_URL}/og-default.png`,
  });
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const { posts, total } = await getPublishedPosts({ tag: slug });

  if (total === 0) return notFound();

  const tagName = posts[0].tags?.find((tag) => tag.slug === slug)?.name ?? slug.replace(/-/g, " ");

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
        "name": tagName,
        "item": `${SITE_URL}/tag/${slug}`
      }
    ]
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/tag/${slug}/#webpage`,
    "url": `${SITE_URL}/tag/${slug}`,
    "name": `${tagName} articles | Trendly`,
    "description": `Find the latest Trendly articles tagged ${tagName}.`,
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    },
    "hasPart": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `${SITE_URL}/blog/${post.slug}`,
      "description": post.excerpt,
      "datePublished": post.published_at
    }))
  };

  return (
    <main className="min-h-screen bg-background">
      <Script id="tag-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="tag-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Tag</p>
            <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              #{tagName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Explore Trendly articles tagged with {tagName} and stay up to date on the latest insights.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn btn-secondary">
              Browse all articles
            </Link>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-muted-foreground">
              {total} article{total !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
