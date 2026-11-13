const fs = require("fs");
const { readLocaleExportConfig } = require("./locale-export-config.cjs");

// This site uses Next's static export with a shared English root layout. A root
// layout cannot read a dynamic segment beneath itself. Normalize only the opening
// <html> tag of the known landing-page exports so the first response, including
// without JavaScript, carries the correct document language and direction.
// LocaleDocument also sets these attributes after client-side navigation.
const config = readLocaleExportConfig();
for (const locale of config.locales) {
  const file = config.fileFor(locale);
  if (!fs.existsSync(file)) throw new Error(`Missing localized landing export: ${locale.href}`);
  const html = fs.readFileSync(file, "utf8");
  if (!/<html\b[^>]*>/i.test(html)) throw new Error(`Missing document element: ${locale.href}`);
  const normalized = html.replace(/<html\b([^>]*)>/i, (_, attributes) => {
    const clean = attributes.replace(/\s(?:lang|dir)=(?:"[^"]*"|'[^']*')/gi, "");
    return `<html lang="${locale.code}" dir="${locale.dir}"${clean}>`;
  });
  if (normalized !== html) fs.writeFileSync(file, normalized);
}
console.log(`Set document language and direction for ${config.locales.length} static landing pages.`);
