import { isTrendingReviewCurrent, type TrendingArticle } from "./trending";

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
