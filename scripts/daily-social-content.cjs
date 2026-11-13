const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { callMake } = require("./make-mcp.cjs");
const { pakistanDate, checkedDate } = require("./reel-topic.cjs");
const { render } = require("./create-topic-reel.cjs");

const HISTORY = ".supabase/social-history.json";
const SCENARIO = 8551535;
const PIPELINE = "live-trends-v1";
const geography = /\b(skardu|hunza|katpana|deosai|kachura|shigar|khaplu|astore|rama|askole|karakoram|k2|baltistan|gilgit|pakistan)\b/i;
const travel = /\b(touris\w*|travel\w*|trek\w*|adventure\w*|valley|valleys|mountain\w*|lake\w*|snow\w*|flight\w*|aircraft|air connectivity|desert|heritage|base camp)\b/i;
const excluded = /\b(killed|dead|death|attack|terror\w*|dispute\w*|protest\w*|cricket|football|bethell|naqvi|law and order|election\w*)\b/i;

function xmlText(value = "") {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[n])
    .replace(/\s+/g, " ").trim();
}

function parseFeed(xml, kind) {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)].map((match) => {
    const field = (name) => xmlText(match[1].match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`))?.[1]);
    return { title: field("title"), url: field("link"), publishedAt: field("pubDate"), kind };
  });
}

function freshCandidates(items, history, now = new Date()) {
  const seen = new Set(history.map((item) => item.sourceUrl));
  return items.filter((item) => {
    const time = Date.parse(item.publishedAt);
    return geography.test(item.title) && travel.test(item.title) && !excluded.test(item.title) &&
      /^https:\/\//.test(item.url) && !seen.has(item.url) &&
      Number.isFinite(time) && time <= now.getTime() + 3600000 && time >= now.getTime() - 7 * 86400000;
  }).sort((a, b) => (b.kind === "search-trend" ? 1 : 0) - (a.kind === "search-trend" ? 1 : 0) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function nextDate(now = new Date()) {
  const today = pakistanDate(now);
  return new Date(`${today}T09:00:00+05:00`) > now ? today : pakistanDate(new Date(now.getTime() + 86400000));
}

function validateCopy(copy, history = []) {
  if (typeof copy.topic !== "string" || copy.topic.length < 8 || copy.topic.length > 100 ||
      typeof copy.caption !== "string" || copy.caption.length < 40 || copy.caption.length > 650) throw new Error("Generated copy has invalid lengths.");
  if (/photo\s*:|music\s*:|source\s*:|visuals\s*:|pexels|creativecommons|CC BY|photograph/i.test(copy.caption)) throw new Error("Caption contains unwanted credit or technical text.");
  if (/\b(road is open|road is closed|guaranteed safe|confirmed open|today's weather|live footage)\b/i.test(copy.caption)) throw new Error("Caption asserts unsupported live conditions.");
  if (history.some((entry) => entry.topic?.toLowerCase() === copy.topic.toLowerCase() || entry.caption === copy.caption)) throw new Error("Topic or caption repeats a previous day.");
  return copy;
}

function captionFor(topic, seed) {
  const hooks = [
    `${topic} — what would you add to your travel wish list?`,
    `Your next travel idea: ${topic}. Where would you begin?`,
    `Let's plan something memorable around ${topic}. What matters most on your trip?`,
    `Save this idea for your next northern Pakistan journey: ${topic}.`,
    `If ${topic} is on your mind, let's turn inspiration into an itinerary.`,
    `A little travel inspiration for today: ${topic}. Who would you explore with?`,
    `${topic}: a fresh starting point for your next adventure.`,
    `What does your dream journey look like? Start with ${topic}.`,
  ];
  return `${hooks[seed % hooks.length]}\n\nMessage Katpana Desert to plan a trip around your interests.\n#KatpanaDesert #NorthernPakistan #TravelInspiration`;
}

function generateCopy(candidate, history, date) {
  const destination = ["Askole", "Katpana", "Deosai", "Kachura", "Shigar", "Khaplu", "Hunza", "Skardu", "Astore", "Rama", "Karakoram", "K2", "Baltistan", "Gilgit", "Pakistan"]
    .find((place) => new RegExp('\\b' + place + '\\b', 'i').test(candidate.title));
  if (!destination) throw new Error("The current source does not identify a supported travel destination.");
  const seasonal = /snow|winter|cold/i.test(candidate.title);
  const trekking = /trek|base camp|pass/i.test(candidate.title);
  const angles = seasonal
    ? ["winter travel planning", "winter journey ideas", "a thoughtful winter itinerary", "seasonal travel inspiration", "winter packing ideas", "planning a mountain escape", "a slower winter journey", "your winter travel wish list"]
    : trekking
      ? ["trek planning ideas", "a mountain adventure wish list", "preparing for a trekking journey", "a thoughtful trekking itinerary", "mountain journey inspiration", "packing for a trekking adventure", "planning time in the mountains", "your next mountain journey"]
      : ["travel planning ideas", "a slower travel itinerary", "your next travel wish list", "a journey built around your interests", "travel inspiration", "a memorable itinerary", "planning your next escape", "a fresh travel perspective"];
  const seed = createHash("sha256").update(date + candidate.url).digest().readUInt32LE(0);
  const options = angles.map((_, offset) => destination + ": " + angles[(seed + offset) % angles.length]);
  const topic = options.find((value) => !history.some((entry) => entry.topic === value));
  if (!topic) throw new Error("No unused angle remains for this source topic.");
  return validateCopy({ topic, caption: captionFor(topic, seed) }, history);
}

function check(result) {
  if (result.isError || result.structuredContent?.errors?.length || !result.structuredContent) throw new Error(JSON.stringify(result));
  return result.structuredContent;
}

async function prepare(date, dryRun = false) {
  date = checkedDate(date || nextDate());
  if (new Date(`${date}T09:00:00+05:00`) <= new Date()) throw new Error("The publishing slot has passed.");
  fs.mkdirSync(".supabase", { recursive: true });
  const history = fs.existsSync(HISTORY) ? JSON.parse(fs.readFileSync(HISTORY, "utf8")) : [];
  const snapshot = check(await callMake("scenario_get", { scenarioId: SCENARIO }));
  if (snapshot.modules.some((module) => module.filter?.name === "Single live Reel test")) {
    throw new Error("A live publishing test is in progress. Retry preparation after its schedule is restored.");
  }
  const existing = check(await callMake("scenario_module_get", { scenarioId: SCENARIO, moduleIds: [1] })).modules[0];
  const values = Object.fromEntries((existing.config.mapper.variables || []).map((entry) => [entry.name, entry.value]));
  if (values.pipeline_version === PIPELINE && values.content_date && !history.some((entry) => entry.date === values.content_date)) {
    history.push({ date: values.content_date, topic: values.topic, caption: values.caption, sourceUrl: values.source_url, sourceKind: values.source_kind, mediaHash: values.media_hash });
  }
  if (values.pipeline_version === PIPELINE && values.content_date === date) {
    fs.writeFileSync(HISTORY, JSON.stringify(history.slice(-90), null, 2));
    return { alreadyPrepared: true, date, topic: values.topic };
  }
  const feeds = [
    ["search-trend", "https://trends.google.com/trending/rss?geo=PK"],
    ["recent-travel-news", "https://news.google.com/rss/search?q=" + encodeURIComponent("(Skardu OR Hunza OR Gilgit OR Baltistan) tourism travel when:7d") + "&hl=en-PK&gl=PK&ceid=PK:en"],
  ];
  const results = await Promise.allSettled(feeds.map(async ([kind, url]) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
    return parseFeed(await response.text(), kind);
  }));
  const candidates = freshCandidates(results.flatMap((result) => result.status === "fulfilled" ? result.value : []), history);
  if (!candidates.length) throw new Error("No unused, fresh travel topic is available. Publishing will skip stale content.");
  const candidate = candidates[0];
  const copy = await generateCopy(candidate, history, date);
  const directory = path.resolve(`.supabase/reels/${date}-daily-topic`);
  fs.mkdirSync(directory, { recursive: true });
  const postFile = path.join(directory, "daily-post.json");
  fs.writeFileSync(postFile, JSON.stringify({ title: copy.topic, message: copy.caption, excerpt: copy.caption, provenance: candidate }, null, 2));
  const reel = render({ post: postFile, date, out: directory });
  const ffmpeg = process.env.FFMPEG_PATH || (process.platform === "win32" ? path.resolve(".supabase/package/ffmpeg.exe") : "ffmpeg");
  const photo = path.join(directory, "post.jpg");
  const frame = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-ss", "2", "-i", reel.video, "-frames:v", "1", "-vf", "crop=720:720:0:120,scale=1080:1080", "-q:v", "5", photo], { stdio: "inherit" });
  if (frame.error || frame.status !== 0) throw new Error("Could not render the day's square photo.");
  const video = fs.readFileSync(reel.video);
  const photoBytes = fs.readFileSync(photo);
  const mediaHash = createHash("sha256").update(video).digest("hex");
  if (history.some((entry) => entry.mediaHash === mediaHash)) throw new Error("Rendered video repeats a previous day's file.");
  const variables = [
    { name: "caption", value: copy.caption }, { name: "topic", value: copy.topic },
    { name: "content_date", value: date }, { name: "pipeline_version", value: PIPELINE },
    { name: "photo_base64", value: photoBytes.toString("base64") },
    { name: "source_url", value: candidate.url }, { name: "source_published_at", value: candidate.publishedAt },
    { name: "source_kind", value: candidate.kind }, { name: "media_hash", value: mediaHash },
    { name: "publish_enabled", value: true },
  ];
  const gate = { name: "Only fresh content for today in Pakistan", conditions: [[
    { a: "{{1.publish_enabled}}", o: "boolean:equal", b: true },
    { a: "{{1.content_date}}", o: "text:equal", b: '{{formatDate(now; "YYYY-MM-DD"; "Asia/Karachi")}}' },
  ]] };
  const args = {
    scenarioId: SCENARIO, expectedLastEdit: snapshot.scenario.lastEdit,
    operations: [
      { op: "module_config_set", moduleId: 1, label: "Fresh daily topic and media", config: { parameters: {}, mapper: { variables } } },
      { op: "module_config_set", moduleId: 3, config: { parameters: { __IMTCONN__: 7833051 }, mapper: { page_id: "668690229664491", message: "{{1.caption}}", photos: [{ type: "data", fileName: "daily-travel.jpg", data: '{{toBinary(1.photo_base64; "base64")}}' }] } } },
      { op: "filter_set", moduleId: 3, filter: gate },
      { op: "module_disabled_set", moduleId: 4, disabled: true },
      { op: "module_config_set", moduleId: 5, label: "Fresh daily Reel", config: { parameters: { __IMTCONN__: 7833051 }, mapper: { page_id: "668690229664491", uploadMethod: "data", fileName: "daily-travel.mp4", data: `{{toBinary("${video.toString("base64")}"; "base64")}}`, title: copy.topic, description: copy.caption } } },
      { op: "filter_set", moduleId: 5, filter: gate },
    ],
  };
  if (Buffer.byteLength(JSON.stringify(args)) > 950000) throw new Error("Generated media exceeds the Make request budget.");
  if (!dryRun) {
    // Fetch the concurrency token again after rendering. Abort if someone edited the scenario.
    const current = check(await callMake("scenario_get", { scenarioId: SCENARIO }));
    if (current.scenario.lastEdit !== snapshot.scenario.lastEdit) throw new Error("Make was edited during preparation. Retry after inspecting the scenario.");
    check(await callMake("scenario_patch", args));
    history.push({ date, topic: copy.topic, caption: copy.caption, sourceUrl: candidate.url, sourceKind: candidate.kind, mediaHash });
    fs.writeFileSync(HISTORY, JSON.stringify(history.slice(-90), null, 2));
  }
  return { date, topic: copy.topic, caption: copy.caption, sourceKind: candidate.kind, seconds: reel.seconds, mediaHash, dryRun, scheduledAt: `${date}T09:00:00+05:00` };
}

module.exports = { xmlText, parseFeed, freshCandidates, nextDate, captionFor, validateCopy, prepare };
if (require.main === module) prepare(process.env.SOCIAL_TARGET_DATE || undefined, process.argv.includes("--dry-run") || process.env.SOCIAL_DRY_RUN === "true")
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
