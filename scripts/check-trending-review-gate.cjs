const assert = require("node:assert/strict");
const { isTrendingReviewCurrent } = require("./sync-trending-archive.cjs");

const referenceDate = new Date("2026-08-10T23:30:00.000Z");

assert.equal(isTrendingReviewCurrent("2026-08-09", referenceDate), false, "past review dates must be excluded");
assert.equal(isTrendingReviewCurrent("2026-08-10", referenceDate), true, "the review date remains current through that UTC date");
assert.equal(isTrendingReviewCurrent("2026-08-11", referenceDate), true, "future review dates must remain eligible");
assert.equal(isTrendingReviewCurrent("2026-02-30", referenceDate), false, "invalid calendar dates must be excluded");
assert.equal(isTrendingReviewCurrent("not-a-date", referenceDate), false, "invalid review values must be excluded");
assert.equal(isTrendingReviewCurrent("2026-08-11", new Date("invalid")), false, "invalid reference dates must fail closed");

console.log("Trending review-date gate passed.");
