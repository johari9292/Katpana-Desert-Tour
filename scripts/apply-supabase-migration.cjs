const fs = require("fs");
const { Client } = require("pg");

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

function poolerUrlFromDirectUrl(directUrl) {
  const url = new URL(directUrl);
  const projectRef = url.hostname.match(/^db\.([^.]+)\.supabase\.co$/)?.[1];
  if (!projectRef) return directUrl;

  url.hostname = "aws-1-ap-northeast-1.pooler.supabase.com";
  url.port = "6543";
  url.username = `postgres.${projectRef}`;
  return url.toString();
}

async function main() {
  loadEnvFile();

  const migrationPath = process.argv[2];
  if (!migrationPath) throw new Error("Usage: node scripts/apply-supabase-migration.cjs <migration.sql>");
  if (!fs.existsSync(migrationPath)) throw new Error(`Migration file not found: ${migrationPath}`);

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) throw new Error("Missing SUPABASE_DB_URL in .env.");

  const sql = fs.readFileSync(migrationPath, "utf8");
  const db = new Client({
    connectionString: poolerUrlFromDirectUrl(dbUrl),
    ssl: { rejectUnauthorized: false },
  });

  await db.connect();
  try {
    await db.query(sql);
    console.log(`Applied migration: ${migrationPath}`);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
