const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

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

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1] ?? fallback;
}

function parseJsonMaybe(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return { text: value.slice(0, 1000) };
  }
}

function facebookWebhookPayload(article) {
  const siteUrl = (process.env.SITE_URL || "https://www.katpanadesert.com").replace(/\/+$/g, "");
  const articleUrl = publicTrendingArticleUrl(siteUrl, article.slug);
  const staticUrl = staticTrendingArticleUrl(siteUrl, article.slug);
  const keywords = Array.isArray(article.keywords) ? article.keywords : [];
  const sections = normalizeSections(article.sections);
  const faqs = normalizeFaqs(article.faqs);
  const articleBody = buildArticleBody(article.title, article.excerpt, sections, faqs);
  const hashtags = keywords
    .slice(0, 5)
    .map((keyword) => `#${keyword.replace(/[^a-z0-9]+/gi, "")}`)
    .filter((tag) => tag.length > 1);
  const message = [
    article.title,
    "",
    article.excerpt,
    "",
    `Read more: ${articleUrl}`,
    hashtags.join(" "),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    source: "katpana-desert-tour",
    channel: "facebook",
    replay: true,
    message,
    post_caption: message,
    link: articleUrl,
    url: articleUrl,
    article_url: articleUrl,
    public_url: articleUrl,
    canonical_url: articleUrl,
    static_url: staticUrl,
    article: {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      url: articleUrl,
      article_url: articleUrl,
      public_url: articleUrl,
      canonical_url: articleUrl,
      static_url: staticUrl,
      published_at: article.published_at,
      generation_date: article.generation_date,
      trend_topic: article.trend_topic,
      trend_rank: article.trend_rank,
      trend_source_url: article.trend_source_url,
      trend_geo: article.trend_geo,
      keywords,
      sections,
      faqs,
      body: articleBody,
      full_text: articleBody,
    },
    article_body: articleBody,
    content: articleBody,
    facebook: {
      message,
      link: articleUrl,
      url: articleUrl,
      hashtags,
    },
  };
}

function publicTrendingArticleUrl(siteUrl, slug) {
  return `${siteUrl}/trending/?article=${encodeURIComponent(slug)}`;
}

function staticTrendingArticleUrl(siteUrl, slug) {
  return `${siteUrl}/trending/${encodeURIComponent(slug)}/`;
}

function normalizeSections(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const heading = typeof item.heading === "string" ? item.heading : "";
      const body = typeof item.body === "string" ? item.body : "";
      return heading && body ? { heading, body } : null;
    })
    .filter(Boolean);
}

function normalizeFaqs(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const question = typeof item.question === "string" ? item.question : "";
      const answer = typeof item.answer === "string" ? item.answer : "";
      return question && answer ? { question, answer } : null;
    })
    .filter(Boolean);
}

function buildArticleBody(title, excerpt, sections, faqs) {
  const sectionText = sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
  const faqText = faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");

  return [title, excerpt, sectionText, faqText ? `FAQs\n${faqText}` : ""].filter(Boolean).join("\n\n");
}

async function markArticlePosted(supabase, articleId, response, responseText) {
  const update = {
    facebook_webhook_status: String(response.status),
    facebook_webhook_response: parseJsonMaybe(responseText),
    facebook_webhook_error: response.ok ? null : responseText.slice(0, 1000),
  };

  if (response.ok) {
    update.facebook_posted_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("trending_articles")
    .update(update)
    .eq("id", articleId);

  if (error) {
    console.warn(`Could not update facebook tracking for ${articleId}: ${error.message}`);
  }
}

function makeWebhookHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (process.env.MAKE_FACEBOOK_WEBHOOK_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.MAKE_FACEBOOK_WEBHOOK_BEARER_TOKEN}`;
  }

  if (process.env.MAKE_FACEBOOK_WEBHOOK_AUTH_HEADER?.includes(":")) {
    const [name, ...valueParts] = process.env.MAKE_FACEBOOK_WEBHOOK_AUTH_HEADER.split(":");
    const value = valueParts.join(":").trim();
    if (name.trim() && value) headers[name.trim()] = value;
  }

  return headers;
}

async function main() {
  loadEnvFile();

  const limit = Number.parseInt(argValue("--limit", "3"), 10) || 3;
  const dryRun = process.argv.includes("--dry-run");
  const includePosted = process.argv.includes("--include-posted");
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookUrl = process.env.MAKE_FACEBOOK_WEBHOOK_URL;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!webhookUrl && !dryRun) {
    throw new Error("Missing MAKE_FACEBOOK_WEBHOOK_URL. Pass it as an environment variable.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = supabase
    .from("trending_articles")
    .select(
      "id,slug,title,excerpt,keywords,trend_topic,trend_rank,trend_source_url,trend_geo,published_at,generation_date,facebook_posted_at"
      + ",sections,faqs"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!includePosted) {
    query = query.is("facebook_posted_at", null);
  }

  const { data: articles, error } = await query;
  if (error) throw new Error(`Could not load trending articles: ${error.message}`);

  const results = [];

  for (const article of articles ?? []) {
    const payload = facebookWebhookPayload(article);

    if (dryRun) {
      results.push({
        slug: article.slug,
        title: article.title,
        url: payload.article.url,
        message: payload.facebook.message,
      });
      continue;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: makeWebhookHeaders(),
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    await markArticlePosted(supabase, article.id, response, responseText);

    results.push({
      slug: article.slug,
      title: article.title,
      httpStatus: response.status,
      ok: response.ok,
      response: parseJsonMaybe(responseText),
    });
  }

  console.log(JSON.stringify({ count: results.length, dryRun, results }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
