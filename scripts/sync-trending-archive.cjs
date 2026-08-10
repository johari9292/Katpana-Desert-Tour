const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  if (!fs.existsSync(".env")) return;

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
    if (!process.env[key]) process.env[key] = value;
  }
}

function tsString(value) {
  return JSON.stringify(value ?? "");
}

function tsValue(value, indent = 4) {
  return JSON.stringify(value ?? null, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${" ".repeat(indent)}${line}`))
    .join("\n");
}

async function main() {
  loadEnvFile();

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Skipping approved travel-update sync: missing Supabase URL or service-role key.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("trending_articles")
    .select([
      "id", "slug", "title", "excerpt", "sections", "faqs", "keywords",
      "trend_topic", "trend_rank", "trend_source_url", "trend_geo",
      "content_cluster", "search_intent", "primary_query", "intent_key",
      "canonical_parent", "editorial_summary", "citations", "local_evidence",
      "status", "reviewed_by", "reviewed_at", "last_verified_at", "next_review_at",
      "published_at", "generation_date", "updated_at"
    ].join(","))
    .eq("status", "published")
    .order("last_verified_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`Could not sync approved travel updates: ${error.message}. Apply the editorial workflow migrations first.`);
  }

  const rows = data ?? [];
  const buildReferenceDate = new Date();
  const articles = rows.filter((article) => isEditoriallyApprovedArticle(article, buildReferenceDate));
  const rejectedCount = rows.length - articles.length;
  if (rejectedCount) {
    console.warn(`Excluded ${rejectedCount} published row(s) that did not pass the static editorial gate.`);
  }

  const body = `import { isTrendingReviewCurrent, type TrendingArticle } from "./trending";

// Generated at build time from human-approved Supabase rows only.
const approvedStaticTrendingArticles: TrendingArticle[] = [
${articles.map(formatArticle).join(",\n")}
];

// Re-check freshness during every build, including builds where the database
// sync is skipped because credentials are unavailable.
export const staticTrendingArticles = approvedStaticTrendingArticles.filter((article) =>
  isTrendingReviewCurrent(article.next_review_at)
);

export function getStaticTrendingArticle(slug: string) {
  return staticTrendingArticles.find((article) => article.slug === slug);
}
`;

  const outputPath = path.join(process.cwd(), "data", "trending-static.ts");
  fs.writeFileSync(outputPath, body, "utf8");
  console.log(`Synced ${articles.length} approved travel update(s) to data/trending-static.ts.`);
}

function isEditoriallyApprovedArticle(article, referenceDate = new Date()) {
  const sections = Array.isArray(article.sections) ? article.sections : [];
  const citations = Array.isArray(article.citations) ? article.citations : [];
  const localEvidence = Array.isArray(article.local_evidence) ? article.local_evidence : [];
  const sectionWordCount = sections.reduce((total, section) => {
    if (!section || typeof section.body !== "string") return total;
    return total + section.body.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  return article.status === "published"
    && Boolean(article.reviewed_by && article.reviewed_at && article.last_verified_at && article.next_review_at)
    && isTrendingReviewCurrent(article.next_review_at, referenceDate)
    && typeof article.title === "string" && article.title.trim().length >= 35 && article.title.trim().length <= 75
    && typeof article.excerpt === "string" && article.excerpt.trim().length >= 100 && article.excerpt.trim().length <= 240
    && Boolean(article.intent_key && article.primary_query && article.content_cluster && article.search_intent)
    && typeof article.canonical_parent === "string"
    && article.canonical_parent.startsWith("/")
    && typeof article.editorial_summary === "string"
    && article.editorial_summary.trim().length >= 80
    && sections.length >= 4
    && sectionWordCount >= 600
    && sections.every((section) => section && typeof section.heading === "string" && typeof section.body === "string" && section.body.trim().length >= 300)
    && citations.length >= 1
    && citations.every((source) => source && /^https:\/\//.test(source.url || "") && source.title && source.publisher && /^\d{4}-\d{2}-\d{2}/.test(source.accessed_at || ""))
    && localEvidence.length >= 1
    && localEvidence.every((evidence) => evidence && evidence.description && /^\d{4}-\d{2}-\d{2}/.test(evidence.observed_at || "") && evidence.location && evidence.verified_by && ["field-check", "guide-note", "operator-record", "traveler-question"].includes(evidence.type))
    && localEvidence.some((evidence) => ["field-check", "guide-note", "operator-record"].includes(evidence.type));
}

function isTrendingReviewCurrent(nextReviewAt, referenceDate = new Date()) {
  if (!(referenceDate instanceof Date) || Number.isNaN(referenceDate.getTime())) return false;
  const reviewDate = validIsoDate(nextReviewAt);
  const currentDate = validIsoDate(referenceDate.toISOString());
  return Boolean(reviewDate && currentDate && reviewDate >= currentDate);
}

function validIsoDate(value) {
  if (typeof value !== "string") return null;
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!dateOnly) return null;

  const parsed = new Date(`${dateOnly}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateOnly
    ? null
    : dateOnly;
}

function formatArticle(article) {
  return `  {
    id: ${tsString(article.id)},
    slug: ${tsString(article.slug)},
    title: ${tsString(article.title)},
    excerpt: ${tsString(article.excerpt)},
    sections: ${tsValue(article.sections)},
    faqs: ${tsValue(article.faqs)},
    keywords: ${tsValue(article.keywords)},
    trend_topic: ${tsString(article.trend_topic)},
    trend_rank: ${article.trend_rank ?? "null"},
    trend_source_url: ${article.trend_source_url ? tsString(article.trend_source_url) : "null"},
    trend_geo: ${tsString(article.trend_geo)},
    content_cluster: ${tsString(article.content_cluster)},
    search_intent: ${tsString(article.search_intent)},
    primary_query: ${tsString(article.primary_query)},
    intent_key: ${tsString(article.intent_key)},
    canonical_parent: ${tsString(article.canonical_parent)},
    editorial_summary: ${tsString(article.editorial_summary)},
    citations: ${tsValue(article.citations)},
    local_evidence: ${tsValue(article.local_evidence)},
    status: "published",
    reviewed_by: ${tsString(article.reviewed_by)},
    reviewed_at: ${tsString(article.reviewed_at)},
    last_verified_at: ${tsString(article.last_verified_at)},
    next_review_at: ${tsString(article.next_review_at)},
    published_at: ${tsString(article.published_at)},
    generation_date: ${tsString(article.generation_date)},
    updated_at: ${tsString(article.updated_at)},
  }`;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { isEditoriallyApprovedArticle, isTrendingReviewCurrent };
