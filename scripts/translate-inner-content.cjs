// Optional content-maintenance tool. Production builds use committed dictionaries,
// so visitors and search crawlers never depend on a translation request.
const fs = require("node:fs");
const { readLocaleExportConfig } = require("./locale-export-config.cjs");
const source = require("../data/translations/source.json");
const requested = process.argv.find((arg) => arg.startsWith("--locales="))?.split("=")[1].split(",");
const locales = readLocaleExportConfig().locales.filter(({ code }) => code !== "en" && (!requested || requested.includes(code)));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translate(text, locale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: locale === "zh" ? "zh-CN" : locale, dt: "t", q: text }).toString();
  let error;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const result = data[0].map((segment) => segment[0] || "").join("");
      if (!result.trim()) throw new Error("Empty translation");
      return result;
    } catch (reason) { error = reason; await wait(1000 * 2 ** attempt); }
  }
  throw error;
}
async function language(code) {
  const filename = `data/translations/${code}.json`;
  const dictionary = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : {};
  const missing = source.filter((text) => !Object.hasOwn(dictionary, text));
  let done = 0;
  while (done < missing.length) {
    const batch = []; let size = 0;
    while (done + batch.length < missing.length) {
      const text = missing[done + batch.length];
      if (size + text.length + 12 > 3500 && batch.length) break;
      batch.push(text); size += text.length + 12;
    }
    const input = batch.map((text, index) => `[${String(index).padStart(4, "0")}]\n${text}`).join("\n\n");
    const output = await translate(input, code);
    const matches = [...output.matchAll(/\[\s*(\d{4})\s*\]\s*([\s\S]*?)(?=\[\s*\d{4}\s*\]|$)/g)];
    const parsed = new Map(matches.map((match) => [Number(match[1]), match[2].trim()]));
    for (let index = 0; index < batch.length; index++) {
      dictionary[batch[index]] = parsed.get(index) || await translate(batch[index], code);
    }
    done += batch.length;
    fs.writeFileSync(filename, JSON.stringify(Object.fromEntries(Object.entries(dictionary).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n");
    if (done === missing.length || done % 150 < batch.length) console.log(`${code}: ${done}/${missing.length} new strings translated`);
    await wait(200);
  }
  console.log(`${code}: complete (${Object.keys(dictionary).length} strings)`);
}
const queue = [...locales];
Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) await language(queue.shift().code);
})).catch((error) => { console.error(error.message); process.exitCode = 1; });
