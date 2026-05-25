const fs = require("fs");

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

async function main() {
  loadEnvFile();

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const cronSecret = process.env.CRON_SECRET;
  const projectRef = projectRefFromSupabaseUrl(publicUrl);

  if (!projectRef) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL in .env.");
  if (!cronSecret) throw new Error("Missing CRON_SECRET in .env.");

  const url = `https://${projectRef}.functions.supabase.co/generate-trending-article`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-secret": cronSecret,
    },
    body: JSON.stringify({ source: "manual-production-test", tested_at: new Date().toISOString() }),
  });
  const text = await response.text();

  console.log(
    JSON.stringify(
      {
        url,
        status: response.status,
        ok: response.ok,
        body: parseJsonMaybe(text),
      },
      null,
      2,
    ),
  );
}

function parseJsonMaybe(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return { text: value.slice(0, 1000) };
  }
}

main().catch((error) => {
  console.error(error.message);
  if (error.cause) {
    console.error(error.cause);
  }
  process.exit(1);
});
