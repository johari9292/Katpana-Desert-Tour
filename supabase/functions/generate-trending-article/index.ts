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

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: existingArticles, error: existingError } = await supabase
      .from("trending_articles")
      .select("id,slug,title,status,intent_key,primary_query")
      .not("intent_key", "is", null);

    if (existingError) {
      return jsonResponse({
        error: "Could not load existing editorial intents",
        details: existingError.message,
        hint: "Apply the 202608100001 trending editorial workflow migration before deploying this function.",
      }, 500);
    }

    const requestedIntentKey = cleanText(payload.intentKey, 100);
    const selected = selectOpportunity(requestedIntentKey, existingArticles ?? []);
    if (selected.error) return jsonResponse(selected.error, selected.status);
    if (!selected.opportunity) {
      return jsonResponse({
        status: "skipped",
        reason: "editorial_catalog_complete",
        message: "Every approved SEO intent already has a canonical row. Update an existing article instead of generating another page.",
      });
    }

    const citations = normalizeCitations(payload.citations);
    const localEvidence = normalizeLocalEvidence(payload.localEvidence);
    const opportunity = selected.opportunity;
    const rawDraft = await generateDraftWithGemini({
      apiKey: geminiApiKey,
      model: geminiModel,
      opportunity,
      citations,
      localEvidence,
      existingArticles: existingArticles ?? [],
    });
    const draft = normalizeGeneratedDraft(rawDraft);
    validateGeneratedDraft(draft, opportunity, citations);

    const generationDate = getKarachiDate();
    const slug = await uniqueSlug(supabase, opportunity.slug);
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
        status: "draft",
        published_at: null,
        generation_date: generationDate,
      })
      .select("id,slug,title,status,intent_key,content_cluster,primary_query,canonical_parent,generation_date")
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

    return jsonResponse({
      status: "draft_created",
      article: insertedDraft,
      autoPublished: false,
      evidenceReceived: { citations: citations.length, localEvidence: localEvidence.length },
      reviewRequired: [
        "Confirm the page answers a distinct query and does not cannibalize its canonical parent.",
        "Replace or verify every time-sensitive claim using cited sources.",
        "Add at least one named, dated local evidence record.",
        "Complete a human copy, safety, accessibility, and conversion review.",
        "Use approve_trending_article only after every gate passes.",
      ],
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

async function generateDraftWithGemini({
  apiKey,
  model,
  opportunity,
  citations,
  localEvidence,
  existingArticles,
}: {
  apiKey: string;
  model: string;
  opportunity: SeoOpportunity;
  citations: Citation[];
  localEvidence: LocalEvidence[];
  existingArticles: Array<Record<string, unknown>>;
}) {
  const prompt = buildPrompt(opportunity, citations, localEvidence, existingArticles);
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
) {
  const existingIntentMap = existingArticles.map((article) => ({
    title: article.title,
    primaryQuery: article.primary_query,
    intentKey: article.intent_key,
    status: article.status,
  }));

  return `
You are drafting—not publishing—an editorial travel update for Katpana Desert Tour, a local Skardu and Karakoram trip operator.

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
