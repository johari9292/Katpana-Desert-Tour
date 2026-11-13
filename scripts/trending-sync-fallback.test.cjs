const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { isTransientSyncFailure, isTrendingReviewCurrent, syncTrendingArchive } = require("./sync-trending-archive.cjs");

const reviewedArchive = `import { isTrendingReviewCurrent, type TrendingArticle } from "./trending";
// A previous, human-reviewed archive; the fallback must preserve these bytes.
const approvedStaticTrendingArticles: TrendingArticle[] = [
  { slug: "expired-update", next_review_at: "2000-01-01" } as TrendingArticle
];
export const staticTrendingArticles = approvedStaticTrendingArticles.filter((article) =>
  isTrendingReviewCurrent(article.next_review_at)
);
`;

function fixture(t, source = reviewedArchive) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-trending-sync-"));
  const outputPath = path.join(directory, "trending-static.ts");
  if (source !== null) fs.writeFileSync(outputPath, source);
  t.after(() => {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    fs.rmdirSync(directory);
  });
  return outputPath;
}

function options(outputPath, responses, warnings = []) {
  return {
    env: { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_unit_test" },
    outputPath,
    warn: (message) => warnings.push(message),
    log: () => {},
    clientFactory: () => ({
      from: () => {
        let status;
        const query = {
          select() { return query; },
          eq(_field, value) { status = value; return query; },
          order() { return query; },
          limit() {
            const result = responses[status];
            return result instanceof Error ? Promise.reject(result) : Promise.resolve(result);
          },
        };
        return query;
      },
    }),
  };
}

const success = () => ({ status: 200, data: [], error: null });
const failure = (status, message = "Service unavailable", code = "") => ({ status, data: null, error: { message, code } });

test("only transport failures and the explicit temporary HTTP statuses allow fallback", () => {
  for (const status of [0, 408, 502, 503, 504]) {
    assert.equal(isTransientSyncFailure({ message: "Temporarily unavailable", code: "" }, status), true);
  }
  assert.equal(isTransientSyncFailure(new TypeError("fetch failed")), true);
  assert.equal(isTransientSyncFailure({ message: "TypeError: fetch failed" }), true);
  assert.equal(isTransientSyncFailure({ cause: { code: "ENOTFOUND" } }), true);
  assert.equal(isTransientSyncFailure({ code: "ECONNRESET" }), true);
  for (const status of [200, 400, 401, 403, 404, 409, 422, 429, 500]) {
    assert.equal(isTransientSyncFailure({ message: "fetch failed" }, status), false);
  }
  for (const code of ["42P01", "42703", "PGRST204", "PGRST301", "unexpected"]) {
    assert.equal(isTransientSyncFailure({ code, message: "fetch failed" }, 0), false);
  }
  assert.equal(isTransientSyncFailure(new TypeError("Cannot read properties of undefined")), false);
  assert.equal(isTransientSyncFailure(new Error("Unknown error")), false);
  assert.equal(isTransientSyncFailure(null, 503), false);
});

test("a Supabase fetch failure keeps the reviewed archive byte-for-byte and excludes expired entries", async (t) => {
  const outputPath = fixture(t);
  const warnings = [];
  await syncTrendingArchive(options(outputPath, {
    published: failure(0, "TypeError: fetch failed"), archived: success(),
  }, warnings));
  const retained = fs.readFileSync(outputPath, "utf8");
  assert.equal(retained, reviewedArchive);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Keeping the existing reviewed static archive unchanged/);
  assert.match(warnings[0], /review-expiry filter still runs/);
  const exports = {};
  vm.runInNewContext(ts.transpileModule(retained, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports,
    require: (specifier) => {
      assert.equal(specifier, "./trending");
      return { isTrendingReviewCurrent };
    },
  });
  assert.equal(exports.staticTrendingArticles.length, 0, "keeping a cached archive must not keep an expired page eligible");
});

test("a temporary failure in either query never writes partial data", async (t) => {
  for (const failedStatus of ["published", "archived"]) {
    const outputPath = fixture(t);
    await syncTrendingArchive(options(outputPath, {
      published: success(), archived: success(), [failedStatus]: failure(503),
    }));
    assert.equal(fs.readFileSync(outputPath, "utf8"), reviewedArchive);
  }
});

test("rejected transport requests may use the same reviewed archive", async (t) => {
  const outputPath = fixture(t);
  await syncTrendingArchive(options(outputPath, {
    published: new TypeError("fetch failed"), archived: success(),
  }));
  assert.equal(fs.readFileSync(outputPath, "utf8"), reviewedArchive);
});

test("authentication and schema errors fail even when the other query has a network failure", async (t) => {
  for (const permanent of [failure(401, "Invalid JWT", "PGRST301"), failure(400, "column missing", "42703")]) {
    const outputPath = fixture(t);
    const warnings = [];
    await assert.rejects(syncTrendingArchive(options(outputPath, {
      published: new TypeError("fetch failed"), archived: permanent,
    }, warnings)), new RegExp(permanent.error.message));
    assert.equal(fs.readFileSync(outputPath, "utf8"), reviewedArchive);
    assert.equal(warnings.length, 0);
  }
});

test("unknown exceptions and unapproved status codes still stop the sync", async (t) => {
  for (const unexpected of [new Error("Unexpected implementation error"), failure(500), failure(429)]) {
    const outputPath = fixture(t);
    await assert.rejects(syncTrendingArchive(options(outputPath, {
      published: unexpected, archived: success(),
    })));
    assert.equal(fs.readFileSync(outputPath, "utf8"), reviewedArchive);
  }
});

test("fallback requires an existing typed archive with its review-expiry filter", async (t) => {
  for (const source of [null, "export const staticTrendingArticles = [];", reviewedArchive.replace("isTrendingReviewCurrent(article.next_review_at)", "true")]) {
    const outputPath = fixture(t, source);
    await assert.rejects(syncTrendingArchive(options(outputPath, {
      published: failure(503), archived: success(),
    })), /no reviewed static archive exists|review-expiry filter is missing/);
    assert.equal(fs.existsSync(outputPath), source !== null);
    if (source !== null) assert.equal(fs.readFileSync(outputPath, "utf8"), source);
  }
});

test("a healthy database still refreshes the archive through the existing editorial gate", async (t) => {
  const outputPath = fixture(t);
  const warnings = [];
  await syncTrendingArchive(options(outputPath, {
    published: { status: 200, error: null, data: [{ title: "An unreviewed published row", status: "published" }] },
    archived: { status: 200, error: null, data: [{ title: "Skardu road trip planning", status: "archived", generation_date: "2026-11-01" }] },
  }, warnings));
  const updated = fs.readFileSync(outputPath, "utf8");
  assert.notEqual(updated, reviewedArchive);
  assert.doesNotMatch(updated, /An unreviewed published row/);
  assert.match(updated, /approvedStaticTrendingArticles\.filter/);
  assert.match(updated, /isTrendingReviewCurrent\(article\.next_review_at\)/);
  assert.match(updated, /\/karakoram-highway-travel/);
  assert.match(warnings[0], /Excluded 1 published row/);
});
