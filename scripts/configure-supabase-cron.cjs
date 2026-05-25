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

function projectRefFromSupabaseUrl(value) {
  if (!value) return null;
  const url = new URL(value);
  return url.hostname.split(".")[0];
}

async function main() {
  loadEnvFile();

  const dbUrl = process.env.SUPABASE_DB_URL;
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const cronSecret = process.env.CRON_SECRET;
  const projectRef = projectRefFromSupabaseUrl(publicUrl);

  if (!dbUrl) throw new Error("Missing SUPABASE_DB_URL in .env.");
  if (!projectRef) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL in .env.");
  if (!cronSecret) throw new Error("Missing CRON_SECRET in .env.");

  const functionBaseUrl = `https://${projectRef}.functions.supabase.co`;
  const db = new Client({
    connectionString: poolerUrlFromDirectUrl(dbUrl),
    ssl: { rejectUnauthorized: false },
  });

  await db.connect();
  try {
    await db.query(`alter database postgres set app.settings.edge_function_base_url = '${sqlLiteral(functionBaseUrl)}'`);
    await db.query(`alter database postgres set app.settings.cron_secret = '${sqlLiteral(cronSecret)}'`);
    await db.query(`select pg_reload_conf()`);

    const cronResult = await db.query(`
      select jobid, schedule, command, active
      from cron.job
      where jobname = 'generate-trending-article-daily'
      order by jobid desc
      limit 1
    `);

    console.log(
      JSON.stringify(
        {
          functionBaseUrl,
          cronJob: cronResult.rows[0] ?? null,
        },
        null,
        2,
      ),
    );
  } finally {
    await db.end();
  }
}

function sqlLiteral(value) {
  return String(value).replace(/'/g, "''");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
