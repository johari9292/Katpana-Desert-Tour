const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputRoot = path.join(root, "out");
const failures = [];
const seoPages = [];

if (!fs.existsSync(outputRoot)) {
  console.error("Static export check failed: out/ does not exist. Run the production build first.");
  process.exit(1);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const htmlFiles = walk(outputRoot).filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  const size = fs.statSync(file).size;
  if (size > 300 * 1024) failures.push(`${path.relative(root, file)}: HTML is ${Math.ceil(size / 1024)} KB (budget: 300 KB)`);
}

const responsiveRoot = path.join(outputRoot, "images", "responsive");
if (fs.existsSync(responsiveRoot)) {
  for (const file of walk(responsiveRoot)) {
    if (fs.statSync(file).size > 800 * 1024) {
      failures.push(`${path.relative(root, file)}: responsive image exceeds the 800 KB budget`);
    }
  }

  const heroMobile = path.join(responsiveRoot, "katpana-skardu-hero-480.jpg");
  const heroDesktop = path.join(responsiveRoot, "katpana-skardu-hero-1536.jpg");
  if (!fs.existsSync(heroMobile) || fs.statSync(heroMobile).size > 100 * 1024) {
    failures.push("responsive mobile hero is missing or exceeds the 100 KB budget");
  }
  if (!fs.existsSync(heroDesktop) || fs.statSync(heroDesktop).size > 250 * 1024) {
    failures.push("responsive desktop hero is missing or exceeds the 250 KB budget");
  }
}

function routeExists(route) {
  let pathname;
  try {
    pathname = decodeURIComponent(route.split(/[?#]/, 1)[0]);
  } catch {
    return false;
  }

  if (!pathname || pathname === "/") return fs.existsSync(path.join(outputRoot, "index.html"));
  const relative = pathname.replace(/^\/+|\/+$/g, "");
  const candidates = [
    path.join(outputRoot, relative, "index.html"),
    path.join(outputRoot, `${relative}.html`),
    path.join(outputRoot, relative)
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file);
  const normalizedRelativeFile = relativeFile.split(path.sep).join("/");
  const isErrorPage =
    html.includes('id="__next_error__"') ||
    path.basename(file) === "404.html" ||
    normalizedRelativeFile.endsWith("/404/index.html") ||
    normalizedRelativeFile.includes("/_not-found/");
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) failures.push(`${relativeFile}: duplicate id(s): ${duplicateIds.join(", ")}`);

  const hrefs = [...html.matchAll(/\shref=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next/") || href.startsWith("/#")) continue;
    if (!routeExists(href)) failures.push(`${relativeFile}: broken internal link ${href}`);
  }

  if (isErrorPage) continue;

  const titles = [...html.matchAll(/<title>[\s\S]*?<\/title>/g)];
  const descriptions = [...html.matchAll(/<meta\s+name=["']description["'][^>]*>/g)];
  const canonicals = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/g)];
  const headings = [...html.matchAll(/<h1\b/g)];

  if (titles.length !== 1) failures.push(`${relativeFile}: expected one document title, found ${titles.length}`);
  if (descriptions.length !== 1) failures.push(`${relativeFile}: expected one meta description, found ${descriptions.length}`);
  if (canonicals.length !== 1) failures.push(`${relativeFile}: expected one canonical URL, found ${canonicals.length}`);
  if (headings.length !== 1) failures.push(`${relativeFile}: expected one H1, found ${headings.length}`);
  if (/<meta\s+name=["']keywords["']/i.test(html)) failures.push(`${relativeFile}: obsolete meta keywords tag found`);

  for (const imageTag of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=["'][^"']*["']/.test(imageTag[0])) failures.push(`${relativeFile}: image is missing an alt attribute`);
  }

  for (const script of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(script[1]);
    } catch {
      failures.push(`${relativeFile}: malformed JSON-LD`);
    }
  }

  if (canonicals[0]) {
    seoPages.push({
      file: relativeFile,
      canonical: canonicals[0][1],
      noindex: /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
    });
  }
}

const sitemapPath = path.join(outputRoot, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  failures.push("sitemap.xml is missing from the static export");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const duplicateSitemapUrls = [...new Set(sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index))];
  const canonicalOwners = new Map();

  if (duplicateSitemapUrls.length) failures.push(`sitemap.xml: duplicate URL(s): ${duplicateSitemapUrls.join(", ")}`);
  if (sitemap.includes("__editorial-archive-empty")) failures.push("sitemap.xml: build-only editorial sentinel found");

  for (const page of seoPages) {
    const inSitemap = sitemapUrls.includes(page.canonical);
    if (page.noindex && inSitemap) failures.push(`${page.file}: noindex canonical is listed in sitemap.xml`);
    if (!page.noindex && !inSitemap) failures.push(`${page.file}: indexable canonical is missing from sitemap.xml`);

    if (!page.noindex) {
      const owners = canonicalOwners.get(page.canonical) ?? [];
      owners.push(page.file);
      canonicalOwners.set(page.canonical, owners);
    }
  }

  for (const [canonical, owners] of canonicalOwners) {
    if (owners.length > 1) failures.push(`duplicate indexable canonical ${canonical}: ${owners.join(", ")}`);
  }
}

if (failures.length) {
  console.error(`Static export check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static export check passed across ${htmlFiles.length} HTML files.`);
