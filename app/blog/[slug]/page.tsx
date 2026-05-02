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
const SITE_NAME = "Tech & Trends";

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
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.seo_keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      tags: post.seo_keywords,
      images: image ? [{ url: image, alt: post.title, width: 1600, height: 900 }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: image ? [image] : undefined
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();

  const supabase = getSupabase();

  // Fetch comments, likes, and related posts simultaneously
  const firstTag = post.tags?.[0]?.slug;
  const [{ data: comments }, { count }, relatedAll] = await Promise.all([
    supabase
      .from("comments")
      .select("id,author_name,body,created_at")
      .eq("post_id", post.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
    supabase.from("post_likes").select("id", { head: true, count: "exact" }).eq("post_id", post.id),
    firstTag ? getPublishedPosts({ tag: firstTag }) : getPublishedPosts()
  ]);

  const relatedPosts = (relatedAll ?? [])
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const wordCount = (post.content ?? "").trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Draft";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image ? {
      "@type": "ImageObject",
      url: post.cover_image,
      width: 1600,
      height: 900
    } : undefined,
    url: postUrl,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    keywords: post.seo_keywords.join(", "),
    wordCount,
    timeRequired: `PT${readTime}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: post.title, item: postUrl }
    ]
  };

  return (
    <div className="animate-fade-up">
      <ReadingProgress />

      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-purple-600 transition-colors font-medium flex items-center gap-1.5 group">
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1 font-medium">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_280px] lg:gap-16 xl:gap-24 items-start">
        <article className="w-full min-w-0">
          <header className="mb-8 space-y-5">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/?tag=${tag.slug}`}
                  className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 border-t border-b border-gray-100 py-3 text-sm text-gray-400">
            <time className="font-medium text-gray-600" dateTime={post.published_at ?? post.created_at}>
              {dateStr}
            </time>
            <span>·</span>
            <span>{readTime} min read</span>
            <span>·</span>
            <span>{wordCount.toLocaleString()} words</span>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100 shadow-sm relative aspect-video">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <section className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <span className="block relative w-full aspect-video my-6">
                  <Image
                    src={src ?? ""}
                    alt={alt ?? ""}
                    fill
                    unoptimized
                    className="rounded-2xl object-cover border border-gray-100 shadow-sm"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </span>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </section>

        {/* ── Share + Actions ── */}
        <div className="mt-10 flex flex-col gap-6 border-t border-gray-100 pt-8">
          <ShareButtons url={postUrl} title={post.title} />
          <div className="flex items-center gap-4">
            <LikeButton slug={post.slug} initialLikes={count ?? 0} />
            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← More articles
            </Link>
          </div>
        </div>

        {/* ── Related Posts ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-14" aria-label="Related articles">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Articles</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp, i) => (
                <PostCard key={rp.id} post={rp} index={i} />
              ))}
            </div>
          </section>
        )}

          <CommentsSection slug={post.slug} initialComments={comments ?? []} />
        </article>

        {/* Right Sidebar (Table of Contents) */}
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
      </div>

      <BackToTop />
    </div>
  );
}
