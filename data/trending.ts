export interface TrendingArticleSection {
  heading: string;
  body: string;
}

export interface TrendingArticleFaq {
  question: string;
  answer: string;
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
  published_at: string;
  generation_date: string;
}

export interface TrendingArticleRow extends Omit<TrendingArticle, "sections" | "faqs" | "keywords"> {
  sections: unknown;
  faqs: unknown;
  keywords: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function normalizeTrendingArticle(row: TrendingArticleRow): TrendingArticle {
  return {
    ...row,
    sections: normalizeSections(row.sections),
    faqs: normalizeFaqs(row.faqs),
    keywords: Array.isArray(row.keywords) ? row.keywords.filter((item): item is string => typeof item === "string") : []
  };
}

function normalizeSections(value: unknown): TrendingArticleSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const heading = typeof item.heading === "string" ? item.heading : "";
      const body = typeof item.body === "string" ? item.body : "";
      return heading && body ? { heading, body } : null;
    })
    .filter((item): item is TrendingArticleSection => Boolean(item));
}

function normalizeFaqs(value: unknown): TrendingArticleFaq[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const question = typeof item.question === "string" ? item.question : "";
      const answer = typeof item.answer === "string" ? item.answer : "";
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is TrendingArticleFaq => Boolean(item));
}

