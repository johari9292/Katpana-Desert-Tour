const fs = require("node:fs");
const ts = require("typescript");
const { registerSourceLoader } = require("./i18n-source.cjs");
registerSourceLoader();
const { innerRoutes } = require("../lib/i18n/page-registry.ts");
const { translateServerTree } = require("../lib/i18n/server-localization.tsx");
const { textKey } = require("../lib/i18n/translate.tsx");

async function collect() {
  const corpus = new Set();
  const client = new Set();
  const dictionary = new Proxy({}, { get(_, key) { if (typeof key === "string" && /[a-zA-Z]/.test(key)) corpus.add(key); return key; } });
  const routes = innerRoutes();
  const translation = { locale: "fr", paths: ["/", ...routes.map((route) => route.path)], dictionary };
  for (const route of routes) {
    const props = { params: Promise.resolve({ slug: route.slug }) };
    await translateServerTree(await route.module.default(props), translation, {});
    const meta = route.module.generateMetadata ? await route.module.generateMetadata(props) : route.module.metadata;
    function metadataText(value, key = "") {
      if (typeof value === "string" && ["title", "description", "alt"].includes(key)) corpus.add(textKey(value));
      else if (value && typeof value === "object") Object.entries(value).forEach(([name, child]) => metadataText(child, name));
    }
    metadataText(meta);
  }
  for (const name of ["TourInquiryForm", "SiteSearch", "MobileBookingBar"]) {
    const source = fs.readFileSync(`components/${name}.tsx`, "utf8");
    const ast = ts.createSourceFile(name + ".tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxText(node) || ts.isStringLiteral(node)) {
        const text = textKey(node.text);
        const parent = node.parent;
        const attribute = ts.isJsxAttribute(parent) ? parent.name.getText(ast) : "";
        if (text && /[a-zA-Z]/.test(text) && !/[#@=<>/\\]|\b(?:px-|text-|bg-|grid-|border-|font-|ring-|aria-|inquiry-|site-|tour-|noopener)\b/.test(text) &&
            (!attribute || ["alt", "title", "placeholder", "aria-label"].includes(attribute)) &&
            !ts.isImportDeclaration(parent) && !ts.isLiteralTypeNode(parent)) {
          corpus.add(text); client.add(text);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  corpus.add("Skip to main content");
  fs.mkdirSync("data/translations", { recursive: true });
  fs.writeFileSync("data/translations/source.json", JSON.stringify([...corpus].sort(), null, 2) + "\n");
  fs.writeFileSync("data/translations/client-keys.json", JSON.stringify([...client].sort(), null, 2) + "\n");
  console.log(JSON.stringify({ routes: routes.length, strings: corpus.size, characters: [...corpus].join("").length, clientStrings: client.size }));
}
collect().catch((error) => { console.error(error); process.exitCode = 1; });
