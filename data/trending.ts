export interface TrendingArticleSection {
  heading: string;
  body: string;
}

export interface TrendingArticleFaq {
  question: string;
  answer: string;
}

export interface TrendingArticleCitation {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed_at: string;
  notes?: string;
}

export interface TrendingArticleLocalEvidence {
  id: string;
  type: "field-check" | "guide-note" | "operator-record" | "traveler-question";
  description: string;
  observed_at: string;
  location: string;
  verified_by: string;
}

export interface TrendingArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  sections: TrendingArticleSection[];
  faqs: TrendingArticleFaq[];
  keywords: string[];
  trend_topic: string;
  trend_rank: number | null;
  trend_source_url: string | null;
  trend_geo: string;
  content_cluster: string;
  search_intent: string;
  primary_query: string;
  intent_key: string;
  canonical_parent: string;
  editorial_summary: string;
  citations: TrendingArticleCitation[];
  local_evidence: TrendingArticleLocalEvidence[];
  status: "published";
  reviewed_by: string;
  reviewed_at: string;
  last_verified_at: string;
  next_review_at: string;
  published_at: string;
  generation_date: string;
  updated_at: string;
}

export interface TrendingArticleRow
  extends Omit<
    TrendingArticle,
    "sections" | "faqs" | "keywords" | "citations" | "local_evidence" | "status"
  > {
  sections: unknown;
  faqs: unknown;
  keywords: unknown;
  citations: unknown;
  local_evidence: unknown;
  status?: unknown;
}

/**
 * Travel-condition pages leave the public archive when their scheduled review
 * date has passed. Date-only comparison keeps the result stable across build
 * server time zones.
 */
export function isTrendingReviewCurrent(nextReviewAt: string, referenceDate = new Date()) {
  if (Number.isNaN(referenceDate.getTime())) return false;
  const reviewDate = validIsoDate(nextReviewAt);
  const currentDate = validIsoDate(referenceDate.toISOString());

  return Boolean(reviewDate && currentDate && reviewDate >= currentDate);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function normalizeTrendingArticle(row: TrendingArticleRow): TrendingArticle {
  return {
    ...row,
    sections: normalizeSections(row.sections),
    faqs: normalizeFaqs(row.faqs),
    keywords: normalizeStrings(row.keywords),
    citations: normalizeCitations(row.citations),
    local_evidence: normalizeLocalEvidence(row.local_evidence),
    status: "published"
  };
}

function normalizeSections(value: unknown): TrendingArticleSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const heading = typeof item.heading === "string" ? item.heading.trim() : "";
      const body = typeof item.body === "string" ? item.body.trim() : "";
      return heading && body ? { heading, body } : null;
    })
    .filter((item): item is TrendingArticleSection => Boolean(item));
}

function normalizeFaqs(value: unknown): TrendingArticleFaq[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const question = typeof item.question === "string" ? item.question.trim() : "";
      const answer = typeof item.answer === "string" ? item.answer.trim() : "";
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is TrendingArticleFaq => Boolean(item));
}

function normalizeCitations(value: unknown): TrendingArticleCitation[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = readString(item.title);
      const publisher = readString(item.publisher);
      const url = readString(item.url);
      const accessed_at = readString(item.accessed_at);
      const id = readString(item.id) || String(index + 1);
      const notes = readString(item.notes);

      if (!title || !publisher || !isHttpsUrl(url) || !accessed_at) return null;
      return { id, title, publisher, url, accessed_at, ...(notes ? { notes } : {}) };
    })
    .filter((item): item is TrendingArticleCitation => Boolean(item));
}

function normalizeLocalEvidence(value: unknown): TrendingArticleLocalEvidence[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const rawType = readString(item.type);
      const type = isEvidenceType(rawType) ? rawType : null;
      const description = readString(item.description);
      const observed_at = readString(item.observed_at);
      const location = readString(item.location);
      const verified_by = readString(item.verified_by);
      const id = readString(item.id) || `local-${index + 1}`;

      if (!type || !description || !observed_at || !location || !verified_by) return null;
      return { id, type, description, observed_at, location, verified_by };
    })
    .filter((item): item is TrendingArticleLocalEvidence => Boolean(item));
}

function normalizeStrings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim())
    : [];
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isEvidenceType(value: string): value is TrendingArticleLocalEvidence["type"] {
  return ["field-check", "guide-note", "operator-record", "traveler-question"].includes(value);
}

function validIsoDate(value: string) {
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!dateOnly) return null;

  const parsed = new Date(`${dateOnly}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateOnly
    ? null
    : dateOnly;
}
