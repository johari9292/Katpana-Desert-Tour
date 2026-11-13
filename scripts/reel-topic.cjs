const fs = require("node:fs");
const catalog = require("../data/facebook-evergreen.json");

const titles = {
  "katapana-desert.jpg": "Discover Katpana Desert",
  "deosai-plains.jpg": "Plan your Deosai adventure",
  "kachura-lakes.jpg": "A lake day in Skardu",
  "shigar-fort-valley.jpg": "Discover Shigar's heritage",
  "khaplu-palace.jpg": "Explore Khaplu and Baltistan",
  "k2-base-camp.jpg": "Karakoram travel inspiration",
  "hunza-valley.jpg": "Hunza on your travel wish list",
  "astore-rama-meadows.jpg": "Mountain views of Astore",
};

function pakistanDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

function checkedDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value) {
    throw new Error("Use a valid --date YYYY-MM-DD in Pakistan time.");
  }
  return value;
}

function dailyPost(date) {
  checkedDate(date);
  const [year, month, day] = date.split("-").map(Number);
  const ordinal = Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
  const entry = catalog[ordinal % catalog.length];
  return {
    title: titles[entry.image], caption: entry.caption,
    excerpt: entry.caption.split("\n")[0], source: "daily-evergreen-post",
    image: entry.image, url: "https://www.katpanadesert.com/", date,
  };
}

function clean(value, limit) {
  return typeof value === "string" ? value.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").trim().slice(0, limit) : "";
}

function resolvePost(options) {
  const date = checkedDate(options.date || pakistanDate());
  if (!options.post && !options.topic) {
    const historyFile = ".supabase/social-history.json";
    const saved = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, "utf8")).find((entry) => entry.date === date) : null;
    if (saved) return { title: saved.topic, caption: saved.caption, excerpt: saved.caption.split("\n")[0], date, source: "daily-live-topic" };
    return dailyPost(date);
  }
  const payload = options.post ? JSON.parse(fs.readFileSync(options.post, "utf8")) : {};
  const article = payload.article || payload;
  const title = clean(options.topic || article.title || article.trend_topic, 160);
  if (!title) throw new Error("The post JSON needs article.title, title or trend_topic.");
  const excerpt = clean(article.excerpt, 400);
  const url = clean(payload.article_url || article.url || payload.url, 1000);
  const caption = clean(payload.post_caption || payload.facebook?.message || payload.message, 5000) ||
    [title, excerpt, url, "#KatpanaDesert #Skardu #PakistanTravel"].filter(Boolean).join("\n\n");
  return { title, excerpt, caption, url, date, source: options.post ? "supplied-post" : "supplied-topic" };
}

function briefFor(post, seconds = 12) {
  return {
    date: post.date, topic: post.title, source: post.source, seconds,
    aspectRatio: "9:16", caption: post.caption,
    scenePlan: [
      { from: 0, to: 4, text: post.title },
      { from: 4, to: seconds - 4, text: "Plan your northern Pakistan journey" },
      { from: seconds - 4, to: seconds, text: "Message Katpana Desert to plan your trip" },
    ],
    generationPrompt: `Create a ${seconds}-second vertical 9:16 travel video for Katpana Desert (Skardu). Topic: ${post.title}. Context from the matching daily post: ${post.excerpt || post.caption.split("\n")[0]}. Use natural camera movement and three coherent shots, with realistic geography and lighting. Use supplied reference footage where available; label invented scenes as an illustration. Do not depict invented current road conditions, access, weather, prices or events as fact. Leave room for captions added in editing. Audio: an original gentle instrumental travel soundtrack with no vocals, recognizable songs or artist imitation.`,
    note: post.source === "daily-evergreen-post"
      ? "Matches the current Make photo rotation; this is not a live trending-news feed."
      : "Uses the supplied post/topic. Check factual claims before publishing.",
  };
}

module.exports = { pakistanDate, checkedDate, dailyPost, resolvePost, briefFor };
