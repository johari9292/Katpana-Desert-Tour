// Publish the original Reel as a public GitHub release asset for Instagram to fetch.
const fs = require("node:fs");
const { createHash } = require("node:crypto");
const TAG = "instagram-reels";
const REPOSITORY = "johari9292/Katpana-Desert-Tour";

async function hostOriginalVideo({ file, date, token = process.env.GITHUB_TOKEN, fetcher = fetch }) {
  if (!token) throw new Error("GITHUB_TOKEN with contents:write is required to host the Instagram video.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("A valid video date is required.");
  const bytes = fs.readFileSync(file);
  const name = `reel-${date}-${createHash("sha256").update(bytes).digest("hex").slice(0, 16)}.mp4`;
  const base = `https://api.github.com/repos/${REPOSITORY}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "KatpanaDesertSocial/2.0" };
  let response = await fetcher(`${base}/releases/tags/${TAG}`, { headers, signal: AbortSignal.timeout(30000) });
  if (response.status === 404) {
    response = await fetcher(`${base}/releases`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ tag_name: TAG, name: "Instagram Reel media", body: "Original credited travel Reels used by the daily Instagram workflow.", prerelease: true }), signal: AbortSignal.timeout(30000) });
  }
  if (!response.ok) throw new Error(`Could not read or create Instagram media release: HTTP ${response.status}`);
  const release = await response.json();
  if (!Number.isSafeInteger(release.id)) throw new Error("Invalid GitHub release response.");
  let asset = (release.assets || []).find((entry) => entry.name === name && entry.size === bytes.length && entry.state === "uploaded");
  if (!asset) {
    const uploadUrl = `https://uploads.github.com/repos/${REPOSITORY}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`;
    response = await fetcher(uploadUrl, { method: "POST", headers: { ...headers, "Content-Type": "video/mp4" }, body: bytes, signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Could not upload Instagram video: HTTP ${response.status}`);
    asset = await response.json();
  }
  const expectedUrl = `https://github.com/${REPOSITORY}/releases/download/${TAG}/${name}`;
  if (asset.browser_download_url !== expectedUrl) throw new Error("Unexpected GitHub release asset URL.");
  const check = await fetcher(expectedUrl, { headers: { Range: "bytes=0-0", "User-Agent": "KatpanaDesertSocial/2.0" }, signal: AbortSignal.timeout(30000) });
  if (![200, 206].includes(check.status)) throw new Error(`Instagram video is not publicly downloadable: HTTP ${check.status}`);
  await check.body?.cancel();
  return { url: expectedUrl, name };
}
module.exports = { hostOriginalVideo };
