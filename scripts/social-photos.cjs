const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const USER_AGENT = "KatpanaDesertSocial/2.0 (https://www.katpanadesert.com/)";
function plain(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
}
function destinationFor(topic) {
  const place = ["Askole", "Katpana", "Deosai", "Kachura", "Shigar", "Khaplu", "Hunza", "Skardu", "Astore", "Rama", "Karakoram", "K2", "Baltistan", "Gilgit", "Pakistan"]
    .find((name) => new RegExp(`\\b${name}\\b`, "i").test(topic));
  if (!place) throw new Error("No supported destination in the photo topic. Specify a destination such as Skardu or Hunza.");
  return place;
}
function photoFromPage(page, destination) {
  const info = page.imageinfo?.[0];
  if (!info || info.mime !== "image/jpeg" || info.width < 1000 || info.height < 700) return null;
  const meta = info.extmetadata || {};
  const field = (name) => plain(meta[name]?.value);
  const description = `${page.title} ${field("ImageDescription")} ${field("Categories")}`;
  if (!new RegExp(`\\b${destination}\\b`, "i").test(description) || /\b(map|diagram|logo|flag|drawing|painting|AI.generated|AI-generated|stable diffusion|midjourney)\b/i.test(description)) return null;
  if (/\bk2-\d{1,3}\b|\b(tank|armoured|armored|artillery|military|warship|black panther|exoplanet|planet|spacecraft|telescope|illustration|rendering|computer.generated|artist.s impression|martyrs?|memorial|battalion|cemeter\w*|gravestone|tombstone|plaque|inscription)\b/i.test(description)) return null;
  // Short place names have unrelated namesakes: K2 is also a tank and planet prefix.
  if (destination === "K2" && !/\b(mountain|karakoram|baltoro|godwin.austen|baltistan)\b/i.test(description)) return null;
  if (destination === "Rama" && !/\b(astore|gilgit|baltistan|pakistan)\b/i.test(description)) return null;
  if (destination === "Pakistan" && !/\b(skardu|hunza|gilgit|baltistan|karakoram|katpana|deosai|shigar|khaplu|kachura|askole|astore)\b/i.test(description)) return null;
  if (/\b(elections?|polling|politicians?|parliament|assembly|protests?|rall(?:y|ies)|campaign|president|prime minister|press conference|political part(?:y|ies))\b/i.test(description)) return null;
  const subject = plain(page.title) + " " + field("ImageDescription");
  if (!/\b(landscape|scenery|scenic|mountains?|valleys?|lakes?|rivers?|desert|dunes?|fort|palace|architecture|heritage|bridges?|villages?|roads?|highways?|passes|peaks?|glaciers?|forests?|meadows?|plateau|waterfalls?|mosques?|monaster(?:y|ies)|ruins|rocks?|views?|treks?|baltoro|panorama|vista|campsites?)\b/i.test(subject)) return null;
  const license = field("LicenseShortName");
  const licenseUrl = field("LicenseUrl");
  // Accept only simple commercial reuse licences. Unknown and share-alike terms are skipped.
  if (!/^(CC0(?: 1\.0)?|Public domain|CC BY (?:2\.0|2\.5|3\.0|4\.0))$/i.test(license)) return null;
  if (/^CC BY /i.test(license) && !/^https?:\/\/creativecommons\.org\/licenses\/by\/(2\.0|2\.5|3\.0|4\.0)\/?$/i.test(licenseUrl)) return null;
  const author = field("Artist");
  if (!author || !info.sha1 || !/^https:\/\/commons\.wikimedia\.org\//.test(info.descriptionurl)) return null;
  const url = info.thumburl || info.url;
  if (!/^https:\/\/(?:upload|thumb)\.wikimedia\.org\//.test(url)) return null;
  return { id: `commons:${page.pageid}`, title: plain(page.title).replace(/^File:/, ""), author,
    attribution: field("Attribution") || author, license, licenseUrl, sourceUrl: info.descriptionurl,
    url, originalSha1: info.sha1, destination };
}
function creditsFor(photos) {
  return "Photos (cropped/animated):\n" + photos.map((photo) =>
    `${photo.title} — ${photo.attribution || photo.author}; ${photo.license}${photo.licenseUrl ? ` (${photo.licenseUrl})` : ""}. ${photo.sourceUrl}`
  ).join("\n");
}
async function selectPhotos({ topic, date, directory, history = [], count = 4, minCount = count, fetcher = fetch }) {
  const destination = destinationFor(topic);
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({ action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: `${destination === "K2" ? "K2 mountain" : destination === "Karakoram" ? "Karakoram mountain" : destination === "Rama" ? "Rama Astore" : destination === "Pakistan" ? "Pakistan Gilgit Baltistan landscape" : destination} filetype:bitmap -incategory:"AI-generated images"`, gsrlimit: "50",
    prop: "imageinfo", iiprop: "url|size|mime|sha1|extmetadata", iiurlwidth: "1280" }).toString();
  const used = new Set(history.flatMap((entry) => entry.photos || []).flatMap((photo) => [photo.id, photo.originalSha1, photo.contentHash]));
  const selected = [];
  fs.mkdirSync(directory, { recursive: true });
  // The first search page often contains maps or incompatible licences.
  // Read at most 200 results before moving on to another fresh topic.
  for (let page = 0; page < 4 && selected.length < count; page++) {
    const response = await fetcher(new URL(api), { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Photo search failed: HTTP ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(`Photo search failed: ${data.error.code}`);
    const candidates = Object.values(data.query?.pages || {}).map((entry) => photoFromPage(entry, destination)).filter(Boolean)
      .filter((photo) => !used.has(photo.id) && !used.has(photo.originalSha1))
      .sort((a, b) => createHash("sha256").update(date + a.id).digest("hex").localeCompare(createHash("sha256").update(date + b.id).digest("hex")));
    for (const photo of candidates) {
      if (selected.length === count) break;
      if (used.has(photo.originalSha1)) continue;
      try {
        const download = await fetcher(photo.url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30000) });
        if (!download.ok || !/^image\/jpeg\b/i.test(download.headers.get("content-type") || "")) continue;
        if (Number(download.headers.get("content-length")) > 15000000) continue;
        const chunks = []; let size = 0;
        for await (const chunk of download.body) {
          size += chunk.length;
          if (size > 15000000) throw new Error("Photo download exceeds 15 MB.");
          chunks.push(chunk);
        }
        const bytes = Buffer.concat(chunks);
        if (bytes[0] !== 0xff || bytes[1] !== 0xd8) continue;
        const contentHash = createHash("sha256").update(bytes).digest("hex");
        if (used.has(contentHash)) continue;
        const filename = path.resolve(directory, `photo-${selected.length + 1}.jpg`);
        fs.writeFileSync(filename, bytes);
        selected.push({ ...photo, contentHash, path: filename });
        used.add(photo.id); used.add(photo.originalSha1); used.add(contentHash);
      } catch { /* Try another licensed photo if this download fails. */ }
    }
    if (!data.continue?.gsroffset) break;
    for (const [key, value] of Object.entries(data.continue)) api.searchParams.set(key, String(value));
  }
  if (selected.length < minCount) throw new Error(`Found only ${selected.length}/${count} unused licensed ${destination} photos. No repeated stock clip will be substituted.`);
  fs.writeFileSync(path.join(directory, "photos.json"), JSON.stringify(selected, null, 2));
  return selected;
}
// The checked-in CC0 source is documented in public/images/places/SOURCES.md.
// Reuse the photograph, never a previous rendered video or caption.
function localKatpanaPhoto(topic, directory) {
  const destination = destinationFor(topic);
  if (!["Katpana", "Skardu", "Baltistan", "Pakistan"].includes(destination)) return null;
  const source = path.resolve(__dirname, "../public/images/places/katapana-desert.jpg");
  const bytes = fs.readFileSync(source);
  fs.mkdirSync(directory, { recursive: true });
  const filename = path.resolve(directory, "fallback-katpana.jpg");
  fs.writeFileSync(filename, bytes);
  return { id: "local:skardu-katpana-desert", title: "Skardu Katpana Desert", author: "Abdullah Shakoor",
    license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skardu_Katpana_Desert.jpg",
    destination: "Katpana", contentHash: createHash("sha256").update(bytes).digest("hex"),
    path: filename, selection: "licensed-local-fallback" };
}

async function selectDailyPhotos(options) {
  try { return await selectPhotos({ ...options, minCount: 1 }); }
  catch (error) {
    const photo = localKatpanaPhoto(options.topic, options.directory);
    const used = new Set((options.history || []).flatMap((entry) => entry.photos || []).flatMap((item) => [item.id, item.contentHash]));
    if (!photo || used.has(photo.id) || used.has(photo.contentHash)) throw error;
    const photos = [{ ...photo, fallbackReason: error.message }];
    fs.writeFileSync(path.join(options.directory, "photos.json"), JSON.stringify(photos, null, 2));
    return photos;
  }
}

module.exports = { plain, destinationFor, photoFromPage, creditsFor, selectPhotos, selectDailyPhotos, localKatpanaPhoto };
