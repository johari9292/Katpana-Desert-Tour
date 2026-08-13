import { isTrendingReviewCurrent, type ArchivedSeoSignal, type TrendingArticle } from "./trending";

// This file is intentionally empty until an editor approves a Supabase draft.
// `npm run sync:trending-archive` writes only rows that pass the editorial gate.
const approvedStaticTrendingArticles: TrendingArticle[] = [];

// A previously exported row can expire even when a later build has no database
// credentials. Filter again at build time so stale pages cannot reach the hub
// or sitemap.
export const staticTrendingArticles = approvedStaticTrendingArticles.filter((article) =>
  isTrendingReviewCurrent(article.next_review_at)
);

export function getStaticTrendingArticle(slug: string) {
  return staticTrendingArticles.find((article) => article.slug === slug);
}

// Archived AI copy is not republished. These aggregates select the strongest
// existing canonical SEO guides without creating duplicate indexable URLs.
export const archivedSeoSignals: ArchivedSeoSignal[] = [
  {
    "targetPath": "/blog/best-time-to-visit-skardu",
    "matchingArticleCount": 14,
    "latestGenerationDate": "2026-08-09"
  },
  {
    "targetPath": "/skardu-travel-guide",
    "matchingArticleCount": 13,
    "latestGenerationDate": "2026-08-05"
  },
  {
    "targetPath": "/blog/skardu-weather-month-by-month",
    "matchingArticleCount": 9,
    "latestGenerationDate": "2026-08-10"
  },
  {
    "targetPath": "/blog/things-to-do-skardu-summer",
    "matchingArticleCount": 3,
    "latestGenerationDate": "2026-07-30"
  },
  {
    "targetPath": "/karakoram-highway-travel",
    "matchingArticleCount": 3,
    "latestGenerationDate": "2026-07-27"
  }
];
