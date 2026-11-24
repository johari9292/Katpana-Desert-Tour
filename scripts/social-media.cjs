// Optional media supplied by the operator with permission for scheduled posting.
const fs = require("node:fs");
const path = require("node:path");

function selectMedia({ destination, history = [], manifest = process.env.SOCIAL_MEDIA_MANIFEST || "social-media/manifest.json" }) {
  if (!fs.existsSync(manifest)) return {};
  const root = path.dirname(path.resolve(manifest));
  const data = JSON.parse(fs.readFileSync(manifest, "utf8"));
  function choose(type) {
    const items = data[type] || [];
    if (!Array.isArray(items)) throw new Error(`Media manifest ${type} must be an array.`);
    const matching = items.map((item) => {
      if (!item.id || !item.file || !item.credit || !item.permission) throw new Error(`Each ${type} entry needs id, file, credit and permission.`);
      const file = path.resolve(root, item.file);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Media file is missing or outside its manifest folder: ${item.file}`);
      return { ...item, path: file };
    }).filter((item) => type !== "videos" || (Array.isArray(item.destinations) && item.destinations.some((place) => place.toLowerCase() === destination.toLowerCase())));
    if (new Set(items.map((item) => item.id)).size !== items.length) throw new Error(`Duplicate ${type} media IDs.`);
    // Prefer the item least recently used; stable ordering breaks ties.
    matching.sort((a, b) => history.map((entry) => entry.media?.[type]).lastIndexOf(a.id) - history.map((entry) => entry.media?.[type]).lastIndexOf(b.id));
    return matching[0];
  }
  return { video: choose("videos"), music: choose("music") };
}

module.exports = { selectMedia };
