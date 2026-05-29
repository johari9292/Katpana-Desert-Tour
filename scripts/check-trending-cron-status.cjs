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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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

  if (!process.env.SUPABASE_DB_URL) {
    throw new Error("Missing SUPABASE_DB_URL in .env.");
  }

  const db = new Client({
    connectionString: poolerUrlFromDirectUrl(process.env.SUPABASE_DB_URL),
    ssl: { rejectUnauthorized: false },
  });

  await db.connect();
  try {
    const now = await db.query(
      "select now() as db_now, current_setting('TimeZone') as timezone",
    );
    const job = await db.query(`
      select jobid, jobname, schedule, active
      from cron.job
      where jobname = 'generate-trending-article-daily'
      order by jobid desc
      limit 1
    `);
    const runs = await db.query(`
      select runid, status, return_message, start_time, end_time
      from cron.job_run_details
      where jobid = (
        select jobid
        from cron.job
        where jobname = 'generate-trending-article-daily'
        order by jobid desc
        limit 1
      )
      order by start_time desc
      limit 8
    `);
    const articles = await db.query(`
      select
        generation_date,
        published_at,
        title,
        facebook_posted_at,
        facebook_webhook_status,
        facebook_webhook_error
      from public.trending_articles
      order by generation_date desc
      limit 8
    `);
    const httpResponses = await db.query(`
      select
        id,
        status_code,
        error_msg,
        content,
        created
      from net._http_response
      order by created desc
      limit 8
    `);

    console.log(
      JSON.stringify(
        {
          database: now.rows[0],
          cronJob: job.rows[0] ?? null,
          recentRuns: runs.rows,
          recentArticles: articles.rows,
          recentHttpResponses: httpResponses.rows,
        },
        null,
        2,
      ),
    );
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
