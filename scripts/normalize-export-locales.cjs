const fs = require("fs");
const { readLocaleExportConfig } = require("./locale-export-config.cjs");

// This site uses Next's static export with a shared English root layout. A root
// layout cannot read a dynamic segment beneath itself. Normalize only the opening
// <html> tag of the known landing pages in BOTH the static export and Next's
// prerender cache: the production host may deploy the prerenders instead of out/.
// The first response, including without JavaScript, must have the correct values.
// LocaleDocument also sets these attributes after client-side navigation.
const config = readLocaleExportConfig();
let pageFiles = 0;
for (const locale of config.locales) {
  const files = [config.fileFor(locale)];
  if (fs.existsSync(config.prerenderRoot)) files.push(config.nextFileFor(locale));
  for (const file of files) {
    if (!fs.existsSync(file)) throw new Error(`Missing localized landing output: ${file}`);
    const html = fs.readFileSync(file, "utf8");
    if (!/<html\b[^>]*>/i.test(html)) throw new Error(`Missing document element: ${file}`);
    const normalized = html.replace(/<html\b([^>]*)>/i, (_, attributes) => {
      const clean = attributes.replace(/\s(?:lang|dir)=(?:"[^"]*"|'[^']*')/gi, "");
      return `<html lang="${locale.code}" dir="${locale.dir}"${clean}>`;
    });
    if (normalized !== html) fs.writeFileSync(file, normalized);
    pageFiles += 1;
  }
}
console.log(`Set document language and direction for ${config.locales.length} languages across ${pageFiles} landing-page outputs.`);
