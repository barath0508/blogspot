import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

function toPollinationsUrl(title: string, slug: string): string {
  const prompt = `Professional editorial photo for article titled "${title}", cinematic lighting, magazine cover style, no text, no watermark`;
  const seed = parseInt(slug.replace(/[^0-9]/g, "").slice(0, 6) || "42", 10);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1600&height=900&seed=${seed}&nologo=true`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();

  // Fetch all posts with broken image URLs
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, cover_image, content")
    .or("cover_image.ilike.%source.unsplash.com%,cover_image.ilike.%loremflickr.com%,cover_image.is.null");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!posts?.length) return NextResponse.json({ updated: 0, message: "No broken images found" });

  let updated = 0;

  for (const post of posts) {
    const newCoverImage = toPollinationsUrl(post.title, post.slug);

    // Also fix broken images inside content
    const newContent = (post.content ?? "")
      .replace(
        /!\[([^\]]*)\]\(https:\/\/source\.unsplash\.com[^)]+\)/g,
        (_, alt) => {
          const phrase = alt || post.title;
          const seed = Math.floor(Math.random() * 99999);
          const prompt = `Editorial illustration for "${phrase}", professional photography, cinematic, no text`;
          return `![${alt}](https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&seed=${seed}&nologo=true)`;
        }
      )
      .replace(
        /!\[([^\]]*)\]\(https:\/\/loremflickr\.com[^)]+\)/g,
        (_, alt) => {
          const seed = Math.floor(Math.random() * 99999);
          const prompt = `Editorial illustration for "${alt || post.title}", professional photography, cinematic, no text`;
          return `![${alt}](https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&seed=${seed}&nologo=true)`;
        }
      );

    await supabase
      .from("posts")
      .update({ cover_image: newCoverImage, content: newContent })
      .eq("id", post.id);

    updated++;
  }

  return NextResponse.json({ updated, message: `Fixed ${updated} posts` });
}
