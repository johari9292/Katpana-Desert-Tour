// Curated recordings listed as CC BY 4.0 on their Wikimedia Commons pages.
const fs = require("node:fs");
const path = require("node:path");

const TRACKS = [
  { id: "sascha-big-adventure", title: "The Big Adventure", file: "Sascha Ende - The Big Adventure (cc-by) (filmmusic).ogg" },
  { id: "sascha-tropical-house", title: "Tropical Island House", file: "Tropical Island House by Sascha Ende.mp3" },
  { id: "sascha-feel-it", title: "I Feel It (instrumental)", file: "Sascha Ende - I Feel It (instrumental) (cc-by) (filmmusic).ogg" },
];

async function recordedMusic({ directory, history = [], fetcher = fetch }) {
  const tracks = [...TRACKS].sort((a, b) => history.map((entry) => entry.media?.music).lastIndexOf(a.id) - history.map((entry) => entry.media?.music).lastIndexOf(b.id));
  const errors = [];
  for (const track of tracks) {
    try {
      const api = new URL("https://commons.wikimedia.org/w/api.php");
      api.search = new URLSearchParams({ action: "query", format: "json", titles: `File:${track.file}`, prop: "imageinfo", iiprop: "url|size|mime|extmetadata" }).toString();
      const response = await fetcher(api, { headers: { "User-Agent": "KatpanaDesertSocial/2.0 (https://www.katpanadesert.com/)" }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Commons HTTP ${response.status}`);
      const pages = Object.values((await response.json()).query?.pages || {});
      const info = pages[0]?.imageinfo?.[0];
      const meta = info?.extmetadata || {};
      if (meta.LicenseShortName?.value !== "CC BY 4.0" || !/^https?:\/\/creativecommons\.org\/licenses\/by\/4\.0\/?$/.test(meta.LicenseUrl?.value || "") || !/^https:\/\/upload\.wikimedia\.org\//.test(info?.url || "") || !/^https:\/\/commons\.wikimedia\.org\//.test(info?.descriptionurl || "") || info.size > 25000000) throw new Error("Unexpected source or licence metadata");
      const download = await fetcher(info.url, { headers: { "User-Agent": "KatpanaDesertSocial/2.0 (https://www.katpanadesert.com/)" }, signal: AbortSignal.timeout(60000) });
      if (!download.ok || Number(download.headers.get("content-length")) > 25000000) throw new Error("Music download failed or exceeds 25 MB");
      const chunks = []; let size = 0;
      for await (const chunk of download.body) { size += chunk.length; if (size > 25000000) throw new Error("Music exceeds 25 MB"); chunks.push(chunk); }
      if (!size) throw new Error("Music download was empty");
      fs.mkdirSync(directory, { recursive: true });
      const filename = path.resolve(directory, `recorded-music${path.extname(track.file)}`);
      fs.writeFileSync(filename, Buffer.concat(chunks));
      return { ...track, path: filename, start: 30, credit: `${track.title} by Sascha Ende; CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); excerpt, faded. ${info.descriptionurl}` };
    } catch (error) { errors.push(`${track.id}: ${error.message}`); }
  }
  throw new Error(`Could not obtain a credited music recording: ${errors.join("; ")}`);
}
module.exports = { TRACKS, recordedMusic };
