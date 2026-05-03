import { getSupabaseAdmin } from "@/lib/supabase";
import { pingSearchEngines } from "@/lib/seo";

type GeneratedPost = {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  category: string;
  tags: string[];
  imagePhrases: string[];
};

const ALLOWED_FETCH_HOSTS = new Set([
  "trends.google.com",
  "generativelanguage.googleapis.com",
]);

function assertAllowedUrl(url: string) {
  const { hostname } = new URL(url);
  if (!ALLOWED_FETCH_HOSTS.has(hostname)) {
    throw new Error(`Blocked SSRF attempt to disallowed host: ${hostname}`);
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeXmlEntities(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchTrendingTopic() {
  const geo = process.env.TRENDS_GEO || "US";
  const url = `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`;
  assertAllowedUrl(url);
  const response = await fetch(url, {
    next: { revalidate: 900 }
  });

  if (!response.ok) throw new Error("Unable to fetch trending topics");
  const xml = await response.text();

  const itemMatches = [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>/g)];
  const titles = itemMatches
    .map((m) => decodeXmlEntities((m[1] || "").trim()))
    .filter((t) => t && !/^daily search trends$/i.test(t));

  if (!titles.length) throw new Error("No trending topics found");
  return titles[0];
}

function extractAndRepairJson(raw: string): unknown {
  // 1. Strip markdown code fences
  let text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // 2. Remove ASCII control characters except tab (\x09), LF (\x0A), CR (\x0D)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 3. Try direct parse first
  try { return JSON.parse(text); } catch { /* fall through */ }

  // 4. Extract outermost { ... } block
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    text = text.slice(start, end + 1);
    try { return JSON.parse(text); } catch { /* fall through */ }
  }

  // 5. Surgically escape bare newlines / carriage returns inside JSON string values
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === "\\") { result += ch; escaped = true; continue; }
    if (ch === '"') { inString = !inString; result += ch; continue; }
    if (inString) {
      if (ch === "\n") { result += "\\n"; continue; }
      if (ch === "\r") { result += "\\r"; continue; }
      if (ch === "\t") { result += "\\t"; continue; }
    }
    result += ch;
  }

  return JSON.parse(result);
}

async function generatePostWithGemini(topic: string): Promise<GeneratedPost> {
  const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);
  if (!apiKeys.length) throw new Error("No Gemini API keys found in environment.");
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelsToTry = configuredModel
    ? [configuredModel, "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"]
    : ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"];

  const prompt = `
You are an expert technology journalist writing an SEO blog post. Return only valid JSON with this exact shape:
{
  "title": "string",
  "excerpt": "string (max 180 chars)",
  "content": "markdown string with H2 sections, intro and conclusion",
  "metaTitle": "string, max 60 chars",
  "metaDescription": "string, max 160 chars",
  "seoKeywords": ["string","string","string","string","string"],
  "category": "string",
  "tags": ["string","string","string"],
  "imagePhrases": ["short visual description for section 1","short visual description for section 2","short visual description for section 3"]
}

Topic: "${topic}"
Constraints:
- MUST focus entirely on technical news, software development, artificial intelligence, or enterprise technology.
- If the topic is non-technical (e.g., sports, politics, entertainment), you MUST pivot the article to focus exclusively on the technology behind it (e.g., data analytics, broadcasting tech, AI algorithms, software infrastructure).
- MUST write the entire post exclusively in English, regardless of the origin or topic.
- Keep title under 65 characters.
- Excerpt under 180 characters.
- Meta title under 60 characters.
- Meta description under 160 characters.
- Content should be 700-1100 words with 3-4 H2 sections.
- Include practical tech insights, frameworks, or recent context.
- imagePhrases: one short descriptive tech-focused phrase per H2 section (max 10 words each), suitable for an image search.
- Do not include code fences around JSON.
`;

  let text = "";
  let lastError = "";

  outer: for (const model of modelsToTry) {
    for (const apiKey of apiKeys) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      assertAllowedUrl(geminiUrl);
      const response = await fetch(
        geminiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        lastError = await response.text();
        const isKeyError = response.status === 429 || response.status === 403 || lastError.includes("API_KEY_INVALID") || lastError.includes("API key expired");
        
        if (isKeyError) {
          // Rate limit / Quota exceeded / Expired Key -> try the next key
          console.warn(`[AutoPublisher] Key error (${response.status}) on model ${model}. Trying next key...`);
          continue;
        }
        // Other errors (e.g., 400 Bad Request, 500) -> likely model or prompt issue, try next model
        break;
      }

      const data = await response.json();
      text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) break outer;
    }
  }

  if (!text) {
    const tried = modelsToTry.join(", ");
    throw new Error(`Gemini failed across models [${tried}] and ${apiKeys.length} key(s). Last error: ${lastError}`);
  }

  const parsed = extractAndRepairJson(text) as GeneratedPost;
  if (!parsed.title || !parsed.content || !parsed.excerpt) {
    throw new Error("Gemini returned invalid post payload");
  }

  return {
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim(),
    content: parsed.content.trim(),
    metaTitle: String((parsed as any).metaTitle || parsed.title).trim(),
    metaDescription: String((parsed as any).metaDescription || parsed.excerpt).trim(),
    seoKeywords: ((parsed as any).seoKeywords || parsed.tags || [])
      .map((k: string) => String(k).trim())
      .filter(Boolean)
      .slice(0, 10),
    category: (parsed.category || "Trending").trim(),
    tags: (parsed.tags || ["trending"]).slice(0, 5).map((t) => String(t).trim()).filter(Boolean),
    imagePhrases: ((parsed as any).imagePhrases || [])
      .map((p: string) => String(p).trim())
      .filter(Boolean)
      .slice(0, 4)
  };
}

function generateImageUrl(phrase: string, width = 1600, height = 900) {
  const prompt = `High quality editorial blog image about ${phrase}, minimalist, clean, modern, no text`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`;
}

function injectSectionImages(content: string, imagePhrases: string[]): string {
  if (!imagePhrases.length) return content;
  let phraseIndex = 0;
  return content.replace(/^(## .+)$/gm, (heading) => {
    if (phraseIndex >= imagePhrases.length) return heading;
    const imageUrl = generateImageUrl(imagePhrases[phraseIndex++], 1200, 630);
    const altText = imagePhrases[phraseIndex - 1];
    return `${heading}\n\n![${altText}](${imageUrl})\n`;
  });
}

async function upsertCategoryAndTags(categoryName: string, tagNames: string[]) {
  const supabaseAdmin = getSupabaseAdmin();
  const categorySlug = slugify(categoryName);

  const { data: category, error: categoryError } = await supabaseAdmin
    .from("categories")
    .upsert([{ name: categoryName, slug: categorySlug }], { onConflict: "slug" })
    .select("id")
    .single();
  if (categoryError) throw categoryError;

  const tagRows = tagNames.map((tag) => ({ name: tag, slug: slugify(tag) }));
  if (tagRows.length) {
    await supabaseAdmin.from("tags").upsert(tagRows, { onConflict: "slug" });
  }

  const { data: tags } = await supabaseAdmin
    .from("tags")
    .select("id,slug")
    .in(
      "slug",
      tagRows.map((tag) => tag.slug)
    );

  return { categoryId: category.id as string, tagIds: (tags ?? []).map((t: { id: string }) => t.id as string) };
}

async function appendInternalLinks(content: string, currentTopic: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: relatedPosts } = await supabaseAdmin
    .from("posts")
    .select("title,slug")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  const links = (relatedPosts ?? [])
    .filter((post: { slug: string }) => Boolean(post.slug))
    .map((post: { title: string; slug: string }) => `- [${post.title}](/blog/${post.slug})`);

  if (!links.length) return content;

  return `${content}

## Related Reading

If you are exploring **${currentTopic}**, these posts might help:
${links.join("\n")}
`;
}

export async function publishTrendingPost() {
  const topic = await fetchTrendingTopic();
  const post = await generatePostWithGemini(topic);
  const supabaseAdmin = getSupabaseAdmin();

  const baseSlug = slugify(post.title) || slugify(topic) || "trending-topic";
  const daySuffix = new Date().toISOString().slice(0, 10);
  const slug = `${baseSlug}-${daySuffix}`;

  const { data: existing } = await supabaseAdmin.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    return { status: "skipped", reason: "already_published", topic, slug };
  }

  const coverImage = generateImageUrl(topic);
  const contentWithSectionImages = injectSectionImages(post.content, post.imagePhrases);
  const contentWithLinks = await appendInternalLinks(contentWithSectionImages, topic);
  const { data: created, error } = await supabaseAdmin
    .from("posts")
    .insert([
      {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        content: contentWithLinks,
        meta_title: post.metaTitle.slice(0, 60),
        meta_description: post.metaDescription.slice(0, 160),
        seo_keywords: post.seoKeywords,
        cover_image: coverImage,
        is_published: true,
        published_at: new Date().toISOString()
      }
    ])
    .select("id")
    .single();

  if (error) throw error;

  const { categoryId, tagIds } = await upsertCategoryAndTags(post.category, post.tags);
  await supabaseAdmin.from("post_categories").upsert([{ post_id: created.id, category_id: categoryId }], {
    onConflict: "post_id,category_id"
  });

  if (tagIds.length) {
    await supabaseAdmin.from("post_tags").upsert(
      tagIds.map((tagId: string) => ({ post_id: created.id, tag_id: tagId })),
      { onConflict: "post_id,tag_id" }
    );
  }

  pingSearchEngines();
  return { status: "published", topic, slug, postId: created.id };
}
