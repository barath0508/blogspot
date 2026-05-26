import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CommentsSection } from "@/components/CommentsSection";
import { LikeButton } from "@/components/LikeButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import { BackToTop } from "@/components/BackToTop";
import { ViewCounter } from "@/components/ViewCounter";
import { BookmarkButton } from "@/components/BookmarkButton";
import { AdSenseAd } from "@/components/AdSenseAd";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { ReadNextBar } from "@/components/ReadNextBar";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";
import { getSiteUrl, isOptimizable } from "@/lib/seoHelper";

const SITE_URL = getSiteUrl();
const SITE_NAME = "Trendly";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const { posts } = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.cover_image ?? undefined;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const category = post.categories?.[0]?.name;
  const keywords = post.seo_keywords?.length ? post.seo_keywords : undefined;
  return {
    title: { absolute: title }, description, keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME, publisher: SITE_NAME,
    category: category ?? "Technology",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    alternates: { canonical: url, types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
    openGraph: {
      title, description, url, siteName: SITE_NAME, type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      section: category, tags: keywords, locale: "en_US",
      images: image
        ? [{ url: image, alt: title, width: 1600, height: 900, type: "image/jpeg" }]
        : [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: "summary_large_image", title, description,
      site: "@trendly", creator: "@trendly",
      images: image ? [{ url: image, alt: title }] : [`${SITE_URL}/og-default.png`]
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();

  const supabase = getSupabase();
  const firstTag = post.tags?.[0]?.slug;

  const [{ data: comments }, { count }, relatedAllResult] = await Promise.all([
    supabase.from("comments").select("id,author_name,body,created_at")
      .eq("post_id", post.id).eq("is_approved", true).order("created_at", { ascending: false }),
    supabase.from("post_likes").select("id", { head: true, count: "exact" }).eq("post_id", post.id),
    firstTag ? getPublishedPosts({ tag: firstTag }) : getPublishedPosts()
  ]);

  const { posts: relatedAll } = relatedAllResult;
  const relatedPosts = relatedAll.filter((p) => p.slug !== post.slug).slice(0, 3);
  const wordCount = (post.content ?? "").trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Draft";
  const isoDate = post.published_at ?? post.created_at;
  const category = post.categories?.[0];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}/#article`,
        headline: post.meta_title || post.title,
        name: post.title,
        description: post.meta_description || post.excerpt,
        articleBody: post.content,
        articleSection: category?.name ?? "Technology",
        wordCount, timeRequired: `PT${readTime}M`,
        inLanguage: "en-US", isAccessibleForFree: true,
        url: postUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        datePublished: post.published_at ?? post.created_at,
        dateModified: post.updated_at ?? post.published_at ?? post.created_at,
        image: post.cover_image ? { "@type": "ImageObject", url: post.cover_image, width: 1600, height: 900 } : undefined,
        keywords: post.seo_keywords.join(", "),
        author: { "@type": "Person", name: "Trendly AI Team" },
        publisher: { "@type": "Organization", name: "Trendly | Technology, AI & Ideas", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` }] : []),
          { "@type": "ListItem", position: category ? 3 : 2, name: post.title, item: postUrl }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <ViewCounter slug={post.slug} />
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <main className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        
        {/* ── Body: content + sidebar ── */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 items-start pb-20">

          {/* Article content */}
          <div className="min-w-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Home
              </Link>
              {category && (
                <>
                  <span className="text-border">/</span>
                  <Link href={`/category/${category.slug}`} className="hover:text-foreground transition-colors">{category.name}</Link>
                </>
              )}
              <span className="text-border">/</span>
              <span className="text-muted-foreground/60 line-clamp-1 max-w-[180px]">{post.title}</span>
            </nav>

            {/* ── Header ── */}
            <header className="mb-8">
              {/* Category + tags */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {category && (
                  <Link href={`/category/${category.slug}`}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    {category.name}
                  </Link>
                )}
                {post.tags?.slice(0, 3).map((tag) => (
                  <Link key={tag.slug} href={`/tag/${tag.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    #{tag.name}
                  </Link>
                ))}
              </div>

              <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>

              {/* Byline */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border/40 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary shrink-0">
                    T
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{SITE_NAME} Editorial</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={isoDate}>{dateStr}</time>
                      <span>·</span>
                      <span>{readTime} min read</span>
                      <span>·</span>
                      <span>{wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LikeButton slug={post.slug} initialLikes={count ?? 0} />
                  <BookmarkButton slug={post.slug} withLabel />
                </div>
              </div>
            </header>

            {/* Cover image — contained, not full-width */}
            {post.cover_image && (
              <div className="relative mb-10 overflow-hidden rounded-2xl border border-border/40 shadow-sm" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  priority
                  unoptimized={!isOptimizable(post.cover_image)}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            )}

            <AdSenseAd slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? ""} className="mb-10" />

            <div className="lg:hidden mb-8">
              <TableOfContents />
            </div>

            <article className="prose prose-base max-w-none
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg
              prose-code:text-primary prose-code:bg-primary/10 prose-code:rounded prose-code:px-1 prose-code:text-sm
              prose-pre:bg-card prose-pre:border prose-pre:border-border
              prose-li:text-muted-foreground
              prose-hr:border-border">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ src, alt }) => (
                    <span className="block relative w-full my-8 overflow-hidden rounded-xl shadow-sm border border-border/40" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={String(src ?? "")}
                        alt={String(alt || post.title || "Blog post image")}
                        fill
                        unoptimized={!isOptimizable(typeof src === "string" ? src : undefined)}
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </span>
                  ),
                  pre: ({ children }) => (
                    <CopyCodeButton>{children}</CopyCodeButton>
                  ),
                  a: ({ href, children }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-primary hover:underline font-medium transition-colors"
                      >
                        {children}
                      </a>
                    );
                  },
                  h1: ({ children }) => (
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-4 pb-2 border-b border-border/40">{children}</h2>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-12 mb-4 pb-2 border-b border-border/40">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-serif text-xl font-bold text-foreground mt-8 mb-3">{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary bg-primary/5 pl-5 pr-4 py-3 rounded-r-xl my-6 italic text-foreground/80 not-italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Keywords */}
            {post.seo_keywords?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-border/40">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest self-center mr-1">Topics:</span>
                {post.seo_keywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground border border-border/40">{kw}</span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-10 rounded-xl border border-border bg-card p-5">
              <p className="mb-3 text-sm font-semibold text-foreground">Share this article</p>
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Author */}
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-serif text-base font-bold text-primary">T</div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Written by</p>
                  <h3 className="mt-0.5 font-serif text-base font-bold text-foreground">{SITE_NAME} Editorial</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    AI-powered editorial delivering high-signal analysis on technology, AI, and digital trends — updated every 6 hours.
                  </p>
                  <Link href="/" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Browse all articles
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Related */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">Related Articles</h2>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all hover:-translate-y-0.5">
                      {rp.cover_image && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={rp.cover_image} alt={rp.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="33vw" />
                        </div>
                      )}
                      <div className="p-3 flex flex-col gap-1">
                        {rp.categories?.[0] && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{rp.categories[0].name}</span>
                        )}
                        <h3 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{rp.title}</h3>
                        <p className="text-[11px] text-muted-foreground">
                          {rp.published_at ? new Date(rp.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <CommentsSection slug={post.slug} initialComments={comments ?? []} />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 sticky top-24">
            <TableOfContents />
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest">Article Info</p>
              {[
                { label: "Read time", value: `${readTime} min` },
                { label: "Words", value: wordCount.toLocaleString() },
                { label: "Published", value: dateStr },
                { label: "Category", value: category?.name ?? "General" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground text-right max-w-[120px] truncate">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Share</p>
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </aside>
        </div>
      </main>

      <ReadNextBar post={relatedPosts[0] ?? null} />
      <BackToTop />
    </div>
  );
}
