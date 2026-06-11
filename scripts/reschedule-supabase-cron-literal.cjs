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

function dollarQuote(value) {
  const text = String(value);
  const tag = "codex_quote";
  if (text.includes(`$${tag}$`)) {
    return `$$${text}$$`;
  }
  return `$${tag}$${text}$${tag}$`;
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

  const functionUrl = `https://${projectRef}.functions.supabase.co/generate-trending-article`;
  const command = `
select net.http_post(
  url := ${dollarQuote(functionUrl)},
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-cron-secret', ${dollarQuote(cronSecret)}
  ),
  body := jsonb_build_object(
    'source', 'supabase-cron',
    'scheduled_at', now()
  ),
  timeout_milliseconds := 120000
) as request_id;
`;

  const db = new Client({
    connectionString: poolerUrlFromDirectUrl(dbUrl),
    ssl: { rejectUnauthorized: false },
  });

  await db.connect();
  try {
    await db.query(`
      do $$
      begin
        if exists (select 1 from cron.job where jobname = 'generate-trending-article-daily') then
          perform cron.unschedule('generate-trending-article-daily');
        end if;
      end;
      $$;
    `);
    await db.query("select cron.schedule($1, $2, $3)", [
      "generate-trending-article-daily",
      "0 4 * * *",
      command,
    ]);

    const result = await db.query(`
      select jobid, schedule, active
      from cron.job
      where jobname = 'generate-trending-article-daily'
      order by jobid desc
      limit 1
    `);

    console.log(JSON.stringify({ functionUrl, cronJob: result.rows[0] ?? null }, null, 2));
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
