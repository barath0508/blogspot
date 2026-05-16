import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PostRecord } from "@/types/blog";

type Props = { post: PostRecord; index?: number; featured?: boolean };

function readTime(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function isNew(publishedAt: string | null) {
  if (!publishedAt) return false;
  return Date.now() - new Date(publishedAt).getTime() < 12 * 60 * 60 * 1000;
}

function FeaturedCard({ post }: { post: PostRecord }) {
  const time = readTime(post.content ?? post.excerpt ?? "");
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Draft";
  const category = post.categories?.[0];
  const fresh = isNew(post.published_at ?? null);

  return (
    <article className="group relative overflow-hidden rounded-lg border border-border/40 bg-card transition-all hover:border-primary/40">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
            {post.cover_image ? (
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                unoptimized
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                <span className="font-serif text-4xl font-bold text-muted-foreground/30">ID</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent lg:hidden" />
            {fresh && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
                </span>
                Just published
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 lg:p-10">
            <div className="mb-4 flex items-center gap-3">
              {category && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {category.name}
                </span>
              )}
              <span className="text-xs text-muted-foreground">Featured</span>
            </div>

            <h2 className="mb-4 font-serif text-2xl font-bold leading-tight text-foreground lg:text-3xl">
              <span className="text-balance">{post.title}</span>
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground lg:text-base">
              <span className="text-pretty line-clamp-3">{post.excerpt}</span>
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-serif text-xs font-bold text-primary">
                  ID
                </div>
                <div className="text-xs">
                  <p className="font-medium text-foreground">Insight Daily</p>
                  <p className="text-muted-foreground">{dateStr} · {time} min read</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function GridCard({ post, index = 0 }: { post: PostRecord; index?: number }) {
  const time = readTime(post.content ?? post.excerpt ?? "");
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Draft";
  const isoDate = post.published_at ?? post.created_at;
  const category = post.categories?.[0];
  const fresh = isNew(post.published_at ?? null);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-border/40 bg-card transition-all hover:border-primary/40 animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 250)}ms` }}
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              unoptimized
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary flex items-center justify-center">
              <span className="font-serif text-3xl font-bold text-muted-foreground/30">ID</span>
            </div>
          )}
          {fresh && (
            <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2">
            {category && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {category.name}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{time} min read</span>
          </div>

          <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            <span className="text-balance line-clamp-2">{post.title}</span>
          </h3>

          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
            <span className="line-clamp-2 text-pretty">{post.excerpt}</span>
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-border/40">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-serif text-[10px] font-bold text-primary">
              ID
            </div>
            <div className="text-xs">
              <span className="font-medium text-foreground">Insight Daily</span>
              <span className="text-muted-foreground"> · </span>
              <time dateTime={isoDate} className="text-muted-foreground">{dateStr}</time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PostCard({ post, index = 0, featured = false }: Props) {
  if (featured) return <FeaturedCard post={post} />;
  return <GridCard post={post} index={index} />;
}
