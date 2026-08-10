const fs = require("fs");
const path = require("path");

const root = process.cwd();
const sourceRoots = ["app", "components", "lib", "data"];
const extensions = new Set([".ts", ".tsx", ".js", ".cjs", ".mjs"]);
const failures = [];

function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return [];
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) return [relativePath];

  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) =>
    walk(path.join(relativePath, entry.name))
  );
}

const files = sourceRoots
  .flatMap(walk)
  .filter((file) => extensions.has(path.extname(file)));

const bannedPatterns = [
  [/["']FAQPage["']/, "FAQPage schema is disabled unless Google eligibility and visible-content rules are re-audited"],
  [/["']SearchAction["']/, "SearchAction is not eligible for the retired sitelinks search box"],
  [/aggregateRating\s*:/, "Aggregate ratings require reconciled, visible first-party evidence"],
  [/reviewRating\s*:/, "Review schema requires reconciled, visible first-party evidence"],
  [/priceCurrency\s*:/, "Offer pricing must not be emitted until a real price and currency exist"],
  [/availability\s*:/, "Availability must not be invented in structured data"],
  [/openingHours/, "Business hours must not be emitted until verified"],
];

for (const file of files) {
  const content = fs.readFileSync(path.join(root, file), "utf8");

  for (const [pattern, reason] of bannedPatterns) {
    if (pattern.test(content)) failures.push(`${file}: ${reason}`);
  }

  for (const match of content.matchAll(/<main\b[\s\S]*?>/g)) {
    const tag = match[0];
    if (!/id=["']main-content["']/.test(tag)) failures.push(`${file}: page-level <main> is missing id="main-content"`);
    if (!/tabIndex=\{-1\}/.test(tag)) failures.push(`${file}: #main-content is missing tabIndex={-1}`);
  }

  for (const match of content.matchAll(/<(?:a|TrackedLink)\b[\s\S]*?target=["']_blank["'][\s\S]*?>/g)) {
    if (!/rel=["'][^"']*(?:noopener|noreferrer)[^"']*["']/.test(match[0])) {
      failures.push(`${file}: target="_blank" link is missing noopener/noreferrer`);
    }
  }

  for (const match of content.matchAll(/className=["'`][^"'`]*bg-\[#25D366\][^"'`]*["'`]/g)) {
    if (!/text-skardu-void/.test(match[0])) failures.push(`${file}: WhatsApp green control needs dark text contrast`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "app", "sitemap.xml", "route.ts"), "utf8");
if (!/reviewedArticles/.test(sitemap)) failures.push("sitemap: generated article drafts must be filtered through reviewedArticles");
if (/entry\(["']\/search/.test(sitemap)) failures.push("sitemap: noindex search route must not be listed");

const trendingArchive = fs.readFileSync(path.join(root, "data", "trending-static.ts"), "utf8");
if (!/TrendingArticle/.test(trendingArchive)) failures.push("trending archive: typed editorial archive export is missing");
if (!/isTrendingReviewCurrent/.test(trendingArchive)) failures.push("trending archive: expired review dates must be filtered at build time");

if (failures.length) {
  console.error(`SEO integrity check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO integrity check passed across ${files.length} source files.`);
