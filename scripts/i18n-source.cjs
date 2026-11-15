// Read the actual server component output without starting a Next server.
// Client boundaries stay opaque, matching React Server Components during a build.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

function registerSourceLoader() {
  const resolve = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, ...rest) {
    return resolve.call(this, request.startsWith("@/") ? path.join(process.cwd(), request.slice(2)) : request, parent, ...rest);
  };
  const clientSources = [];
  for (const extension of [".ts", ".tsx"]) Module._extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    if (/^[\s\uFEFF]*["']use client["']/.test(source)) {
      clientSources.push(source);
      const reference = function ClientBoundary() {};
      reference.$$typeof = Symbol.for("react.client.reference");
      module.exports = { __esModule: true, default: reference };
      return;
    }
    module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
  };
  return { clientSources };
}
module.exports = { registerSourceLoader };
