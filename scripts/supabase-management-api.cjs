const fs = require("fs");
const path = require("path");
const FormData = globalThis.FormData;
const Blob = globalThis.Blob;

function loadEnvFile() {
  if (!fs.existsSync(".env")) return;

  for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function projectRefFromSupabaseUrl(value) {
  if (!value) return null;
  const url = new URL(value);
  return url.hostname.split(".")[0];
}

async function apiFetch(pathname, options = {}) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error("Missing SUPABASE_ACCESS_TOKEN in .env.");

  const response = await fetch(`https://api.supabase.com${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = parseJsonMaybe(text);

  if (!response.ok) {
    throw new Error(
      JSON.stringify({ status: response.status, statusText: response.statusText, body }, null, 2),
    );
  }

  return { status: response.status, body };
}

function parseJsonMaybe(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return { text: value.slice(0, 1000) };
  }
}

async function listProjects() {
  const result = await apiFetch("/v1/projects");
  console.log(
    JSON.stringify(
      {
        count: Array.isArray(result.body) ? result.body.length : null,
        projects: Array.isArray(result.body)
          ? result.body.map((project) => ({
              ref: project.ref,
              name: project.name,
              region: project.region,
              status: project.status,
            }))
          : result.body,
      },
      null,
      2,
    ),
  );
}

async function setSecrets() {
  const ref = getProjectRef();
  const secrets = [
    ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
    ["GEMINI_API_KEY", process.env.GEMINI_API_KEY],
    ["CRON_SECRET", process.env.CRON_SECRET],
    ["GEMINI_MODEL", process.env.GEMINI_MODEL || "gemini-2.5-flash"],
    ["MAKE_FACEBOOK_WEBHOOK_URL", process.env.MAKE_FACEBOOK_WEBHOOK_URL],
    ["SITE_URL", "https://www.katpanadesert.com"],
  ]
    .filter(([, value]) => value)
    .map(([name, value]) => ({ name, value }));

  await apiFetch(`/v1/projects/${ref}/secrets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(secrets),
  });
  console.log(JSON.stringify({ ref, secretsSet: secrets.map((secret) => secret.name) }, null, 2));
}

async function deployFunction() {
  const ref = getProjectRef();
  const functionName = "generate-trending-article";
  const functionPath = path.join("supabase", "functions", functionName, "index.ts");
  const code = fs.readFileSync(functionPath, "utf8");
  const form = new FormData();

  form.append("metadata", JSON.stringify({
    name: functionName,
    slug: functionName,
    verify_jwt: false,
    entrypoint_path: "index.ts",
  }));
  form.append("file", new Blob([code], { type: "application/typescript" }), "index.ts");

  const result = await apiFetch(`/v1/projects/${ref}/functions/deploy?slug=${encodeURIComponent(functionName)}`, {
    method: "POST",
    body: form,
  });
  console.log(JSON.stringify({ ref, deployed: result.body }, null, 2));
}

function getProjectRef() {
  const ref = process.env.SUPABASE_PROJECT_REF || projectRefFromSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!ref) throw new Error("Missing SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL.");
  return ref;
}

async function main() {
  loadEnvFile();

  const command = process.argv[2];

  if (command === "projects") return listProjects();
  if (command === "set-secrets") return setSecrets();
  if (command === "deploy-function") return deployFunction();

  throw new Error("Usage: node scripts/supabase-management-api.cjs <projects|set-secrets|deploy-function>");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
