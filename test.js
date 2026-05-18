require('dotenv').config({path: '.env.local'});
const prompt = `You are a world-class digital journalist and content strategist known for writing viral, high-click-rate articles. Your goal is to produce content that grabs attention instantly, keeps readers hooked, and ranks on Google. Return only valid JSON with this exact shape: { "title": "string", "excerpt": "string (max 180 chars)", "content": "markdown string with H2 sections, intro and conclusion", "metaTitle": "string, max 60 chars", "metaDescription": "string, max 160 chars", "seoKeywords": ["string","string","string","string","string"], "category": "string", "tags": ["string","string","string"], "imagePhrases": ["vivid visual description for section 1 image","vivid visual description for section 2 image","vivid visual description for section 3 image"], "coverImageKeyword": "single best visual description for the article cover image" } Topic: "Gen Z digital detox" - Do not include code fences around JSON.`;
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY).split(',')[0], {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({
    contents: [{role: 'user', parts: [{text: prompt}]}],
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json' }
  })
}).then(async r => console.log(r.status, await r.text()))
