import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentsSection } from "@/components/CommentsSection";
import { LikeButton } from "@/components/LikeButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { PostCard } from "@/components/PostCard";
import { TableOfContents } from "@/components/TableOfContents";
import { BackToTop } from "@/components/BackToTop";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Insight Daily";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
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
    title, description, keywords,
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
      site: "@insightdaily", creator: "@insightdaily",
      images: image ? [{ url: image, alt: title }] : [`${SITE_URL}/og-default.png`]
    }
  };
}

function getCategoryClass(slug?: string): string { return slug ?? ""; }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();

  const supabase = getSupabase();
  const firstTag = post.tags?.[0]?.slug;

  const [{ data: comments }, { count }, relatedAll] = await Promise.all([
    supabase.from("comments").select("id,author_name,body,created_at")
      .eq("post_id", post.id).eq("is_approved", true).order("created_at", { ascending: false }),
    supabase.from("post_likes").select("id", { head: true, count: "exact" }).eq("post_id", post.id),
    firstTag ? getPublishedPosts({ tag: firstTag }) : getPublishedPosts()
  ]);

  const relatedPosts = (relatedAll ?? []).filter((p) => p.slug !== post.slug).slice(0, 3);
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
        image: post.cover_image ? { "@type": "ImageObject", "@id": `${postUrl}/#primaryimage`, url: post.cover_image, width: 1600, height: 900, caption: post.title } : undefined,
        thumbnailUrl: post.cover_image ?? undefined,
        keywords: post.seo_keywords.join(", "),
        about: post.seo_keywords.slice(0, 5).map((k) => ({ "@type": "Thing", name: k })),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".prose h2", ".prose p:first-of-type"] },
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 } }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/?category=${category.slug}` }] : []),
          { "@type": "ListItem", position: category ? 3 : 2, name: post.title, item: postUrl }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Breadcrumb */}
      <div className="border-b border-border/40">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to all articles
            </Link>
            {category && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/?category=${category.slug}`} className="hover:text-foreground transition-colors">{category.name}</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <main className="py-8 lg:py-12">
        <article className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              {category && (
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {category.name}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-foreground lg:text-4xl xl:text-5xl">
              <span className="text-balance">{post.title}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                  ID
                </div>
                <div>
                  <p className="font-medium text-foreground">{SITE_NAME} Editorial</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={isoDate}>{dateStr}</time>
                    <span>·</span>
                    <span>{readTime} min read</span>
                    <span>·</span>
                    <span>{wordCount.toLocaleString()} words</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <LikeButton slug={post.slug} initialLikes={count ?? 0} />
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.cover_image && (
            <div className="relative mb-10 aspect-video overflow-hidden rounded-xl">
              <Image src={post.cover_image} alt={post.title} fill unoptimized className="object-cover" priority sizes="(max-width: 1024px) 100vw, 900px" />
            </div>
          )}

          {/* Content */}
          <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-14 xl:gap-20 items-start">
            <div>
              <section className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => (
                      <span className="block relative w-full my-10" style={{ aspectRatio: "16/9" }}>
                        <Image src={String(src ?? "")} alt={String(alt ?? "")} fill unoptimized className="rounded-xl object-cover" loading="lazy" sizes="(max-width: 1024px) 100vw, 800px" />
                      </span>
                    ),
                    h2: ({ children }) => <h2 className="font-serif text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-serif text-xl font-bold text-foreground mt-8 mb-3">{children}</h3>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </section>

              {/* Tags */}
              {post.seo_keywords?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-border/40">
                  {post.seo_keywords.map((kw) => (
                    <span key={kw} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{kw}</span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-10 border-t border-border/40 pt-8">
                <p className="mb-4 text-sm font-medium text-foreground">Share this article</p>
                <ShareButtons url={postUrl} title={post.title} />
              </div>

              {/* Author card */}
              <div className="mt-12 rounded-xl border border-border bg-card p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-xl font-bold text-primary">
                    ID
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Written by</p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-foreground">{SITE_NAME} Editorial</h3>
                    <p className="mt-2 text-muted-foreground text-sm">Our editorial team leverages advanced AI and expert domain knowledge to deliver high-signal technical analysis on technology, AI, and digital trends.</p>
                    <Link href="/" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      View all articles
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related */}
              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Related Articles</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.slug} href={`/blog/${rp.slug}`}
                        className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
                        <span className="text-xs font-medium text-primary">{rp.categories?.[0]?.name}</span>
                        <h3 className="mt-2 font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">{rp.title}</h3>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {rp.published_at ? new Date(rp.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <CommentsSection slug={post.slug} initialComments={comments ?? []} />
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block sticky top-24">
              <TableOfContents />
            </aside>
          </div>
        </article>
      </main>

      <BackToTop />
    </div>
  );
}
