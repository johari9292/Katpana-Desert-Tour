const assert = require("node:assert/strict");
const { buildArchivedSeoSignals, isTrendingReviewCurrent } = require("./sync-trending-archive.cjs");
const { isSupabaseAdminKey, resolveSupabaseAdminKey } = require("./supabase-admin-key.cjs");

const referenceDate = new Date("2026-08-10T23:30:00.000Z");

assert.equal(isTrendingReviewCurrent("2026-08-09", referenceDate), false, "past review dates must be excluded");
assert.equal(isTrendingReviewCurrent("2026-08-10", referenceDate), true, "the review date remains current through that UTC date");
assert.equal(isTrendingReviewCurrent("2026-08-11", referenceDate), true, "future review dates must remain eligible");
assert.equal(isTrendingReviewCurrent("2026-02-30", referenceDate), false, "invalid calendar dates must be excluded");
assert.equal(isTrendingReviewCurrent("not-a-date", referenceDate), false, "invalid review values must be excluded");
assert.equal(isTrendingReviewCurrent("2026-08-11", new Date("invalid")), false, "invalid reference dates must fail closed");

const serviceRoleJwt = createTestJwt("service_role");
const anonJwt = createTestJwt("anon");

assert.equal(isSupabaseAdminKey("sb_secret_test"), true, "secret keys must be accepted as admin keys");
assert.equal(isSupabaseAdminKey("sb_publishable_test"), false, "publishable keys must not pass the admin gate");
assert.equal(isSupabaseAdminKey(serviceRoleJwt), true, "legacy service-role JWTs must remain supported");
assert.equal(isSupabaseAdminKey(anonJwt), false, "anon JWTs must not pass the admin gate");
assert.equal(
  resolveSupabaseAdminKey({ SUPABASE_SECRET_KEY: "sb_secret_preferred", SUPABASE_SERVICE_ROLE_KEY: anonJwt }),
  "sb_secret_preferred",
  "the current secret-key format must take priority over a mislabeled legacy key",
);
assert.throws(
  () => resolveSupabaseAdminKey({ SUPABASE_SERVICE_ROLE_KEY: anonJwt }),
  /does not contain a Supabase admin key/,
  "a configured anon key must fail loudly instead of returning an empty editorial archive",
);

const archivedSignals = buildArchivedSeoSignals([
  archivedRow("Weather planning for Skardu", "weather", "2026-08-10", 4),
  archivedRow("Skardu monsoon travel", "rain", "2026-08-09", 2),
  archivedRow("Skardu road trip budget", "petrol prices", "2026-08-08", 5),
  archivedRow("Solar eclipse over Skardu", "solar eclipse", "2026-08-07", 1),
]);

assert.deepEqual(
  archivedSignals.map(({ targetPath, matchingArticleCount }) => ({ targetPath, matchingArticleCount })),
  [
    { targetPath: "/blog/skardu-weather-month-by-month", matchingArticleCount: 2 },
    { targetPath: "/karakoram-highway-travel", matchingArticleCount: 1 },
  ],
  "archive signals must consolidate relevant topics and exclude unrelated trend hooks",
);

console.log("Trending review-date gate passed.");

function createTestJwt(role) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ role })}.test-signature`;
}

function archivedRow(title, trendTopic, generationDate, trendRank) {
  return {
    title,
    trend_topic: trendTopic,
    trend_rank: trendRank,
    generation_date: generationDate,
    keywords: [],
    status: "archived",
  };
}
