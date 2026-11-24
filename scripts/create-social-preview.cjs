// Local or GitHub Actions preview; never updates Make or publishes a post.
const path = require("node:path");
const { selectPhotos } = require("./social-photos.cjs");
const { recordedMusic } = require("./social-recorded-music.cjs");
const { render } = require("./create-topic-reel.cjs");
const { pakistanDate } = require("./reel-topic.cjs");

async function preview() {
  const directory = path.resolve(".supabase/reels/internet-preview");
  const date = pakistanDate();
  let photos;
  try { photos = await selectPhotos({ topic: "Hunza valley", date, directory, count: 3, minCount: 2 }); }
  catch (error) {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.search = new URLSearchParams({ action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: 'Hunza filetype:bitmap -incategory:"AI-generated images"', gsrlimit: "50", prop: "imageinfo", iiprop: "url|size|mime|sha1|extmetadata", iiurlwidth: "1280" }).toString();
    const response = await fetch(api, { headers: { "User-Agent": "KatpanaDesertSocial/2.0 (https://www.katpanadesert.com/)" }, signal: AbortSignal.timeout(30000) });
    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    console.log("Photo search diagnostics:", JSON.stringify({ total: pages.length, sample: pages.slice(0, 5).map((p) => ({ title: p.title, info: p.imageinfo?.map((i) => ({ mime: i.mime, width: i.width, height: i.height, license: i.extmetadata?.LicenseShortName?.value, licenseUrl: i.extmetadata?.LicenseUrl?.value, artist: !!i.extmetadata?.Artist?.value, url: i.thumburl || i.url, source: i.descriptionurl })) })) }));
    throw error;
  }
  const music = await recordedMusic({ directory });
  return render({ topic: "Discover Hunza Valley", date, out: directory, photos, music: music.path, musicCredit: music.credit, musicStart: music.start });
}
preview().then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => { console.error(error.message); process.exitCode = 1; });
