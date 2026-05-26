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
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Skipping trending archive sync: missing Supabase URL or key.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("trending_articles")
    .select("id,slug,title,excerpt,sections,faqs,keywords,trend_topic,trend_rank,trend_source_url,trend_geo,published_at,generation_date")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(365);

  if (error) throw new Error(`Could not sync trending archive: ${error.message}`);

  const articles = data ?? [];
  const body = `import { type TrendingArticle } from "./trending";

export const staticTrendingArticles: TrendingArticle[] = [
${articles.map(formatArticle).join(",\n")}
];

export function getStaticTrendingArticle(slug: string) {
  return staticTrendingArticles.find((article) => article.slug === slug);
}
`;

  const outputPath = path.join(process.cwd(), "data", "trending-static.ts");
  fs.writeFileSync(outputPath, body, "utf8");
  console.log(`Synced ${articles.length} trending archive articles to data/trending-static.ts.`);
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
    published_at: ${tsString(article.published_at)},
    generation_date: ${tsString(article.generation_date)},
  }`;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
