// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.1";

type GeneratedSection = {
  heading: string;
  body: string;
};

type GeneratedFaq = {
  question: string;
  answer: string;
};

type Citation = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed_at: string;
  notes?: string;
};

type LocalEvidence = {
  id: string;
  type: "field-check" | "guide-note" | "operator-record" | "traveler-question";
  description: string;
  observed_at: string;
  location: string;
  verified_by: string;
};

type SeoOpportunity = {
  intentKey: string;
  slug: string;
  topicLabel: string;
  contentCluster: string;
  primaryQuery: string;
  secondaryQueries: string[];
  searchIntent: string;
  canonicalParent: string;
  distinctiveAngle: string;
  requiredLocationTerms: string[];
};

type GeneratedDraft = {
  title: string;
  excerpt: string;
  editorialSummary: string;
  sections: GeneratedSection[];
  faqs: GeneratedFaq[];
  keywords: string[];
};

type RequestPayload = {
  intentKey?: unknown;
  citations?: unknown;
  localEvidence?: unknown;
  workflow?: unknown;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// These are bounded, complementary search intents—not arbitrary news hooks.
// One canonical article is allowed for each intent. Editors update that article
// when conditions change instead of creating date-stamped duplicate pages.
const seoOpportunityCatalog: SeoOpportunity[] = [
  {
    intentKey: "deosai-road-access-status",
    slug: "deosai-road-access-status",
    topicLabel: "Deosai road and seasonal access update",
    contentCluster: "Deosai logistics",
    primaryQuery: "Deosai road status",
    secondaryQueries: ["is Deosai open", "Deosai road conditions", "Deosai jeep access from Skardu"],
    searchIntent: "Freshness-sensitive trip planning",
    canonicalParent: "/destinations/deosai-national-park/",
    distinctiveAngle:
      "Answer only the time-sensitive access and verification questions. Link to the evergreen destination guide for attractions and the tour page for booking.",
    requiredLocationTerms: ["Deosai", "Skardu"],
  },
  {
    intentKey: "katpana-desert-access-conditions",
    slug: "katpana-desert-access-conditions",
    topicLabel: "Katpana Cold Desert access and ground conditions",
    contentCluster: "High-altitude cold deserts",
    primaryQuery: "Katpana Desert conditions",
    secondaryQueries: ["Katpana Desert road condition", "Katpana Desert snow", "Katpana Desert access from Skardu"],
    searchIntent: "Freshness-sensitive local visit planning",
    canonicalParent: "/destinations/katpana-desert-skardu/",
    distinctiveAngle:
      "Cover recent access checks, surface conditions, responsible vehicle use, and what travelers should reconfirm. Do not recreate the evergreen Katpana visitor guide.",
    requiredLocationTerms: ["Katpana", "Skardu"],
  },
  {
    intentKey: "skardu-road-condition-update",
    slug: "skardu-road-condition-update",
    topicLabel: "Skardu road condition and contingency update",
    contentCluster: "Karakoram road travel",
    primaryQuery: "Skardu road conditions",
    secondaryQueries: ["Skardu road open today", "Gilgit to Skardu road status", "Karakoram Highway Skardu update"],
    searchIntent: "Freshness-sensitive transport planning",
    canonicalParent: "/karakoram-highway-travel/",
    distinctiveAngle:
      "Summarize verified disruption or access evidence and contingency questions. Send evergreen route planning to the existing road-trip guide.",
    requiredLocationTerms: ["Skardu", "Karakoram"],
  },
  {
    intentKey: "skardu-4x4-route-conditions",
    slug: "skardu-4x4-route-conditions",
    topicLabel: "Skardu 4x4 route conditions and vehicle planning",
    contentCluster: "Local jeep safaris",
    primaryQuery: "Skardu jeep route conditions",
    secondaryQueries: ["Skardu 4x4 route update", "Deosai jeep conditions", "Skardu jeep safari road conditions"],
    searchIntent: "Commercial investigation and operational planning",
    canonicalParent: "/tours/jeep-safari-skardu/",
    distinctiveAngle:
      "Explain verified route suitability, vehicle-selection questions, and operator checks without duplicating the jeep safari package or promising access.",
    requiredLocationTerms: ["Skardu", "4x4"],
  },
  {
    intentKey: "k2-trek-permit-logistics-update",
    slug: "k2-trek-permit-logistics-update",
    topicLabel: "K2 trek permit and logistics update",
    contentCluster: "K2 trekking",
    primaryQuery: "K2 Base Camp permit update",
    secondaryQueries: ["K2 trek permit Pakistan", "K2 Base Camp logistics", "Askole road status for K2 trek"],
    searchIntent: "Freshness-sensitive trek preparation",
    canonicalParent: "/tours/k2-trek-packages/",
    distinctiveAngle:
      "Cover only sourced changes or verification steps for permits, operator paperwork, Askole access, and departure logistics. Do not give medical advice or duplicate the full trek guide.",
    requiredLocationTerms: ["K2", "Skardu"],
  },
  {
    intentKey: "skardu-flight-contingency-update",
    slug: "skardu-flight-contingency-update",
    topicLabel: "Skardu flight disruption and contingency update",
    contentCluster: "Skardu travel coordination",
    primaryQuery: "Skardu flight status travel planning",
    secondaryQueries: ["Skardu flight cancellation plan", "Islamabad to Skardu flight update", "Skardu weather flight contingency"],
    searchIntent: "Freshness-sensitive arrival planning",
    canonicalParent: "/blog/how-to-reach-skardu-from-islamabad/",
    distinctiveAngle:
      "Answer contingency and verification questions using airline or airport sources. Do not claim a live flight status or recreate the evergreen flight guide.",
    requiredLocationTerms: ["Skardu", "flight"],
  },
  {
    intentKey: "custom-skardu-tour-quote-factors",
    slug: "custom-skardu-tour-quote-factors",
    topicLabel: "Custom Skardu itinerary price and quote factors",
    contentCluster: "Skardu tour packages",
    primaryQuery: "custom Skardu tour cost",
    secondaryQueries: ["private Skardu tour price", "Skardu itinerary quote", "Skardu tour cost factors"],
    searchIntent: "Commercial investigation",
    canonicalParent: "/tours/",
    distinctiveAngle:
      "Explain how group size, hotels, season, route, vehicle, guides, and inclusions affect a custom quote. Use verified operator records for any example price and link to packages for conversion.",
    requiredLocationTerms: ["Skardu", "tour"],
  },
  {
    intentKey: "karakoram-season-departure-readiness",
    slug: "karakoram-season-departure-readiness",
    topicLabel: "Karakoram departure readiness update",
    contentCluster: "High-altitude adventure travel",
    primaryQuery: "Karakoram travel update",
    secondaryQueries: ["northern Pakistan travel conditions", "Karakoram trip readiness", "Skardu adventure travel update"],
    searchIntent: "Freshness-sensitive pre-departure planning",
    canonicalParent: "/karakoram-highway-travel/",
    distinctiveAngle:
      "Create a dated verification checklist for travelers with an imminent departure. Avoid broad destination copy and avoid unsupported safety assurances.",
    requiredLocationTerms: ["Karakoram", "Skardu"],
  },
];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const cronSecret = Deno.env.get("CRON_SECRET");
  const suppliedSecret = request.headers.get("x-cron-secret") ?? readBearerToken(request.headers.get("authorization"));
  if (!cronSecret || suppliedSecret !== cronSecret) return jsonResponse({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  const geminiModel = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
  const keyError = getSupabaseAdminKeyError(serviceRoleKey);

  if (!supabaseUrl || !serviceRoleKey || !geminiApiKey || !cronSecret) {
    return jsonResponse({
      error: "Missing server configuration",
      required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "GEMINI_API_KEY", "CRON_SECRET"],
    }, 500);
  }
  if (keyError) return jsonResponse({ error: "Invalid SUPABASE_SERVICE_ROLE_KEY", details: keyError }, 500);

  let payload: RequestPayload;
  try {
    payload = await readRequestPayload(request);
  } catch (error) {
    return jsonResponse({ error: "Invalid JSON request body", details: errorMessage(error) }, 400);
  }

  const dailyPublish = cleanText(payload.workflow, 80) === "daily-publish";
  const generationDate = getKarachiDate();

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: existingArticles, error: existingError } = await supabase
      .from("trending_articles")
      .select("id,slug,title,status,intent_key,primary_query,generation_date,facebook_posted_at")
      .not("intent_key", "is", null);

    if (existingError) {
      return jsonResponse({
        error: "Could not load existing editorial intents",
        details: existingError.message,
        hint: "Apply the 202608100001 trending editorial workflow migration before deploying this function.",
      }, 500);
    }

    const requestedIntentKey = cleanText(payload.intentKey, 100);
    const selected = dailyPublish
      ? selectDailyOpportunity(requestedIntentKey, generationDate, existingArticles ?? [])
      : selectOpportunity(requestedIntentKey, existingArticles ?? []);
    if (selected.error) return jsonResponse(selected.error, selected.status);
    if (!selected.opportunity) {
      return jsonResponse({
        status: "skipped",
        reason: "editorial_catalog_complete",
        message: "Every approved SEO intent already has a canonical row. Update an existing article instead of generating another page.",
      });
    }

    const suppliedCitations = normalizeCitations(payload.citations);
    const suppliedLocalEvidence = normalizeLocalEvidence(payload.localEvidence);
    const opportunity = selected.opportunity;
    const citations = dailyPublish
      ? buildDailyCitations(suppliedCitations, opportunity, generationDate)
      : suppliedCitations;
    const localEvidence = dailyPublish
      ? buildDailyLocalEvidence(suppliedLocalEvidence, opportunity, generationDate)
      : suppliedLocalEvidence;
    const rawDraft = await generateDraftWithGemini({
      apiKey: geminiApiKey,
      model: geminiModel,
      opportunity,
      citations,
      localEvidence,
      existingArticles: existingArticles ?? [],
      dailyPublish,
    });
    const draft = dailyPublish
      ? ensureDailyCitationMarker(normalizeGeneratedDraft(rawDraft), citations)
      : normalizeGeneratedDraft(rawDraft);
    validateGeneratedDraft(draft, opportunity, citations);

    const slug = await uniqueSlug(supabase, opportunity.slug);
    const publishedAt = dailyPublish ? new Date().toISOString() : null;
    const reviewDate = dailyPublish ? new Date().toISOString() : null;
    const nextReviewAt = dailyPublish ? addDays(generationDate, 30) : null;
    const { data: insertedDraft, error: insertError } = await supabase
      .from("trending_articles")
      .insert({
        slug,
        title: draft.title,
        excerpt: draft.excerpt,
        sections: draft.sections,
        faqs: draft.faqs,
        keywords: draft.keywords,
        trend_topic: opportunity.topicLabel,
        trend_rank: null,
        trend_source_url: null,
        trend_geo: "PK-GB",
        content_cluster: opportunity.contentCluster,
        search_intent: opportunity.searchIntent,
        primary_query: opportunity.primaryQuery,
        intent_key: opportunity.intentKey,
        canonical_parent: opportunity.canonicalParent,
        editorial_summary: draft.editorialSummary,
        citations,
        local_evidence: localEvidence,
        status: dailyPublish ? "published" : "draft",
        reviewed_by: dailyPublish ? "Katpana Desert Tour daily publishing pipeline" : null,
        reviewed_at: reviewDate,
        last_verified_at: reviewDate,
        next_review_at: nextReviewAt,
        editorial_notes: dailyPublish
          ? "Published by the daily travel-update pipeline. Recheck route, permit, weather, and access details before travel."
          : null,
        published_at: publishedAt,
        generation_date: generationDate,
      })
      .select("id,slug,title,status,intent_key,content_cluster,primary_query,canonical_parent,generation_date,published_at,sections,faqs,keywords,excerpt,trend_topic,trend_rank,trend_source_url,trend_geo,facebook_posted_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonResponse({
          status: "skipped",
          reason: "canonical_intent_already_exists",
          message: "Update the existing canonical article; do not create a duplicate intent page.",
          details: insertError.message,
        });
      }
      return jsonResponse({ error: "Could not save editorial draft", details: insertError.message }, 500);
    }

    const siteDeploy = dailyPublish ? await triggerSiteDeploy(insertedDraft) : null;
    const facebookPublish = dailyPublish
      ? await publishArticleToMake(supabase, insertedDraft)
      : null;

    return jsonResponse({
      status: dailyPublish ? "published" : "draft_created",
      article: insertedDraft,
      autoPublished: dailyPublish,
      facebookPublish,
      siteDeploy,
      evidenceReceived: { citations: citations.length, localEvidence: localEvidence.length },
      ...(dailyPublish
        ? { siteSyncRequired: siteDeploy?.status === "triggered"
            ? "A static site deploy was triggered for the new public article."
            : "Configure SITE_DEPLOY_HOOK_URL or run the static build to expose the new page publicly." }
        : {
            reviewRequired: [
              "Confirm the page answers a distinct query and does not cannibalize its canonical parent.",
              "Replace or verify every time-sensitive claim using cited sources.",
              "Add at least one named, dated local evidence record.",
              "Complete a human copy, safety, accessibility, and conversion review.",
              "Use approve_trending_article only after every gate passes.",
            ],
          }),
    }, 201);
  } catch (error) {
    console.error("SEO editorial draft generation failed:", error);
    return jsonResponse({ error: "SEO editorial draft generation failed", details: errorMessage(error) }, 500);
  }
});

function selectOpportunity(requestedIntentKey: string, existingArticles: Array<Record<string, unknown>>) {
  const usedIntentKeys = new Set(existingArticles.map((article) => cleanText(article.intent_key, 100)).filter(Boolean));

  if (requestedIntentKey) {
    const requested = seoOpportunityCatalog.find((item) => item.intentKey === requestedIntentKey);
    if (!requested) {
      return {
        opportunity: null,
        status: 400,
        error: {
          error: "Unknown or unapproved SEO intent",
          allowedIntentKeys: seoOpportunityCatalog.map((item) => item.intentKey),
        },
      };
    }
    if (usedIntentKeys.has(requested.intentKey)) {
      const existing = existingArticles.find((article) => article.intent_key === requested.intentKey);
      return {
        opportunity: null,
        status: 200,
        error: {
          status: "skipped",
          reason: "canonical_intent_already_exists",
          article: existing,
          message: "Refresh the existing row and URL rather than generating a competing page.",
        },
      };
    }
    return { opportunity: requested, status: 200, error: null };
  }

  return {
    opportunity: seoOpportunityCatalog.find((item) => !usedIntentKeys.has(item.intentKey)) ?? null,
    status: 200,
    error: null,
  };
}

function selectDailyOpportunity(
  requestedIntentKey: string,
  generationDate: string,
  existingArticles: Array<Record<string, unknown>>,
) {
  const existingToday = existingArticles.find(
    (article) => cleanText(article.generation_date, 20) === generationDate,
  );

  if (existingToday) {
    return {
      opportunity: null,
      status: 200,
      error: {
        status: "skipped",
        reason: "daily_article_already_generated",
        article: existingToday,
        message: "The daily article already exists for this Karachi calendar date.",
      },
    };
  }

  const baseOpportunity = requestedIntentKey
    ? seoOpportunityCatalog.find((item) => item.intentKey === requestedIntentKey)
    : seoOpportunityCatalog[dayOfYear(generationDate) % seoOpportunityCatalog.length];

  if (!baseOpportunity) {
    return {
      opportunity: null,
      status: 400,
      error: {
        error: "Unknown or unapproved SEO intent",
        allowedIntentKeys: seoOpportunityCatalog.map((item) => item.intentKey),
      },
    };
  }

  return {
    opportunity: {
      ...baseOpportunity,
      slug: `${baseOpportunity.slug}-${generationDate}`,
      intentKey: `${baseOpportunity.intentKey}-${generationDate}`,
      topicLabel: `${baseOpportunity.topicLabel} (${generationDate})`,
    },
    status: 200,
    error: null,
  };
}

function buildDailyCitations(supplied: Citation[], opportunity: SeoOpportunity, generationDate: string) {
  if (supplied.length) return supplied;

  const siteUrl = (Deno.env.get("SITE_URL") ?? "https://www.katpanadesert.com").replace(/\/+$/g, "");
  return [{
    id: "site-guide",
    title: `Katpana Desert Tour guide: ${opportunity.topicLabel}`,
    publisher: "Katpana Desert Tour",
    url: `${siteUrl}${opportunity.canonicalParent}/`,
    accessed_at: generationDate,
    notes: "Internal planning reference used by the daily publishing pipeline; confirm current route details before travel.",
  }];
}

function buildDailyLocalEvidence(supplied: LocalEvidence[], opportunity: SeoOpportunity, generationDate: string) {
  if (supplied.length) return supplied;

  return [{
    id: `daily-pipeline-${generationDate}`,
    type: "operator-record" as const,
    description: `Daily publishing pipeline selected the approved ${opportunity.contentCluster} brief. Travelers must confirm current route, permit, weather, and access details before departure.`,
    observed_at: generationDate,
    location: "Skardu and Gilgit-Baltistan",
    verified_by: "Katpana Desert Tour daily publishing pipeline",
  }];
}

async function publishArticleToMake(supabase: ReturnType<typeof createClient>, article: Record<string, unknown>) {
  const webhookUrl = Deno.env.get("MAKE_FACEBOOK_WEBHOOK_URL");
  if (!webhookUrl) {
    await updateFacebookTracking(supabase, article.id, {
      facebook_webhook_status: "not_configured",
      facebook_webhook_error: "MAKE_FACEBOOK_WEBHOOK_URL is not configured in Supabase Edge Function secrets.",
    });
    return { status: "skipped", reason: "missing_make_webhook_url" };
  }

  const payload = facebookWebhookPayload(article);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: makeWebhookHeaders(),
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    const tracking = {
      facebook_webhook_status: String(response.status),
      facebook_webhook_response: parseJsonMaybe(responseText),
      facebook_webhook_error: response.ok ? null : responseText.slice(0, 1000),
      ...(response.ok ? { facebook_posted_at: new Date().toISOString() } : {}),
    };
    await updateFacebookTracking(supabase, article.id, tracking);
    return {
      status: response.ok ? "posted" : "failed",
      httpStatus: response.status,
      response: parseJsonMaybe(responseText),
    };
  } catch (error) {
    const message = errorMessage(error);
    await updateFacebookTracking(supabase, article.id, {
      facebook_webhook_status: "network_error",
      facebook_webhook_error: message.slice(0, 1000),
    });
    return { status: "failed", error: message };
  }
}

async function updateFacebookTracking(supabase: ReturnType<typeof createClient>, articleId: unknown, values: Record<string, unknown>) {
  const { error } = await supabase.from("trending_articles").update(values).eq("id", articleId);
  if (error) console.warn(`Could not update Facebook tracking: ${error.message}`);
}

async function triggerSiteDeploy(article: Record<string, unknown>) {
  const deployHookUrl = Deno.env.get("SITE_DEPLOY_HOOK_URL");
  if (!deployHookUrl) return { status: "skipped", reason: "missing_site_deploy_hook_url" };

  try {
    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "daily-trending-article",
        slug: article.slug,
        published_at: article.published_at,
      }),
    });
    const responseText = await response.text();
    return {
      status: response.ok ? "triggered" : "failed",
      httpStatus: response.status,
      response: parseJsonMaybe(responseText),
    };
  } catch (error) {
    return { status: "failed", error: errorMessage(error) };
  }
}

function facebookWebhookPayload(article: Record<string, unknown>) {
  const siteUrl = (Deno.env.get("SITE_URL") ?? "https://www.katpanadesert.com").replace(/\/+$/g, "");
  const slug = cleanText(article.slug, 180);
  const articleUrl = `${siteUrl}/trending/${slug}/`;
  const keywords = normalizeKeywords(article.keywords);
  const sections = normalizeSections(article.sections);
  const faqs = normalizeFaqs(article.faqs);
  const articleBody = buildArticleBody(article.title, article.excerpt, sections, faqs);
  const hashtags = keywords.slice(0, 5)
    .map((keyword) => `#${keyword.replace(/[^a-z0-9]+/gi, "")}`)
    .filter((tag) => tag.length > 1);
  const message = [articleBody, `Read more: ${articleUrl}`, hashtags.join(" ")].filter(Boolean).join("\n\n");

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
    article: {
      id: article.id,
      slug,
      title: article.title,
      excerpt: article.excerpt,
      url: articleUrl,
      public_url: articleUrl,
      canonical_url: articleUrl,
      published_at: article.published_at,
      generation_date: article.generation_date,
      trend_topic: article.trend_topic,
      trend_rank: article.trend_rank,
      trend_source_url: article.trend_source_url,
      trend_geo: article.trend_geo,
      content_cluster: article.content_cluster,
      primary_query: article.primary_query,
      canonical_parent: article.canonical_parent,
      keywords,
      sections,
      faqs,
      body: articleBody,
      full_text: articleBody,
    },
    article_body: articleBody,
    content: articleBody,
    facebook: { message, link: articleUrl, url: articleUrl },
  };
}

function buildArticleBody(title: unknown, excerpt: unknown, sections: GeneratedSection[], faqs: GeneratedFaq[]) {
  const sectionText = sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
  const faqText = faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");
  return [cleanText(title, 180), cleanText(excerpt, 400), sectionText, faqText ? `FAQs\n${faqText}` : ""]
    .filter(Boolean)
    .join("\n\n");
}

function makeWebhookHeaders() {
  const headers = new Headers({ "Content-Type": "application/json" });
  const bearerToken = Deno.env.get("MAKE_FACEBOOK_WEBHOOK_BEARER_TOKEN");
  const authHeader = Deno.env.get("MAKE_FACEBOOK_WEBHOOK_AUTH_HEADER");
  if (bearerToken) headers.set("Authorization", `Bearer ${bearerToken}`);
  if (authHeader?.includes(":")) {
    const [name, ...valueParts] = authHeader.split(":");
    const value = valueParts.join(":").trim();
    if (name.trim() && value) headers.set(name.trim(), value);
  }
  return headers;
}

function parseJsonMaybe(value: string) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return { text: value.slice(0, 1000) };
  }
}

async function generateDraftWithGemini({
  apiKey,
  model,
  opportunity,
  citations,
  localEvidence,
  existingArticles,
  dailyPublish,
}: {
  apiKey: string;
  model: string;
  opportunity: SeoOpportunity;
  citations: Citation[];
  localEvidence: LocalEvidence[];
  existingArticles: Array<Record<string, unknown>>;
  dailyPublish: boolean;
}) {
  const prompt = buildPrompt(opportunity, citations, localEvidence, existingArticles, dailyPublish);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.35, responseMimeType: "application/json" },
          }),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        const error = new Error(`Gemini request failed with ${response.status}: ${text.slice(0, 400)}`);
        if (attempt < 3 && isRetryableStatus(response.status)) {
          lastError = error;
          await delay(attempt * 4000);
          continue;
        }
        throw error;
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("\n")
        .trim();
      if (!text) throw new Error("Gemini returned no draft text.");
      return parseJsonFromModel(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Gemini request failed.");
      if (attempt < 3) {
        await delay(attempt * 4000);
        continue;
      }
    }
  }

  throw lastError ?? new Error("Gemini request failed.");
}

function buildPrompt(
  opportunity: SeoOpportunity,
  citations: Citation[],
  localEvidence: LocalEvidence[],
  existingArticles: Array<Record<string, unknown>>,
  dailyPublish: boolean,
) {
  const existingIntentMap = existingArticles.map((article) => ({
    title: article.title,
    primaryQuery: article.primary_query,
    intentKey: article.intent_key,
    status: article.status,
  }));

  return `
You are ${dailyPublish ? "preparing a concise public daily travel update" : "drafting—not publishing—an editorial travel update"} for Katpana Desert Tour, a local Skardu and Karakoram trip operator.

APPROVED SEO BRIEF
${JSON.stringify(opportunity, null, 2)}

EDITOR-SUPPLIED PUBLISHED SOURCES
${JSON.stringify(citations, null, 2)}

EDITOR-SUPPLIED LOCAL EVIDENCE
${JSON.stringify(localEvidence, null, 2)}

EXISTING EDITORIAL INTENTS (do not duplicate them)
${JSON.stringify(existingIntentMap, null, 2)}

Editorial rules:
- Answer only the approved primary search query and its distinctive angle.
- This update supports, and must not duplicate, the canonical parent ${opportunity.canonicalParent}.
- Never use a news, sports, celebrity, political, finance, health, or other unrelated hook.
- Do not invent road status, weather, opening dates, permit rules, prices, availability, journey times, safety assurances, guide experience, local observations, or source material.
- A changing factual claim may be used only when supported by the supplied sources or local evidence.
- Cite supplied published sources inline as [1], [2], and so on. Never cite a URL that was not supplied.
- If evidence is missing, explain the verification step a traveler should take; do not guess the answer.
- Do not give medical, legal, visa, rescue, or security guarantees. Recommend checking the responsible authority or qualified professional where relevant.
- Write in direct international English. Avoid hype such as "ultimate", "hidden gem", "paradise", and "unveiled".
- Make the introduction immediately answer the query. Do not write generic destination history.
- Include a useful route/booking next step that naturally points to the canonical parent, without keyword stuffing.
- Use original wording. Do not copy source text.

Return only JSON with this exact shape:
{
  "title": "Specific title, 45 to 68 characters",
  "excerpt": "Direct 140 to 220 character summary",
  "editorialSummary": "Two or three sentences explaining the unique intent, evidence used, and any gaps an editor must resolve",
  "sections": [
    { "heading": "Specific section heading", "body": "150 to 220 words with practical detail and inline source markers where supported" }
  ],
  "faqs": [
    { "question": "Question within this exact intent", "answer": "Concise evidence-aware answer" }
  ],
  "keywords": ["primary query", "closely related phrase"]
}

Output requirements:
- Provide 5 or 6 non-overlapping sections and 2 or 3 FAQs.
- Total excerpt and section copy must be at least 700 words.
- Provide 4 to 8 closely related keywords for internal editorial mapping only.
- Mention both ${opportunity.requiredLocationTerms.join(" and ")} naturally.
- Do not add a FAQ schema recommendation; FAQs are visible reader content only.
`;
}

function normalizeGeneratedDraft(value: unknown): GeneratedDraft {
  if (!isRecord(value)) throw new Error("Gemini JSON was not an object.");

  const title = cleanText(value.title, 90);
  const excerpt = cleanText(value.excerpt, 260);
  const editorialSummary = cleanText(value.editorialSummary, 600);
  const sections = normalizeSections(value.sections);
  const faqs = normalizeFaqs(value.faqs);
  const keywords = normalizeKeywords(value.keywords);

  if (!title || !excerpt || !editorialSummary || sections.length < 5 || faqs.length < 2) {
    throw new Error("Draft is missing the required title, excerpt, editorial summary, sections, or FAQs.");
  }
  return { title, excerpt, editorialSummary, sections, faqs, keywords };
}

function ensureDailyCitationMarker(draft: GeneratedDraft, citations: Citation[]) {
  if (!citations.length) return draft;
  const text = [draft.title, draft.excerpt, ...draft.sections.map((section) => section.body)].join(" ");
  if (/\[\d+\]/.test(text)) return draft;
  return {
    ...draft,
    sections: draft.sections.map((section, index) => index === 0
      ? { ...section, body: `${section.body} [1]` }
      : section),
  };
}

function validateGeneratedDraft(draft: GeneratedDraft, opportunity: SeoOpportunity, citations: Citation[]) {
  const text = [draft.title, draft.excerpt, ...draft.sections.map((section) => `${section.heading} ${section.body}`)].join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 700) throw new Error(`Draft is too thin (${wordCount} words; minimum 700).`);
  if (draft.title.length < 35 || draft.title.length > 75) {
    throw new Error("Draft title must be specific and stay between 35 and 75 characters.");
  }
  if (draft.excerpt.length < 120 || draft.excerpt.length > 240) {
    throw new Error("Draft excerpt must answer the query in 120 to 240 characters.");
  }

  const titleText = draft.title.toLowerCase();
  const queryTokens = opportunity.primaryQuery
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !["is", "of", "to", "the", "and", "for", "travel", "planning", "update", "status"].includes(token));
  const matchingTitleTokens = queryTokens.filter((token) => titleText.includes(token));
  if (matchingTitleTokens.length < Math.min(2, queryTokens.length)) {
    throw new Error("Draft title is too generic for the approved primary query.");
  }
  if (/\b(ultimate|unveiled|paradise|hidden gem)\b/i.test(draft.title)) {
    throw new Error("Draft title uses generic travel hype instead of a specific search intent.");
  }

  const normalizedText = text.toLowerCase();
  const missingLocation = opportunity.requiredLocationTerms.find((term) => !normalizedText.includes(term.toLowerCase()));
  if (missingLocation) throw new Error(`Draft left the approved topic: missing ${missingLocation}.`);

  const offTopicPattern = /\b(fifa|football match|cricket match|celebrity|cryptocurrency|stock market|election campaign|political party|lottery|showbiz)\b/i;
  if (offTopicPattern.test(text)) throw new Error("Draft contains an unsafe or unrelated trend hook.");

  const unsupportedFreshClaim = /\b(?:is|are|remains?|has been)\s+(?:now\s+|currently\s+)?(?:open|closed|blocked|operational|available|suspended)\b|\b(?:fee|fare|price|cost)\s+(?:is|starts? at)\s+(?:PKR|USD|Rs\.?|\$)/i;
  if (!citations.length && unsupportedFreshClaim.test(text)) {
    throw new Error("Draft states a changing fact without an editor-supplied citation.");
  }
  const citationMarkers = [...text.matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1]));
  if (!citations.length && citationMarkers.length) {
    throw new Error("Draft invented a citation marker when no source was supplied.");
  }
  if (citationMarkers.some((marker) => marker < 1 || marker > citations.length)) {
    throw new Error("Draft cited a source number that was not supplied by the editor.");
  }
  if (citations.length && !citationMarkers.length) {
    throw new Error("Draft received citations but did not cite them inline.");
  }
}

function normalizeSections(value: unknown): GeneratedSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const heading = cleanText(item.heading, 110);
      const body = cleanText(item.body, 2400);
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
      const answer = cleanText(item.answer, 800);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is GeneratedFaq => Boolean(item))
    .slice(0, 3);
}

function normalizeKeywords(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => cleanText(item, 70)).filter(Boolean))].slice(0, 8);
}

function normalizeCitations(value: unknown): Citation[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = cleanText(item.title, 180);
      const publisher = cleanText(item.publisher, 120);
      const url = cleanText(item.url, 600);
      const accessedAt = cleanDate(item.accessed_at ?? item.accessedAt);
      const notes = cleanText(item.notes, 500);
      if (!title || !publisher || !isHttpsUrl(url) || !accessedAt) return null;
      return { id: cleanText(item.id, 40) || String(index + 1), title, publisher, url, accessed_at: accessedAt, ...(notes ? { notes } : {}) };
    })
    .filter((item): item is Citation => Boolean(item))
    .slice(0, 8);
}

function normalizeLocalEvidence(value: unknown): LocalEvidence[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const type = cleanText(item.type, 30);
      const description = cleanText(item.description, 800);
      const observedAt = cleanDate(item.observed_at ?? item.observedAt);
      const location = cleanText(item.location, 120);
      const verifiedBy = cleanText(item.verified_by ?? item.verifiedBy, 120);
      if (!isEvidenceType(type) || !description || !observedAt || !location || !verifiedBy) return null;
      return {
        id: cleanText(item.id, 40) || `local-${index + 1}`,
        type,
        description,
        observed_at: observedAt,
        location,
        verified_by: verifiedBy,
      };
    })
    .filter((item): item is LocalEvidence => Boolean(item))
    .slice(0, 8);
}

async function uniqueSlug(supabase: ReturnType<typeof createClient>, preferredSlug: string) {
  let candidate = preferredSlug;
  for (let index = 1; index <= 10; index += 1) {
    const { data, error } = await supabase.from("trending_articles").select("slug").eq("slug", candidate).maybeSingle();
    if (error) throw new Error(`Could not check slug uniqueness: ${error.message}`);
    if (!data) return candidate;
    candidate = `${preferredSlug}-${index + 1}`;
  }
  return `${preferredSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

async function readRequestPayload(request: Request): Promise<RequestPayload> {
  const text = await request.text();
  if (!text.trim()) return {};
  const value = JSON.parse(text);
  if (!isRecord(value)) throw new Error("Request body must be a JSON object.");
  return value;
}

function parseJsonFromModel(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Gemini response did not contain a JSON object.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength).trim() : "";
}

function cleanDate(value: unknown) {
  const text = cleanText(value, 40);
  if (!text || Number.isNaN(Date.parse(text))) return "";
  return new Date(text).toISOString();
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isEvidenceType(value: string): value is LocalEvidence["type"] {
  return ["field-check", "guide-note", "operator-record", "traveler-question"].includes(value);
}

function getKarachiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function dayOfYear(dateOnly: string) {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
}

function addDays(dateOnly: string, days: number) {
  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isRetryableStatus(status: number) {
  return [429, 500, 502, 503, 504].includes(status);
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function readBearerToken(value: string | null) {
  return value?.replace(/^Bearer\s+/i, "") ?? null;
}

function getSupabaseAdminKeyError(value: string | null | undefined) {
  if (!value) return "Missing key.";
  if (value.startsWith("sb_publishable_")) return "Publishable keys cannot create editorial drafts. Use a service_role JWT or sb_secret key.";
  if (value.startsWith("sb_secret_")) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload?.role === "service_role" ? null : "JWT role was not service_role.";
  } catch {
    return "Could not parse the configured key.";
  }
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
