const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseFeed, freshCandidates, nextDate, captionFor, validateCopy } = require("./daily-social-content.cjs");

test("RSS titles are data, not executable markup", () => {
  const result = parseFeed('<rss><item><title><![CDATA[Skardu travel &amp; mountain views]]></title><link>https://example.com/item</link><pubDate>Fri, 13 Nov 2026 04:00:00 GMT</pubDate></item></rss>', "recent-travel-news");
  assert.equal(result[0].title, "Skardu travel & mountain views");
});

test("only fresh, unused, travel-related topics qualify", () => {
  const base = { url: "https://example.com/a", publishedAt: "2026-11-13T04:00:00Z", kind: "recent-travel-news" };
  const items = [
    { ...base, title: "Hunza valley travel" },
    { ...base, url: "https://example.com/b", title: "Pakistan cricket travel" },
    { ...base, url: "https://example.com/c", title: "Skardu travel", publishedAt: "2026-09-01" },
  ];
  assert.equal(freshCandidates(items, [], new Date("2026-11-13T12:00:00Z")).length, 1);
  assert.equal(freshCandidates(items, [{ sourceUrl: base.url }], new Date("2026-11-13T12:00:00Z")).length, 0);
});

test("preparation targets the next Pakistan 9 AM slot", () => {
  assert.equal(nextDate(new Date("2026-11-13T02:37:00Z")), "2026-11-13");
  assert.equal(nextDate(new Date("2026-11-13T04:00:00Z")), "2026-11-14");
});

test("public captions reject credits, stale copy and invented conditions", () => {
  const valid = { topic: "Hunza travel ideas", caption: "Which Hunza view is on your wish list? Message Katpana Desert to plan your journey. #Hunza" };
  assert.deepEqual(validateCopy(valid), valid);
  assert.throws(() => validateCopy({ ...valid, caption: valid.caption + " Photo: Someone" }), /unwanted/);
  assert.throws(() => validateCopy(valid, [valid]), /repeats/);
  assert.throws(() => validateCopy({ ...valid, caption: "The road is open and guaranteed safe for today's mountain adventure!" }), /unsupported/);
});

test("clean captions keep only the travel hook, invitation and hashtags", () => {
  for (let seed = 0; seed < 8; seed++) {
    const caption = captionFor("Askole winter trip ideas", seed);
    assert.ok(caption.includes("Askole"));
    assert.doesNotMatch(caption, /photo:|music:|source:|visuals:|pexels|creativecommons/i);
    validateCopy({ topic: "Askole winter trip ideas", caption });
  }
});
