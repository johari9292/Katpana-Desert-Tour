const fs = require("fs");
const path = require("path");

// Read the small, dependency-free descriptor table without loading application
// bundles or keeping a second list of supported languages in the build scripts.
function readLocaleExportConfig(root = process.cwd()) {
  const source = fs.readFileSync(path.join(root, "lib/i18n/config.ts"), "utf8");
  const descriptors = [...source.matchAll(
    /\{\s*code:\s*"([a-z]{2})",\s*name:\s*"[^"]+",\s*dir:\s*"(ltr|rtl)",\s*href:\s*"([^"]+)",\s*ogLocale:\s*"[^"]+"\s*\}/g
  )].map(([, code, dir, href]) => ({ code, dir, href }));
  if (descriptors.length < 20 || new Set(descriptors.map(({ code }) => code)).size !== descriptors.length) {
    throw new Error("The static locale descriptor table could not be read completely. Update the export reader if its format changes.");
  }
  const brandSource = fs.readFileSync(path.join(root, "constants/brand.ts"), "utf8");
  const siteUrl = brandSource.match(/export\s+const\s+SITE_URL\s*=\s*"(https:\/\/[^"\s]+)"/)?.[1];
  if (!siteUrl) throw new Error("SITE_URL must be a verified HTTPS canonical origin.");

  return {
    locales: descriptors,
    siteUrl,
    outputRoot: path.join(root, "out"),
    prerenderRoot: path.join(root, ".next", "server", "app"),
    fileFor: ({ href }) => path.join(root, "out", href.replace(/^\/+/, ""), "index.html"),
    nextFileFor: ({ code }) => path.join(root, ".next", "server", "app", `${code === "en" ? "index" : code}.html`),
    urlFor: ({ href }) => `${siteUrl}${href}`
  };
}

module.exports = { readLocaleExportConfig };
