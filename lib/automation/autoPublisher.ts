import { getSupabaseAdmin } from "@/lib/supabase";
import { pingSearchEngines, pingIndexNow } from "@/lib/seo";

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
  const defaultModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-pro"];
  const modelsToTry = configuredModel
    ? [configuredModel, ...defaultModels.filter(m => m !== configuredModel)]
    : defaultModels;

  const prompt = `
You are a world-class digital journalist and content strategist known for writing viral, high-click-rate articles. Your goal is to produce content that grabs attention instantly, keeps readers hooked, and ranks on Google. Return only valid JSON with this exact shape:
{
  "title": "string",
  "excerpt": "string (max 180 chars)",
  "content": "markdown string with H2 sections, intro and conclusion",
  "metaTitle": "string, max 60 chars",
  "metaDescription": "string, max 160 chars",
  "seoKeywords": ["string","string","string","string","string"],
  "category": "string",
  "tags": ["string","string","string"],
  "imagePhrases": ["vivid visual description for section 1 image","vivid visual description for section 2 image","vivid visual description for section 3 image"],
  "coverImageKeyword": "single best visual description for the article cover image"
}

Topic: "${topic}"

Title Rules (CRITICAL for click-through rate):
- Use power words: "Shocking", "Secret", "Finally", "This Changes Everything", "Nobody Talks About", "Here's Why", "The Truth About", "Everything You Need To Know", "Revealed", "The Real Reason", "You Won't Believe", etc.
- Use curiosity gaps, numbers, or strong emotional hooks (e.g., "7 Reasons...", "The Hidden Truth About...", "Why Experts Are Saying...").
- Title must be compelling enough to make someone stop scrolling and click.
- Keep title under 65 characters but make every word count.

Content Rules:
- Open with a powerful hook — a shocking stat, bold claim, or provocative question in the first 2 sentences.
- Write a comprehensive, engaging, and highly informative article directly about the topic.
- Do not artificially force a technology pivot if the topic is non-technical (e.g., sports, politics, entertainment, lifestyle). Cover the subject naturally.
- MUST write the entire post exclusively in English, regardless of the origin or topic.
- Excerpt under 180 characters — make it intriguing so readers MUST click to find out more.
- Meta title under 60 characters. Meta description under 160 characters — optimized for Google CTR.
- Content should be 800-1200 words with 3-4 H2 sections. Each H2 should be equally gripping.
- Include expert insights, surprising facts, actionable takeaways, and recent context.
- End with a strong, memorable conclusion that leaves readers thinking.

imagePhrases Rules:
- Each imagePhrases entry must be a vivid, specific visual description (5-10 words) that directly relates to that section's content.
- Examples: "scientist analyzing glowing DNA strands in dark lab", "crowded stock market trading floor with screens", "futuristic robot hand shaking human hand"
- coverImageKeyword must be a vivid 5-8 word visual description of the article's main subject.
- Make every image description cinematic, specific, and emotionally evocative.
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
      .slice(0, 4),
    coverImageKeyword: String((parsed as any).coverImageKeyword || parsed.category || "technology").trim()
  } as GeneratedPost & { coverImageKeyword: string };
}

function generateCoverImageUrl(title: string, category: string, keywords: string[]): string {
  const kw = keywords.slice(0, 3).join(", ");
  const prompt = [
    `Professional editorial photo for article titled "${title}"`,
    `Category: ${category}`,
    kw ? `Keywords: ${kw}` : "",
    "Ultra high quality, cinematic lighting, sharp focus, magazine cover style",
    "No text, no watermark, no logos"
  ].filter(Boolean).join(". ");
  const seed = Date.now() % 99999;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1600&height=900&seed=${seed}&nologo=true&enhance=true`;
}

function generateSectionImageUrl(phrase: string, title: string): string {
  const prompt = [
    `Editorial illustration for section about "${phrase}"`,
    `Part of article: "${title}"`,
    "Professional photography, vibrant colors, high detail, cinematic",
    "No text, no watermark"
  ].join(". ");
  const seed = Math.floor(Math.random() * 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&seed=${seed}&nologo=true&enhance=true`;
}

function injectSectionImages(content: string, imagePhrases: string[], title: string): string {
  if (!imagePhrases.length) return content;
  let phraseIndex = 0;
  return content.replace(/^(## .+)$/gm, (heading) => {
    if (phraseIndex >= imagePhrases.length) return heading;
    const phrase = imagePhrases[phraseIndex++];
    const imageUrl = generateSectionImageUrl(phrase, title);
    return `${heading}\n\n![${phrase}](${imageUrl})\n`;
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

export async function publishSpecificTopic(topic: string) {
  const post = await generatePostWithGemini(topic);
  const supabaseAdmin = getSupabaseAdmin();

  const baseSlug = slugify(post.title) || slugify(topic) || "trending-topic";
  const daySuffix = new Date().toISOString().slice(0, 10);
  const slug = `${baseSlug}-${daySuffix}`;

  const { data: existing } = await supabaseAdmin.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    return { status: "skipped", reason: "already_published", topic, slug };
  }

  const coverImage = generateCoverImageUrl(post.title, post.category, post.seoKeywords);
  const contentWithSectionImages = injectSectionImages(post.content, post.imagePhrases, post.title);
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
  pingIndexNow(slug);
  return { status: "published", topic, slug, postId: created.id };
}

export async function publishTrendingPost() {
  const topic = await fetchTrendingTopic();
  return publishSpecificTopic(topic);
}
