// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.1";

type TrendItem = {
  rank: number;
  title: string;
  link: string | null;
  pubDate: string | null;
  approxTraffic: string | null;
  description: string | null;
};

type GeneratedSection = {
  heading: string;
  body: string;
};

type GeneratedFaq = {
  question: string;
  answer: string;
};

type GeneratedArticle = {
  title: string;
  excerpt: string;
  trendTopic: string;
  trendRank: number | null;
  trendSourceUrl: string | null;
  sections: GeneratedSection[];
  faqs: GeneratedFaq[];
  keywords: string[];
  usedFallback: boolean;
  fallbackReason: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const googleTrendsUrls = [
  "https://trends.google.com/trending/rss?geo=PK",
  "https://trends.google.com/trends/trendingsearches/daily/rss?geo=PK",
];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  const suppliedSecret =
    request.headers.get("x-cron-secret") ??
    readBearerToken(request.headers.get("authorization"));

  if (!cronSecret || suppliedSecret !== cronSecret) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") ?? Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  const geminiModel = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
  const serviceRoleKeyError = getSupabaseAdminKeyError(serviceRoleKey);

  if (!supabaseUrl || !serviceRoleKey || !geminiApiKey) {
    return jsonResponse(
      {
        error: "Missing server configuration",
        required: [
          "SUPABASE_URL",
          "SUPABASE_SERVICE_ROLE_KEY",
          "GEMINI_API_KEY",
          "CRON_SECRET",
        ],
      },
      500,
    );
  }

  if (serviceRoleKeyError) {
    return jsonResponse(
      {
        error: "Invalid SUPABASE_SERVICE_ROLE_KEY",
        details: serviceRoleKeyError,
      },
      500,
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const generationDate = getKarachiDate();

    const { data: existingArticle, error: existingError } = await supabase
      .from("trending_articles")
      .select("id, slug, title, generation_date")
      .eq("generation_date", generationDate)
      .maybeSingle();

    if (existingError) {
      return jsonResponse(
        {
          error: "Could not check daily article",
          details: existingError.message,
        },
        500,
      );
    }

    if (existingArticle) {
      return jsonResponse({
        status: "skipped",
        reason: "already_generated",
        article: existingArticle,
      });
    }

    const trendResult = await fetchPakistanTrends();
    const rawGenerated = await generateArticleWithGemini({
      apiKey: geminiApiKey,
      model: geminiModel,
      generationDate,
      trends: trendResult.trends,
      trendFetchNote: trendResult.fallbackReason,
    });
    const generated = normalizeGeneratedArticle(
      rawGenerated,
      trendResult.trends,
      trendResult.fallbackReason,
    );
    const baseSlug = slugify(generated.title);
    const slug = await uniqueSlug(supabase, `${baseSlug}-${generationDate}`);

    const { data: insertedArticle, error: insertError } = await supabase
      .from("trending_articles")
      .insert({
        slug,
        title: generated.title,
        excerpt: generated.excerpt,
        sections: generated.sections,
        faqs: generated.faqs,
        keywords: generated.keywords,
        trend_topic: generated.trendTopic,
        trend_rank: generated.trendRank,
        trend_source_url: generated.trendSourceUrl,
        trend_geo: "PK",
        status: "published",
        published_at: new Date().toISOString(),
        generation_date: generationDate,
      })
      .select("id, slug, title, generation_date")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonResponse({
          status: "skipped",
          reason: "already_generated",
          details: insertError.message,
        });
      }

      return jsonResponse(
        { error: "Could not publish article", details: insertError.message },
        500,
      );
    }

    return jsonResponse({
      status: "published",
      article: insertedArticle,
      selectedTrend: generated.trendTopic,
      usedFallback: generated.usedFallback,
      fallbackReason: generated.fallbackReason,
    });
  } catch (error) {
    console.error("Trending article generation failed:", error);
    return jsonResponse(
      {
        error: "Trending article generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

async function fetchPakistanTrends(): Promise<{
  trends: TrendItem[];
  fallbackReason: string | null;
}> {
  let fallbackReason = "Google Trends RSS returned no usable items.";

  for (const url of googleTrendsUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Katpana Desert Tour trend generator",
        },
      });

      if (!response.ok) {
        fallbackReason = `Google Trends RSS request failed with ${response.status} for ${url}.`;
        continue;
      }

      const xml = await response.text();
      const trends = parseGoogleTrendsRss(xml);

      if (trends.length > 0) {
        return { trends, fallbackReason: null };
      }

      fallbackReason = `Google Trends RSS had no item entries for ${url}.`;
    } catch (error) {
      fallbackReason =
        error instanceof Error
          ? error.message
          : "Google Trends RSS request failed.";
    }
  }

  console.log("Trend fallback:", fallbackReason);
  return { trends: [], fallbackReason };
}

function parseGoogleTrendsRss(xml: string): TrendItem[] {
  const itemMatches = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)];

  return itemMatches
    .slice(0, 20)
    .map((match, index) => {
      const block = match[0];
      const title = readXmlTag(block, "title");

      return {
        rank: index + 1,
        title: title ?? "",
        link: readXmlTag(block, "link"),
        pubDate: readXmlTag(block, "pubDate"),
        approxTraffic:
          readXmlTag(block, "ht:approx_traffic") ??
          readXmlTag(block, "approx_traffic"),
        description: stripTags(readXmlTag(block, "description") ?? ""),
      };
    })
    .filter((trend) => trend.title.length > 0);
}

async function generateArticleWithGemini({
  apiKey,
  model,
  generationDate,
  trends,
  trendFetchNote,
}: {
  apiKey: string;
  model: string;
  generationDate: string;
  trends: TrendItem[];
  trendFetchNote: string | null;
}): Promise<unknown> {
  const prompt = buildPrompt(generationDate, trends, trendFetchNote);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Gemini request failed with ${response.status}: ${text.slice(0, 400)}`,
    );
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned no article text.");
  }

  return parseJsonFromModel(text);
}

function buildPrompt(
  generationDate: string,
  trends: TrendItem[],
  trendFetchNote: string | null,
) {
  const trendList = trends.length
    ? trends.map((trend) => ({
        rank: trend.rank,
        title: trend.title,
        link: trend.link,
        traffic: trend.approxTraffic,
        description: trend.description,
      }))
    : [];

  return `
You write original SEO travel content for Katpana Desert Tour, a Skardu and northern Pakistan tourism website.

Generation date: ${generationDate}
Trend source: Google Trends Pakistan RSS.
Trend fetch note: ${trendFetchNote ?? "RSS trends were available."}
Available Pakistan trends:
${JSON.stringify(trendList, null, 2)}

Task:
- Choose the best safe trend that can naturally connect to Skardu, Gilgit Baltistan, northern Pakistan, mountain tourism, cultural travel, seasonal planning, family travel, trekking, deserts, lakes, or road trips.
- If no trend is safe or travel-adjacent, create a safe evergreen northern Pakistan travel fallback article and set usedFallback true with a clear fallbackReason.
- Do not write general news. Use the trend only as an angle for useful travel planning.
- Avoid political persuasion, medical advice, financial advice, celebrity gossip, sensationalism, or unverified claims.
- Make the content original. Do not copy from any website.
- Keep copy practical for travelers considering Skardu, Hunza, Deosai, Shigar, Khaplu, Katpana Desert, Kachura Lakes, or K2-side adventure routes.

Return only JSON with this exact shape:
{
  "title": "SEO-friendly article title",
  "excerpt": "2 sentence summary under 320 characters",
  "trendTopic": "selected trend title or fallback topic",
  "trendRank": 1,
  "trendSourceUrl": "selected trend link or null",
  "sections": [
    { "heading": "Short section heading", "body": "120 to 180 words of useful travel content" }
  ],
  "faqs": [
    { "question": "Traveler question", "answer": "Helpful answer" }
  ],
  "keywords": ["Skardu travel", "Pakistan travel trends"],
  "usedFallback": false,
  "fallbackReason": null
}

Rules:
- sections must contain 4 to 6 items.
- faqs must contain exactly 3 items.
- keywords must contain 6 to 10 items.
- trendRank must be null when usedFallback is true.
- trendSourceUrl must be null when usedFallback is true.
`;
}

function normalizeGeneratedArticle(
  value: unknown,
  trends: TrendItem[],
  trendFetchNote: string | null,
): GeneratedArticle {
  if (!isRecord(value)) {
    throw new Error("Gemini JSON was not an object.");
  }

  const usedFallback = value.usedFallback === true || trends.length === 0;
  const trendRank = usedFallback ? null : cleanNumber(value.trendRank);
  const generatedTrendTopic = cleanText(value.trendTopic, 140);
  const matchedTrend = trendRank
    ? trends.find((trend) => trend.rank === trendRank)
    : findTrendByTopic(trends, generatedTrendTopic);
  const trendTopic = usedFallback
    ? generatedTrendTopic || "Northern Pakistan travel planning"
    : (matchedTrend?.title ?? generatedTrendTopic) || "Pakistan travel trend";
  const trendSourceUrl = usedFallback
    ? null
    : (matchedTrend?.link ?? cleanNullableText(value.trendSourceUrl, 500));
  const sections = normalizeSections(value.sections);
  const faqs = normalizeFaqs(value.faqs);
  const keywords = normalizeKeywords(value.keywords);
  const title = cleanText(value.title, 120);
  const excerpt = cleanText(value.excerpt, 320);

  if (!title || !excerpt || sections.length < 3) {
    throw new Error(
      "Gemini article did not include the required title, excerpt, and sections.",
    );
  }

  return {
    title,
    excerpt,
    trendTopic,
    trendRank: usedFallback ? null : (matchedTrend?.rank ?? trendRank),
    trendSourceUrl,
    sections,
    faqs,
    keywords,
    usedFallback,
    fallbackReason: usedFallback
      ? (cleanNullableText(value.fallbackReason, 240) ??
        trendFetchNote ??
        "No safe travel-adjacent trend was available.")
      : null,
  };
}

function normalizeSections(value: unknown): GeneratedSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const heading = cleanText(item.heading, 100);
      const body = cleanText(item.body, 1600);
      return heading && body ? { heading, body } : null;
    })
    .filter((item): item is GeneratedSection => Boolean(item))
    .slice(0, 6);
}

function normalizeFaqs(value: unknown): GeneratedFaq[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const question = cleanText(item.question, 180);
      const answer = cleanText(item.answer, 700);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is GeneratedFaq => Boolean(item))
    .slice(0, 3);
}

function normalizeKeywords(value: unknown): string[] {
  if (!Array.isArray(value))
    return ["Skardu travel", "northern Pakistan travel", "Katpana Desert Tour"];

  const keywords = value
    .map((item) => cleanText(item, 60))
    .filter(Boolean)
    .slice(0, 10);

  return keywords.length
    ? keywords
    : ["Skardu travel", "northern Pakistan travel", "Katpana Desert Tour"];
}

async function uniqueSlug(
  supabase: ReturnType<typeof createClient>,
  preferredSlug: string,
) {
  let candidate = preferredSlug;

  for (let index = 1; index <= 10; index += 1) {
    const { data, error } = await supabase
      .from("trending_articles")
      .select("slug")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not check slug uniqueness: ${error.message}`);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${preferredSlug}-${index + 1}`;
  }

  return `${preferredSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

function parseJsonFromModel(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini response did not contain a JSON object.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function readXmlTag(block: string, tagName: string) {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(
    new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`, "i"),
  );
  return match ? decodeXml(match[1].trim()) : null;
}

function decodeXml(value: string) {
  const withoutCdata = value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");

  return withoutCdata
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    );
}

function stripTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findTrendByTopic(trends: TrendItem[], topic: string) {
  const normalizedTopic = topic.toLowerCase();
  return trends.find(
    (trend) =>
      normalizedTopic.includes(trend.title.toLowerCase()) ||
      trend.title.toLowerCase().includes(normalizedTopic),
  );
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, maxLength).trim()
    : "";
}

function cleanNullableText(value: unknown, maxLength: number) {
  const text = cleanText(value, maxLength);
  return text || null;
}

function cleanNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "pakistan-travel-trend"
  );
}

function getKarachiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function readBearerToken(value: string | null) {
  return value?.replace(/^Bearer\s+/i, "") ?? null;
}

function getSupabaseAdminKeyError(value: string | null | undefined) {
  if (!value) {
    return "Missing key.";
  }

  if (value.startsWith("sb_publishable_")) {
    return "Publishable keys cannot write to trending_articles. Use the project service_role JWT or an sb_secret key.";
  }

  if (value.startsWith("sb_secret_")) {
    return null;
  }

  const parts = value.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload?.role === "service_role"
      ? null
      : "JWT role was not service_role. Use the project service_role JWT or an sb_secret key.";
  } catch {
    return "Could not parse the configured key. Use the project service_role JWT or an sb_secret key.";
  }
}

function decodeBase64Url(value: string) {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
