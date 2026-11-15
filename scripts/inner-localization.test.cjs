const { test } = require("node:test");
const assert = require("node:assert/strict");
const { registerSourceLoader } = require("./i18n-source.cjs");
registerSourceLoader();
const { localePath, localeFromPath } = require("../lib/i18n/config.ts");
const { innerRoutes, innerRoute } = require("../lib/i18n/page-registry.ts");
const { translateServerTree, translateSchema, translateData } = require("../lib/i18n/server-localization.tsx");
const { translateClientTree } = require("../lib/i18n/translate.tsx");
const { pageLanguageAlternates } = require("../lib/i18n/alternates.ts");
const { SITE_URL } = require("../constants/brand.ts");
const React = require("react");

test("switching languages preserves inner paths, queries and anchors in both directions", () => {
  for (const locale of ["fr", "ur", "ja", "en"]) {
    const path = localePath(locale, "/de/destinations/deosai-national-park/?party=2#best-season");
    assert.equal(path, `${locale === "en" ? "" : "/" + locale}/destinations/deosai-national-park/?party=2#best-season`);
    assert.equal(localeFromPath(path), locale);
    assert.equal(localePath(locale, path), path);
  }
  assert.equal(localePath("en", "/fr/"), "/");
});

test("each page has twenty reciprocal alternates that retain its route", () => {
  const paths = innerRoutes().map((route) => route.path);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.includes("/about"));
  assert.ok(paths.includes("/destinations/deosai-national-park"));
  for (const path of paths) {
    const alternates = pageLanguageAlternates(path);
    assert.equal(Object.keys(alternates).length, 21);
    assert.equal(alternates.fr, SITE_URL + "/fr" + path + "/");
    assert.equal(alternates.en, alternates["x-default"]);
    assert.equal(innerRoute(path + "/").path, path);
  }
});

test("server translation retains original page structure and localizes real content and links", async () => {
  const route = innerRoute("/about");
  const translation = { locale: "fr", paths: ["/", "/about", "/contact"], dictionary: {
    "Route-aware travel planning from Skardu": "Planification de voyages depuis Skardu",
    "How planning works": "Comment fonctionne la préparation"
  } };
  const tree = await translateServerTree(await route.module.default({ params: Promise.resolve({ slug: "" }) }), translation, {});
  const texts = []; const hrefs = []; const ids = [];
  function walk(node) {
    if (typeof node === "string") texts.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (React.isValidElement(node)) { if (node.props.href) hrefs.push(node.props.href); if (node.props.id) ids.push(node.props.id); walk(node.props.children); }
  }
  walk(tree);
  assert.ok(texts.includes("Planification de voyages depuis Skardu"));
  assert.ok(texts.includes("Comment fonctionne la préparation"));
  assert.ok(hrefs.includes("/fr/contact/"));
  assert.ok(ids.includes("main-content"));
});

test("interactive translation keeps field values, handlers, identifiers and external URLs intact", () => {
  const action = () => {};
  const translation = { locale: "ur", paths: ["/contact"], dictionary: { Name: "نام" } };
  const tree = translateClientTree(React.createElement("label", { htmlFor: "name" }, "Name", React.createElement("input", { id: "name", value: "Name", onChange: action })), translation);
  assert.equal(tree.props.children[0], "نام");
  assert.equal(tree.props.children[1].props.value, "Name");
  assert.equal(tree.props.children[1].props.onChange, action);
  const data = translateData({ href: "/contact/", title: "Name", slug: "Name" }, translation);
  assert.equal(data.href, "/ur/contact/");
  assert.equal(data.slug, "Name");
});

test("structured data localizes page identities while retaining organization and image identities", () => {
  const translation = { locale: "fr", paths: ["/about"], dictionary: { About: "À propos" } };
  const result = translateSchema({ "@type": "WebPage", "@id": SITE_URL + "/about/#webpage", name: "About", image: SITE_URL + "/images/hero.jpg", publisher: { "@id": SITE_URL + "/#organization" } }, translation);
  assert.equal(result["@id"], SITE_URL + "/fr/about/#webpage");
  assert.equal(result.name, "À propos");
  assert.equal(result.inLanguage, "fr");
  assert.equal(result.publisher["@id"], SITE_URL + "/#organization");
  assert.equal(result.image, SITE_URL + "/images/hero.jpg");
});
