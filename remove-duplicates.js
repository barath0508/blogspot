const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing Env variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

function getTrigrams(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const trigrams = {};
  for (let i = 0; i < clean.length - 2; i++) {
    const trigram = clean.substring(i, i + 3);
    trigrams[trigram] = (trigrams[trigram] || 0) + 1;
  }
  return trigrams;
}

function cosineSimilarity(strA, strB) {
  const vecA = getTrigrams(strA);
  const vecB = getTrigrams(strB);

  const keysA = Object.keys(vecA);
  const keysB = Object.keys(vecB);
  
  if (keysA.length === 0 || keysB.length === 0) return 0;

  let dotProduct = 0;
  for (const key of keysA) {
    if (vecB[key]) {
      dotProduct += vecA[key] * vecB[key];
    }
  }

  let magA = 0;
  for (const val of Object.values(vecA)) {
    magA += val * val;
  }
  magA = Math.sqrt(magA);

  let magB = 0;
  for (const val of Object.values(vecB)) {
    magB += val * val;
  }
  magB = Math.sqrt(magB);

  return dotProduct / (magA * magB);
}

async function run() {
  console.log("Fetching all posts...");
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, published_at, created_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  console.log(`Fetched ${posts.length} posts.`);

  const duplicates = [];
  const visited = new Set();

  for (let i = 0; i < posts.length; i++) {
    const postA = posts[i];
    if (visited.has(postA.id)) continue;

    for (let j = i + 1; j < posts.length; j++) {
      const postB = posts[j];
      if (visited.has(postB.id)) continue;

      const titleSim = cosineSimilarity(postA.title, postB.title);
      const cleanSlugA = postA.slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
      const cleanSlugB = postB.slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
      const slugSim = cosineSimilarity(cleanSlugA, cleanSlugB);

      if (titleSim > 0.85 || slugSim > 0.85) {
        console.log(`Found duplicate posts:`);
        console.log(`- Post A: "${postA.title}" (${postA.slug}) published at ${postA.published_at}`);
        console.log(`- Post B: "${postB.title}" (${postB.slug}) published at ${postB.published_at}`);
        console.log(`  Similarity - Title: ${titleSim.toFixed(2)}, Slug: ${slugSim.toFixed(2)}`);
        
        // We will keep postA (newer, since it is ordered descending) and delete postB (older)
        duplicates.push(postB);
        visited.add(postB.id);
      }
    }
  }

  if (duplicates.length === 0) {
    console.log("No duplicate posts found.");
    return;
  }

  console.log(`Found ${duplicates.length} duplicate posts to delete.`);
  for (const dupe of duplicates) {
    console.log(`Deleting duplicate post: "${dupe.title}" (${dupe.slug}) ID: ${dupe.id}...`);
    const { error: delError } = await supabase
      .from("posts")
      .delete()
      .eq("id", dupe.id);

    if (delError) {
      console.error(`Error deleting post ${dupe.id}:`, delError);
    } else {
      console.log(`Successfully deleted.`);
    }
  }
}

run();
