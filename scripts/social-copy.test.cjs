const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { generateCopy, validateCopy } = require("./social-copy.cjs");
const { freshCandidates, parseFeed } = require("./daily-social-content.cjs");
const { resolvePost, briefFor } = require("./reel-topic.cjs");

test("hashtags and useful advice follow the destination and subject", () => {
  const cases = [
    ["Hunza winter travel", "winter", "#WinterTravel", "#Hunza"],
    ["Shigar Fort heritage travel", "heritage", "#HeritageTravel", "#Shigar"],
    ["Kachura lake travel", "lakes", "#LakePhotography", "#Kachura"],
    ["K2 base camp trekking", "trekking", "#TrekkingPakistan", "#K2"],
    ["Katpana desert travel", "desert", "#ColdDesert", "#Katpana"],
    ["Skardu road closure after winter snowfall", "transport", "#TravelPlanning", "#Skardu"],
  ];
  for (const [title, angle, subjectTag, placeTag] of cases) {
    const copy = generateCopy({ title, url: "https://example.com/a" }, [], "2026-11-16");
    assert.equal(copy.angle, angle);
    assert.ok(copy.hashtags.includes(subjectTag));
    assert.ok(copy.hashtags.includes(placeTag));
    assert.equal(new Set(copy.hashtags).size, copy.hashtags.length);
    assert.ok(copy.hashtags.length <= 5);
    assert.notEqual(copy.caption, copy.reelCaption);
    assert.doesNotMatch(copy.caption + copy.reelCaption, /#viral|trending now|road closure|snowfall/i);
    assert.equal(validateCopy(copy), copy);
  }
});

test("history prevents repeated topics and both caption formats", () => {
  const candidate = { title: "Hunza winter travel", url: "https://example.com/a" };
  const history = [];
  for (let day = 0; day < 24; day++) {
    const copy = generateCopy(candidate, history, `2026-12-${String(day + 1).padStart(2, "0")}`);
    assert.ok(!history.some((item) => item.topic === copy.topic || item.caption === copy.caption || item.reelCaption === copy.reelCaption));
    history.push(copy);
  }
  assert.throws(() => generateCopy(candidate, history, "2026-12-25"), /No unused angle/);
});

test("the actual Google Trends subject can qualify using its related travel headline", () => {
  const items = parseFeed('<rss><item><title>Skardu</title><link>https://trends.google.com/trend/skardu</link><pubDate>Mon, 16 Nov 2026 02:00:00 GMT</pubDate><ht:news_item><ht:news_item_title><![CDATA[Skardu winter travel guide]]></ht:news_item_title></ht:news_item></item></rss>', "search-trend");
  assert.equal(freshCandidates(items, [], new Date("2026-11-16T03:00:00Z")).length, 1);
  assert.equal(items[0].kind, "search-trend");
  assert.equal(freshCandidates([{ ...items[0], context: "Pakistan cricket result" }], [], new Date("2026-11-16T03:00:00Z")).length, 0);
});

test("syndicated news duplicates are skipped and less-used destinations get priority", () => {
  const base = { publishedAt: "2026-11-16T02:00:00Z", kind: "recent-travel-news" };
  const history = [{ topic: "Skardu travel checklist", sourceTitle: "Hunza winter travel - First Publisher", destination: "Skardu" }];
  const items = [
    { ...base, title: "Skardu mountain travel", url: "https://example.com/a" },
    { ...base, title: "Hunza winter travel - Second Publisher", url: "https://example.com/b" },
    { ...base, title: "Shigar heritage travel", url: "https://example.com/c" },
  ];
  assert.deepEqual(freshCandidates(items, history, new Date("2026-11-16T03:00:00Z")).map((item) => item.url), ["https://example.com/c", "https://example.com/a"]);
});

test("a search trend takes priority over news and stale or future items never qualify", () => {
  const item = { title: "Hunza winter travel", url: "https://example.com/a", publishedAt: "2026-11-16T02:00:00Z", kind: "recent-travel-news" };
  const items = [item, { ...item, title: "Skardu winter travel", url: "https://example.com/b", kind: "search-trend" },
    { ...item, url: "https://example.com/old", publishedAt: "2026-11-01" },
    { ...item, url: "https://example.com/future", publishedAt: "2026-11-19" }];
  assert.deepEqual(freshCandidates(items, [], new Date("2026-11-16T03:00:00Z")).map((entry) => entry.kind), ["search-trend", "recent-travel-news"]);
});

test("the reel receives its own caption and all three topic-specific scenes", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-social-copy-"));
  const file = path.join(directory, "post.json");
  try {
    const copy = generateCopy({ title: "Shigar heritage travel", url: "https://example.com/a" }, [], "2026-11-16");
    fs.writeFileSync(file, JSON.stringify({ title: copy.topic, message: copy.caption, reel_caption: copy.reelCaption, scene_texts: copy.sceneTexts }));
    const post = resolvePost({ post: file, date: "2026-11-16" });
    assert.equal(post.caption, copy.reelCaption);
    assert.deepEqual(briefFor(post).scenePlan.map((scene) => scene.text), copy.sceneTexts);
    fs.writeFileSync(file, JSON.stringify({ title: copy.topic, scene_texts: ["one"] }));
    assert.throws(() => resolvePost({ post: file }), /three short/);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
