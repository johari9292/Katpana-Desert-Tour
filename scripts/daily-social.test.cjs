const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseFeed, freshCandidates, nextDate, captionFor, validateCopy } = require("./daily-social-content.cjs");
const { photoFromPage, creditsFor, selectPhotos, destinationFor } = require("./social-photos.cjs");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function photoPage(id, overrides = {}) {
  return { pageid: id, title: `File:Hunza valley ${id}.jpg`, imageinfo: [{ mime: "image/jpeg", width: 2000, height: 1400,
    sha1: `original-${id}`, url: `https://upload.wikimedia.org/test-${id}.jpg`, descriptionurl: `https://commons.wikimedia.org/wiki/File:Hunza_${id}.jpg`,
    extmetadata: { LicenseShortName: { value: "CC BY 4.0" }, LicenseUrl: { value: "https://creativecommons.org/licenses/by/4.0/" }, Artist: { value: "<a>Test Photographer</a>" } }, ...overrides }] };
}

test("photo selection requires destination, usable dimensions and known commercial licence", () => {
  assert.equal(destinationFor("Hunza: travel planning"), "Hunza");
  assert.throws(() => destinationFor("Unrelated travel"), /destination/);
  assert.equal(photoFromPage(photoPage(1), "Hunza").author, "Test Photographer");
  assert.equal(photoFromPage(photoPage(1), "Skardu"), null);
  assert.equal(photoFromPage(photoPage(1, { width: 200 }), "Hunza"), null);
  assert.equal(photoFromPage(photoPage(1, { extmetadata: { LicenseShortName: { value: "All rights reserved" } } }), "Hunza"), null);
  assert.equal(photoFromPage({ ...photoPage(1), title: "File:Hunza AI-generated.jpg" }, "Hunza"), null);
  assert.match(creditsFor([photoFromPage(photoPage(1), "Hunza")]), /Test Photographer; CC BY 4.0.*creativecommons.*commons\.wikimedia/);
});

test("ambiguous K2 names never admit planet illustrations or military photographs", () => {
  const mountain = { ...photoPage(10), title: "File:K2 2006.jpg" };
  mountain.imageinfo[0].extmetadata.ImageDescription = { value: "K2 mountain in the Karakoram" };
  assert.ok(photoFromPage(mountain, "K2"));
  assert.equal(photoFromPage({ ...mountain, title: "File:Surface of K2-18 B.jpg" }, "K2"), null);
  assert.equal(photoFromPage({ ...mountain, title: "File:K2 Black Panther 20161106.jpg" }, "K2"), null);
  assert.equal(photoFromPage({ ...photoPage(11), title: "File:K2 unknown.jpg" }, "K2"), null);
});

test("downloads distinct photos and excludes previously used originals", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-photos-"));
  try {
    const fetcher = async (url) => {
      if (String(url).includes("api.php")) return { ok: true, json: async () => ({ query: { pages: Object.fromEntries([1, 2, 3, 4, 5, 6].map((id) => [id, photoPage(id)])) } }) };
      const id = Number(String(url).match(/test-(\d+)/)[1]);
      return new Response(Buffer.from([0xff, 0xd8, id, 0xff, 0xd9]), { headers: { "content-type": "image/jpeg" } });
    };
    const photos = await selectPhotos({ topic: "Hunza travel", date: "2026-11-15", directory, history: [{ photos: [{ originalSha1: "original-1" }] }], fetcher });
    assert.equal(photos.length, 4);
    assert.equal(new Set(photos.map((photo) => photo.contentHash)).size, 4);
    assert.ok(photos.every((photo) => photo.originalSha1 !== "original-1" && fs.existsSync(photo.path)));
    await assert.rejects(selectPhotos({ topic: "Hunza travel", date: "2026-11-16", directory, history: [{ photos }], fetcher }), /unused licensed/);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test("RSS titles are data, not executable markup", () => {
  const result = parseFeed('<rss><item><title><![CDATA[Skardu travel &amp; mountain views]]></title><link>https://example.com/item</link><pubDate>Fri, 13 Nov 2026 04:00:00 GMT</pubDate></item></rss>', "recent-travel-news");
  assert.equal(result[0].title, "Skardu travel & mountain views");
});

test("photo search continues when the first page contains no reusable photographs", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-photo-pages-"));
  const searches = [];
  try {
    const fetcher = async (url) => {
      const request = new URL(url);
      if (request.pathname.includes("api.php")) {
        searches.push(request.searchParams.get("gsroffset"));
        return { ok: true, json: async () => request.searchParams.has("gsroffset")
          ? { query: { pages: Object.fromEntries([2, 3, 4, 5].map((id) => [id, photoPage(id)])) } }
          : { continue: { gsroffset: 50, continue: "gsroffset||" }, query: { pages: { 1: photoPage(1, { width: 200 }) } } } };
      }
      const id = Number(request.pathname.match(/test-(\d+)/)[1]);
      return new Response(Buffer.from([0xff, 0xd8, id, 0xff, 0xd9]), { headers: { "content-type": "image/jpeg" } });
    };
    const photos = await selectPhotos({ topic: "Hunza travel", date: "2026-11-16", directory, fetcher });
    assert.equal(photos.length, 4);
    assert.deepEqual(searches, [null, "50"]);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
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

test("public captions allow attribution and reject repeated copy and invented conditions", () => {
  const valid = { topic: "Hunza travel ideas", caption: "Which Hunza view is on your wish list? Message Katpana Desert to plan your journey. #Hunza" };
  assert.deepEqual(validateCopy(valid), valid);
  assert.ok(validateCopy({ ...valid, caption: valid.caption + " Photo: Someone; CC BY 4.0" }));
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
