const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const React = require("react");
require("./i18n-source.cjs").registerSourceLoader();
const { locales } = require("../lib/i18n/config.ts");
const { loadTranslation, translateServerTree } = require("../lib/i18n/server-localization.tsx");
const { innerRoutes, innerRoute } = require("../lib/i18n/page-registry.ts");
const { textKey } = require("../lib/i18n/translate.tsx");
const source = require("../data/translations/source.json");

function strings(node, output = []) {
  if (typeof node === "string") output.push(textKey(node));
  else if (Array.isArray(node)) node.forEach((child) => strings(child, output));
  else if (React.isValidElement(node)) strings(node.props.children, output);
  return output;
}

for (const { code } of locales.filter(({ code }) => code !== "en")) {
  test(`locale ${code}: complete, usable page dictionary`, () => {
    const filename = path.join(process.cwd(), "data", "translations", `${code}.json`);
    assert.ok(fs.existsSync(filename), `${code}: translation dictionary missing`);
    const dictionary = JSON.parse(fs.readFileSync(filename, "utf8"));
    const missing = source.filter((key) => typeof dictionary[key] !== "string" || !dictionary[key].trim());
    assert.equal(missing.length, 0, `${code}: ${missing.length} untranslated text entries, starting with ${missing[0]}`);
    for (const key of source) assert.doesNotMatch(dictionary[key], /\[\s*\d{4}\s*\]/, `${code}: translation batch marker leaked into page content`);
    assert.equal(loadTranslation(code, []).complete, true, `${code}: complete translations are still treated as previews`);
  });

  test(`locale ${code}: full tour, article, destination and trek content renders in the selected language`, async () => {
  const paths = ["/", ...innerRoutes().map((route) => route.path)];
  const samples = [
    "/tours/katpana-desert-skardu-highlights-tour",
    "/articles/complete-skardu-travel-guide",
    "/destinations/deosai-national-park",
    "/treks/k2-base-camp",
  ];
  for (const page of samples) {
    const route = innerRoute(page);
    assert.ok(route, `Missing detail page ${page}`);
    const render = () => route.module.default({ params: Promise.resolve({ slug: route.slug }) });
    const english = await translateServerTree(await render(), { locale: "en", dictionary: {}, paths }, {});
    const paragraphs = [...new Set(strings(english).filter((text) => text.length > 80 && /[a-zA-Z]/.test(text)))];
    assert.ok(paragraphs.length >= 5, `${page}: expected substantive body content to check`);
      const translation = loadTranslation(code, paths);
      const localized = new Set(strings(await translateServerTree(await render(), translation, {})));
      for (const paragraph of paragraphs) {
        const expected = translation.dictionary[paragraph];
        assert.ok(expected, `${code}${page}: missing body paragraph translation`);
        assert.notEqual(expected, paragraph, `${code}${page}: English body paragraph was copied unchanged`);
        assert.ok(localized.has(textKey(expected)), `${code}${page}: translated paragraph is not rendered`);
      }
  }
  });
}
