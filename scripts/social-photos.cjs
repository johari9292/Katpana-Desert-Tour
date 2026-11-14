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
  const license = field("LicenseShortName");
  const licenseUrl = field("LicenseUrl");
  // Accept only simple commercial reuse licences. Unknown and share-alike terms are skipped.
  if (!/^(CC0(?: 1\.0)?|Public domain|CC BY (?:2\.0|2\.5|3\.0|4\.0))$/i.test(license)) return null;
  if (/^CC BY /i.test(license) && !/^https?:\/\/creativecommons\.org\/licenses\/by\/(2\.0|2\.5|3\.0|4\.0)\/?$/i.test(licenseUrl)) return null;
  const author = field("Artist");
  if (!author || !info.sha1 || !/^https:\/\/commons\.wikimedia\.org\//.test(info.descriptionurl)) return null;
  const url = info.thumburl || info.url;
  if (!/^https:\/\/upload\.wikimedia\.org\//.test(url)) return null;
  return { id: `commons:${page.pageid}`, title: plain(page.title).replace(/^File:/, ""), author,
    attribution: field("Attribution") || author, license, licenseUrl, sourceUrl: info.descriptionurl,
    url, originalSha1: info.sha1, destination };
}
function creditsFor(photos) {
  return "Photos (cropped/animated):\n" + photos.map((photo) =>
    `${photo.title} — ${photo.attribution || photo.author}; ${photo.license}${photo.licenseUrl ? ` (${photo.licenseUrl})` : ""}. ${photo.sourceUrl}`
  ).join("\n");
}
async function selectPhotos({ topic, date, directory, history = [], count = 4, fetcher = fetch }) {
  const destination = destinationFor(topic);
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({ action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: `${destination} filetype:bitmap -incategory:"AI-generated images"`, gsrlimit: "50",
    prop: "imageinfo", iiprop: "url|size|mime|sha1|extmetadata", iiurlwidth: "1280" }).toString();
  const response = await fetcher(api, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Photo search failed: HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(`Photo search failed: ${data.error.code}`);
  const used = new Set(history.flatMap((entry) => entry.photos || []).flatMap((photo) => [photo.id, photo.originalSha1, photo.contentHash]));
  const candidates = Object.values(data.query?.pages || {}).map((page) => photoFromPage(page, destination)).filter(Boolean)
    .filter((photo) => !used.has(photo.id) && !used.has(photo.originalSha1))
    .sort((a, b) => createHash("sha256").update(date + a.id).digest("hex").localeCompare(createHash("sha256").update(date + b.id).digest("hex")));
  const selected = [];
  fs.mkdirSync(directory, { recursive: true });
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
  if (selected.length !== count) throw new Error(`Found only ${selected.length}/${count} unused licensed ${destination} photos. No repeated stock clip will be substituted.`);
  fs.writeFileSync(path.join(directory, "photos.json"), JSON.stringify(selected, null, 2));
  return selected;
}
module.exports = { plain, destinationFor, photoFromPage, creditsFor, selectPhotos };
