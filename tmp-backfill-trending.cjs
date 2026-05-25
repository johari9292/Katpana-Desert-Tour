const fs = require("fs");
const { Client } = require("pg");

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function poolerUrlFromDirectUrl(directUrl) {
  const url = new URL(directUrl);
  const projectRef = url.hostname.match(/^db\.([^.]+)\.supabase\.co$/)?.[1];
  if (!projectRef) return directUrl;
  url.hostname = "aws-1-ap-northeast-1.pooler.supabase.com";
  url.port = "6543";
  url.username = `postgres.${projectRef}`;
  return url.toString();
}

function slugify(value) {
  return (
    (value || "pakistan-travel-trend")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "pakistan-travel-trend"
  );
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeXml(value) {
  return String(value || "")
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function readXmlTag(block, tagName) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match ? decodeXml(match[1].trim()) : null;
}

async function fetchTrends() {
  const urls = [
    "https://trends.google.com/trending/rss?geo=PK",
    "https://trends.google.com/trends/trendingsearches/daily/rss?geo=PK",
  ];
  let fallbackReason = "Google Trends RSS returned no usable items.";

  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Katapana Desert Tour trend backfill" } });
      if (!response.ok) {
        fallbackReason = `Google Trends RSS request failed with ${response.status}.`;
        continue;
      }
      const xml = await response.text();
      const trends = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)]
        .slice(0, 20)
        .map((match, index) => {
          const block = match[0];
          return {
            rank: index + 1,
            title: readXmlTag(block, "title") || "",
            link: readXmlTag(block, "link"),
            approxTraffic: readXmlTag(block, "ht:approx_traffic") || readXmlTag(block, "approx_traffic"),
            description: stripTags(readXmlTag(block, "description") || ""),
          };
        })
        .filter((trend) => trend.title);
      if (trends.length) return { trends, fallbackReason: null };
      fallbackReason = "Google Trends RSS had no item entries.";
    } catch (error) {
      fallbackReason = error instanceof Error ? error.message : "Google Trends RSS request failed.";
    }
  }

  return { trends: [], fallbackReason };
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength).trim() : "";
}

function parseModelJson(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Gemini response did not contain JSON.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function normalize(value, trends, fallbackReason) {
  const usedFallback = value.usedFallback === true || trends.length === 0;
  const trendRank = usedFallback ? null : Number.isFinite(value.trendRank) ? value.trendRank : null;
  const matchedTrend = trendRank ? trends.find((trend) => trend.rank === trendRank) : null;
  const title = cleanText(value.title, 120);
  const excerpt = cleanText(value.excerpt, 320);
  const sections = Array.isArray(value.sections)
    ? value.sections
        .map((item) => ({ heading: cleanText(item?.heading, 100), body: cleanText(item?.body, 1600) }))
        .filter((item) => item.heading && item.body)
        .slice(0, 6)
    : [];
  const faqs = Array.isArray(value.faqs)
    ? value.faqs
        .map((item) => ({ question: cleanText(item?.question, 180), answer: cleanText(item?.answer, 700) }))
        .filter((item) => item.question && item.answer)
        .slice(0, 3)
    : [];
  const keywords = Array.isArray(value.keywords)
    ? value.keywords.map((item) => cleanText(item, 60)).filter(Boolean).slice(0, 10)
    : [];

  if (!title || !excerpt || sections.length < 3) throw new Error("Generated article missing required fields.");

  return {
    title,
    excerpt,
    sections,
    faqs,
    keywords: keywords.length ? keywords : ["Skardu travel", "Pakistan travel trends", "Katpana Desert Tour"],
    trendTopic: usedFallback
      ? cleanText(value.trendTopic, 140) || "Northern Pakistan travel planning"
      : matchedTrend?.title || cleanText(value.trendTopic, 140) || "Pakistan travel trend",
    trendRank: usedFallback ? null : matchedTrend?.rank || trendRank,
    trendSourceUrl: usedFallback ? null : matchedTrend?.link || cleanText(value.trendSourceUrl, 500) || null,
    usedFallback,
  };
}

async function generateWithGemini({ apiKey, model, generationDate, trends, fallbackReason }) {
  const prompt = `You write original SEO travel content for Katpana Desert Tour, a Skardu and northern Pakistan tourism website.

Generation date: ${generationDate}
Trend source: Google Trends Pakistan RSS.
Trend fetch note: ${fallbackReason || "RSS trends were available."}
Available Pakistan trends:
${JSON.stringify(trends.slice(0, 20), null, 2)}

Choose the best safe trend that can naturally connect to Skardu, Gilgit Baltistan, northern Pakistan, mountain tourism, cultural travel, seasonal planning, family travel, trekking, deserts, lakes, or road trips. If no trend is safe or travel-adjacent, create a safe evergreen northern Pakistan travel fallback article. Do not write general news. Make the content original.

Return only JSON with this exact shape: {"title":"SEO-friendly article title","excerpt":"2 sentence summary under 320 characters","trendTopic":"selected trend title or fallback topic","trendRank":1,"trendSourceUrl":"selected trend link or null","sections":[{"heading":"Short section heading","body":"120 to 180 words of useful travel content"}],"faqs":[{"question":"Traveler question","answer":"Helpful answer"}],"keywords":["Skardu travel","Pakistan travel trends"],"usedFallback":false,"fallbackReason":null}. Rules: sections 4 to 6, faqs exactly 3, keywords 6 to 10, trendRank null and trendSourceUrl null when usedFallback is true.`;
  const models = [...new Set([model, "gemini-2.0-flash", "gemini-1.5-flash"])];
  let lastError = "";

  for (const candidateModel of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidateModel)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
        }),
      },
    );

    if (!response.ok) {
      lastError = `Gemini ${candidateModel} failed with ${response.status}: ${(await response.text()).slice(0, 300)}`;
      if ([429, 500, 503, 504].includes(response.status)) continue;
      throw new Error(lastError);
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!text) {
      lastError = `Gemini ${candidateModel} returned no text.`;
      continue;
    }
    return normalize(parseModelJson(text), trends, fallbackReason);
  }

  throw new Error(lastError || "Gemini failed for all fallback models.");
}

async function uniqueSlug(db, preferred) {
  let candidate = preferred;
  for (let index = 1; index <= 10; index += 1) {
    const result = await db.query("select slug from public.trending_articles where slug = $1 limit 1", [candidate]);
    if (!result.rowCount) return candidate;
    candidate = `${preferred}-${index + 1}`;
  }
  return `${preferred}-${crypto.randomUUID().slice(0, 8)}`;
}

async function main() {
  const env = loadEnv();
  const dbUrl = poolerUrlFromDirectUrl(env.SUPABASE_DB_URL);
  const geminiApiKey = env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!dbUrl || !geminiApiKey) throw new Error("Missing SUPABASE_DB_URL or GEMINI_API_KEY in .env");

  const db = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await db.connect();
  try {
    const dates = ["2026-05-24", "2026-05-25"];
    const trendResult = await fetchTrends();
    const results = [];

    for (const generationDate of dates) {
      const existing = await db.query(
        "select id, slug, title, generation_date from public.trending_articles where generation_date = $1 limit 1",
        [generationDate],
      );
      if (existing.rowCount) {
        results.push({ generationDate, status: "skipped", reason: "already_generated", title: existing.rows[0].title });
        continue;
      }

      const article = await generateWithGemini({
        apiKey: geminiApiKey,
        model,
        generationDate,
        trends: trendResult.trends,
        fallbackReason: trendResult.fallbackReason,
      });
      const slug = await uniqueSlug(db, `${slugify(article.title)}-${generationDate}`);
      const inserted = await db.query(
        "insert into public.trending_articles (slug,title,excerpt,sections,faqs,keywords,trend_topic,trend_rank,trend_source_url,trend_geo,status,published_at,generation_date) values ($1,$2,$3,$4::jsonb,$5::jsonb,$6::text[],$7,$8,$9,$10,$11,$12,$13) returning slug, title, generation_date, trend_topic",
        [
          slug,
          article.title,
          article.excerpt,
          JSON.stringify(article.sections),
          JSON.stringify(article.faqs),
          article.keywords,
          article.trendTopic,
          article.trendRank,
          article.trendSourceUrl,
          "PK",
          "published",
          `${generationDate}T09:00:00+05:00`,
          generationDate,
        ],
      );
      results.push({
        generationDate,
        status: "published",
        title: inserted.rows[0].title,
        slug: inserted.rows[0].slug,
        trendTopic: inserted.rows[0].trend_topic,
        usedFallback: article.usedFallback,
      });
    }

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
