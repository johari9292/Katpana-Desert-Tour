const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { callMake } = require("./make-mcp.cjs");
const { pakistanDate, checkedDate } = require("./reel-topic.cjs");
const { render } = require("./create-topic-reel.cjs");
const { selectPhotos, creditsFor } = require("./social-photos.cjs");
const { subjectFor, captionFor, validateCopy, generateCopy } = require("./social-copy.cjs");

const HISTORY = ".supabase/social-history.json";
const SCENARIO = 8551535;
const PIPELINE = "live-trends-photos-v4";
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
    const context = [...match[1].matchAll(/<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/g)].map((item) => xmlText(item[1])).join(" ");
    return { title: field("title"), context, url: field("link"), publishedAt: field("pubDate"), kind };
  });
}

function freshCandidates(items, history, now = new Date()) {
  const seen = new Set(history.map((item) => item.sourceUrl));
  const seenTitles = new Set(history.map((item) => sourceKey(item.sourceTitle)).filter(Boolean));
  const unique = new Set();
  return items.filter((item) => {
    const time = Date.parse(item.publishedAt);
    const context = `${item.title} ${item.context || ""}`;
    const key = sourceKey(item.title);
    const valid = geography.test(item.title) && travel.test(context) && !excluded.test(context) &&
      /^https:\/\//.test(item.url) && !seen.has(item.url) && !seenTitles.has(key) && !unique.has(key) &&
      Number.isFinite(time) && time <= now.getTime() + 3600000 && time >= now.getTime() - 7 * 86400000;
    if (valid) unique.add(key);
    return valid;
  }).sort((a, b) => (b.kind === "search-trend" ? 1 : 0) - (a.kind === "search-trend" ? 1 : 0) ||
    recentUse(a, history) - recentUse(b, history) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function sourceKey(title = "") {
  return title.normalize("NFKC").toLowerCase().replace(/\s+[-\u2013\u2014|]\s+[^-\u2013\u2014|]+$/, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function recentUse(candidate, history) {
  const { destination, angle } = subjectFor(candidate);
  return history.slice(-7).reduce((score, entry) => {
    const samePlace = entry.destination === destination || new RegExp(`\\b${destination}\\b`, "i").test(entry.topic || "");
    return score + (samePlace ? 2 : 0) + (samePlace && entry.angle === angle.name ? 2 : 0);
  }, 0);
}

function nextDate(now = new Date()) {
  const today = pakistanDate(now);
  return new Date(`${today}T09:00:00+05:00`) > now ? today : pakistanDate(new Date(now.getTime() + 86400000));
}

function check(result) {
  if (result.isError || result.structuredContent?.errors?.length || !result.structuredContent) throw new Error(JSON.stringify(result));
  return result.structuredContent;
}

async function prepare(date, dryRun = false) {
  date = checkedDate(date || nextDate());
  if (new Date(`${date}T09:00:00+05:00`) <= new Date()) throw new Error("The publishing slot has passed.");
  fs.mkdirSync(".supabase", { recursive: true });
  let history = fs.existsSync(HISTORY) ? JSON.parse(fs.readFileSync(HISTORY, "utf8")) : [];
  const snapshot = check(await callMake("scenario_get", { scenarioId: SCENARIO }));
  if (snapshot.modules.some((module) => module.filter?.name === "Single live Reel test")) {
    throw new Error("A live publishing test is in progress. Retry preparation after its schedule is restored.");
  }
  const existing = check(await callMake("scenario_module_get", { scenarioId: SCENARIO, moduleIds: [1] })).modules[0];
  const values = Object.fromEntries((existing.config.mapper.variables || []).map((entry) => [entry.name, entry.value]));
  // The slot is verified to be in the future above; replace obsolete pending
  // content without treating that unpublished draft as a previously used story.
  const replacingPending = values.content_date === date && values.pipeline_version !== PIPELINE;
  if (replacingPending) history = history.filter((entry) => entry.date !== date);
  if (!replacingPending && values.pipeline_version?.startsWith("live-trends-") && values.content_date && !history.some((entry) => entry.date === values.content_date)) {
    history.push({ date: values.content_date, topic: values.topic, caption: values.post_caption || values.caption, reelCaption: values.reel_caption, sourceUrl: values.source_url, sourceTitle: values.source_title, sourceKind: values.source_kind, destination: values.destination, angle: values.angle, mediaHash: values.media_hash, photos: values.photo_provenance ? JSON.parse(values.photo_provenance) : [] });
  }
  if (values.pipeline_version === PIPELINE && values.content_date === date) {
    fs.writeFileSync(HISTORY, JSON.stringify(history.slice(-90), null, 2));
    return { alreadyPrepared: true, date, topic: values.topic };
  }
  const feeds = [
    ["search-trend", "https://trends.google.com/trending/rss?geo=PK"],
    ["recent-travel-news", "https://news.google.com/rss/search?q=" + encodeURIComponent("(Skardu OR Hunza OR Gilgit OR Baltistan OR Katpana OR Deosai OR Kachura OR Shigar OR Khaplu OR Astore OR Askole) (tourism OR travel OR trekking OR heritage OR lake OR winter) when:7d") + "&hl=en-PK&gl=PK&ceid=PK:en"],
  ];
  const results = await Promise.allSettled(feeds.map(async ([kind, url]) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
    return parseFeed(await response.text(), kind);
  }));
  const candidates = freshCandidates(results.flatMap((result) => result.status === "fulfilled" ? result.value : []), history);
  if (!candidates.length) throw new Error("No unused, fresh travel topic is available. Publishing will skip stale content.");
  const directory = path.resolve(`.supabase/reels/${date}-daily-topic`);
  fs.mkdirSync(directory, { recursive: true });
  let candidate, copy, photos;
  const attempts = [];
  const tried = new Set();
  for (const option of candidates) {
    const subject = subjectFor(option);
    const key = `${subject.destination}:${subject.angle.name}`;
    if (tried.has(key)) continue;
    tried.add(key);
    try {
      const generated = generateCopy(option, history, date);
      const selected = await selectPhotos({ topic: generated.topic, date, directory, history });
      candidate = option; copy = generated; photos = selected;
      break;
    } catch (error) {
      attempts.push(`${subject.destination}: ${error.message}`);
      if (attempts.length === 8) break;
    }
  }
  if (!copy) throw new Error(`Could not prepare an unused travel topic and photos. ${attempts.join("; ")}`);
  const photoCaption = `${copy.caption}\n\n${creditsFor([photos[0]])}`;
  const postFile = path.join(directory, "daily-post.json");
  fs.writeFileSync(postFile, JSON.stringify({ title: copy.topic, message: copy.caption, reel_caption: copy.reelCaption, scene_texts: copy.sceneTexts, hashtags: copy.hashtags, excerpt: copy.caption, provenance: candidate }, null, 2));
  const reel = render({ post: postFile, date, out: directory, photos: photos.slice(1) });
  const ffmpeg = process.env.FFMPEG_PATH || (process.platform === "win32" ? path.resolve(".supabase/package/ffmpeg.exe") : "ffmpeg");
  const photo = path.join(directory, "post.jpg");
  const video = fs.readFileSync(reel.video);
  // Leave room for base64 expansion, captions, provenance and Make's config envelope.
  const photoBudget = Math.min(180000, Math.floor((900000 - Math.ceil(video.length / 3) * 4) * 0.75));
  if (photoBudget < 20000) throw new Error("Reel leaves insufficient room for the daily photo in Make.");
  for (const [size, quality] of [[1080, 8], [1080, 14], [1080, 22], [1080, 31], [720, 31]]) {
    const frame = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", "-i", photos[0].path, "-frames:v", "1", "-vf", `scale=${size}:${size}:force_original_aspect_ratio=increase,crop=${size}:${size}`, "-q:v", String(quality), photo], { stdio: "inherit" });
    if (frame.error || frame.status !== 0) throw new Error("Could not render the day's square photo.");
    if (fs.statSync(photo).size <= photoBudget) break;
  }
  if (fs.statSync(photo).size > photoBudget) throw new Error("Daily photo exceeds the Make delivery budget after compression.");
  const photoBytes = fs.readFileSync(photo);
  const mediaHash = createHash("sha256").update(video).digest("hex");
  if (history.some((entry) => entry.mediaHash === mediaHash)) throw new Error("Rendered video repeats a previous day's file.");
  const variables = [
    { name: "caption", value: photoCaption }, { name: "topic", value: copy.topic },
    { name: "post_caption", value: copy.caption }, { name: "reel_caption", value: copy.reelCaption },
    { name: "source_title", value: candidate.title }, { name: "destination", value: copy.destination },
    { name: "angle", value: copy.angle }, { name: "hashtags", value: copy.hashtags.join(" ") },
    { name: "photo_provenance", value: JSON.stringify(photos) },
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
      { op: "module_config_set", moduleId: 5, label: "Fresh daily Reel", config: { parameters: { __IMTCONN__: 7833051 }, mapper: { page_id: "668690229664491", uploadMethod: "data", fileName: "daily-travel.mp4", data: `{{toBinary("${video.toString("base64")}"; "base64")}}`, title: copy.topic, description: reel.caption } } },
      { op: "filter_set", moduleId: 5, filter: gate },
    ],
  };
  if (Buffer.byteLength(JSON.stringify(args)) > 950000) throw new Error("Generated media exceeds the Make request budget.");
  if (!dryRun) {
    // Fetch the concurrency token again after rendering. Abort if someone edited the scenario.
    const current = check(await callMake("scenario_get", { scenarioId: SCENARIO }));
    if (current.scenario.lastEdit !== snapshot.scenario.lastEdit) throw new Error("Make was edited during preparation. Retry after inspecting the scenario.");
    check(await callMake("scenario_patch", args));
    history.push({ date, topic: copy.topic, caption: copy.caption, reelCaption: copy.reelCaption, sourceUrl: candidate.url, sourceTitle: candidate.title, sourceKind: candidate.kind, destination: copy.destination, angle: copy.angle, mediaHash, photos });
    fs.writeFileSync(HISTORY, JSON.stringify(history.slice(-90), null, 2));
  }
  return { date, topic: copy.topic, caption: copy.caption, reelCaption: copy.reelCaption, hashtags: copy.hashtags, sourceKind: candidate.kind, seconds: reel.seconds, mediaHash, dryRun, scheduledAt: `${date}T09:00:00+05:00` };
}

module.exports = { xmlText, parseFeed, sourceKey, freshCandidates, nextDate, captionFor, validateCopy, prepare };
if (require.main === module) prepare(process.env.SOCIAL_TARGET_DATE || undefined, process.argv.includes("--dry-run") || process.env.SOCIAL_DRY_RUN === "true")
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => { console.error(error.message); process.exitCode = 1; });
