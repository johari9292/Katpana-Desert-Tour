const fs = require("fs");
const path = require("path");
const { readLocaleExportConfig } = require("./locale-export-config.cjs");

const config = readLocaleExportConfig();
const failures = [];
const expectedAlternates = new Map([
  ...config.locales.map((locale) => [locale.code, config.urlFor(locale)]),
  ["x-default", `${config.siteUrl}/`]
]);

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)=("|')([\s\S]*?)\2/g)]
    .map(([, name, , value]) => [name.toLowerCase(), value]));
}

function checkAlternates(tags, context) {
  const actual = tags.map(attributes).filter((tag) => tag.rel === "alternate" && tag.hreflang);
  if (actual.length !== expectedAlternates.size) {
    failures.push(`${context}: expected ${expectedAlternates.size} language alternates, found ${actual.length}`);
  }
  for (const [language, url] of expectedAlternates) {
    const matches = actual.filter((tag) => tag.hreflang === language && tag.href === url);
    if (matches.length !== 1) failures.push(`${context}: missing or duplicate ${language} alternate for ${url}`);
  }
}

const englishHtml = fs.readFileSync(config.fileFor(config.locales.find(({ code }) => code === "en")), "utf8");
const englishHeading = englishHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
const englishDescription = attributes(englishHtml.match(/<meta\b[^>]*name="description"[^>]*>/i)?.[0] || "").content;
const englishNameLabel = englishHtml.match(/<label\b[^>]*for="enquiry-name"[^>]*>([^<]+)/i)?.[1];
const sitemap = fs.readFileSync(path.join(config.outputRoot, "sitemap.xml"), "utf8");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];

for (const locale of config.locales) {
  const file = config.fileFor(locale);
  if (!fs.existsSync(file)) {
    failures.push(`${locale.href}: missing static landing page`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const document = attributes(html.match(/<html\b[^>]*>/i)?.[0] || "");
  if (document.lang !== locale.code || document.dir !== locale.dir) {
    failures.push(`${locale.href}: incorrect document lang or dir`);
  }
  // The production host can serve Next's prerendered pages instead of out/.
  // Both copies must agree, including the document attributes and all SEO data.
  if (fs.existsSync(config.prerenderRoot)) {
    const nextFile = config.nextFileFor(locale);
    if (!fs.existsSync(nextFile)) {
      failures.push(`${locale.href}: missing Next prerendered landing page`);
    } else {
      const nextHtml = fs.readFileSync(nextFile, "utf8");
      const nextDocument = attributes(nextHtml.match(/<html\b[^>]*>/i)?.[0] || "");
      if (nextDocument.lang !== locale.code || nextDocument.dir !== locale.dir) {
        failures.push(`${locale.href}: incorrect Next prerender document lang or dir`);
      }
      if (nextHtml !== html) {
        failures.push(`${locale.href}: Next prerendered HTML differs from the validated static export`);
      }
    }
  }
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag);
  const canonical = links.map(attributes).filter(({ rel }) => rel === "canonical");
  if (canonical.length !== 1 || canonical[0].href !== config.urlFor(locale)) {
    failures.push(`${locale.href}: expected a unique self-referencing canonical URL`);
  }
  checkAlternates(links, locale.href);

  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const description = attributes(head.match(/<meta\b[^>]*name="description"[^>]*>/i)?.[0] || "").content;
  if (!heading || !description) failures.push(`${locale.href}: missing server-rendered heading or description`);
  if (locale.code !== "en" && (heading === englishHeading || description === englishDescription)) {
    failures.push(`${locale.href}: main heading or metadata still uses the English text`);
  }
  const nameLabel = html.match(/<label\b[^>]*for="enquiry-name"[^>]*>([^<]+)/i)?.[1];
  if (!nameLabel || !/<form\b/i.test(html)) failures.push(`${locale.href}: server-rendered trip enquiry is missing`);
  if (locale.code !== "en" && nameLabel === englishNameLabel) {
    failures.push(`${locale.href}: trip enquiry labels still use the English text`);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const entities = scripts.flatMap(([, json]) => {
    try {
      const schema = JSON.parse(json);
      return schema["@graph"] || [schema];
    } catch { return []; }
  });
  if (!entities.some((entity) => entity["@type"] === "WebPage" && entity.inLanguage === locale.code && entity.url === config.urlFor(locale))) {
    failures.push(`${locale.href}: localized WebPage structured data is missing`);
  }

  const sitemapEntry = sitemapEntries.find(([, body]) => body.includes(`<loc>${config.urlFor(locale)}</loc>`));
  if (!sitemapEntry) failures.push(`${locale.href}: localized URL is missing from the sitemap`);
  else checkAlternates([...sitemapEntry[1].matchAll(/<xhtml:link\b[^>]*>/gi)].map(([tag]) => tag), `sitemap ${locale.href}`);
}

if (failures.length) {
  console.error(`Multilingual export check failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Multilingual export check passed for ${config.locales.length} languages, matching Next prerenders, reciprocal alternates, canonicals and localized content.`);
