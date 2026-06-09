# Katpana Desert Tour

Next.js tourism website for northern Pakistan travel services focused on:

- Tour package pages for Skardu, Hunza, Deosai, Khaplu, Shigar, Astore, and K2-side trekking
- Destination pages with local images, overviews, activities, and route notes
- Skardu hotel and rent a car services
- Suggested routes for Katpana Desert, Kachura Lakes, Deosai, Shigar Fort, Khaplu Palace, Hunza, and Astore
- Downloaded local Skardu hero video with animated destination-point routing
- Clean lower-page Katpana Desert video preview

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Publish

The project is configured for static export with Next.js, so it can be deployed to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

```bash
npm run build
```

The static output is generated in `out/`.

## SEO Notes

The homepage includes Next.js metadata, canonical URL, Open Graph tags, generated `robots.txt`, generated `sitemap.xml`, TravelAgency schema, WebSite schema, FAQ schema, VideoObject schema, descriptive headings, route content, and long-tail Skardu tourism search intent.

## Trending AI Articles

The `/trending/` page reads published daily articles from Supabase in the browser, so new posts appear without rebuilding the static site. Apply the migrations in `supabase/migrations/`, then deploy the Edge Function:

```bash
supabase functions deploy generate-trending-article
```

The function is configured in `supabase/config.toml` with JWT verification disabled because it is protected by the `x-cron-secret` header.

Set the required Supabase function secrets:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-jwt-or-sb_secret-key
supabase secrets set CRON_SECRET=your-long-random-secret
supabase secrets set GEMINI_MODEL=gemini-2.5-flash
supabase secrets set MAKE_FACEBOOK_WEBHOOK_URL=your-make-facebook-webhook-url
supabase secrets set SITE_URL=https://www.katpanadesert.com
```

Do not reuse the publishable or anon key for `SUPABASE_SERVICE_ROLE_KEY`; the function needs an admin-capable key to insert daily articles.
When `MAKE_FACEBOOK_WEBHOOK_URL` is configured, each newly published trending article is also sent to Make.com for Facebook publishing. Map Facebook links to `link`, `url`, `article_url`, `public_url`, `canonical_url`, or `article.url`; all of those use the live `/trending/?article=<slug>` page, which loads the article from Supabase immediately and will not 404 before the next static build. The build-generated `/trending/<slug>/` path is still included separately as `static_url` for archive use after deployment.
If your Make webhook requires authentication, set either `MAKE_FACEBOOK_WEBHOOK_BEARER_TOKEN` or `MAKE_FACEBOOK_WEBHOOK_AUTH_HEADER` such as `X-Webhook-Token: your-token`.

Static `/trending/[slug]/` article pages are generated from `data/trending-static.ts`. The build runs `npm run sync:trending-archive` first, which pulls published Supabase rows into that archive so newly generated articles get real static links after the next deploy/build.

The cron migration schedules the function at `04:00 UTC` daily, which is `09:00 Asia/Karachi`. Before relying on the schedule, set these database settings in Supabase SQL editor:

```sql
alter database postgres set app.settings.edge_function_base_url = 'https://<project-ref>.functions.supabase.co';
alter database postgres set app.settings.cron_secret = '<same CRON_SECRET>';
```

Manual function test:

```bash
curl -X POST "https://<project-ref>.functions.supabase.co/generate-trending-article" \
  -H "x-cron-secret: <CRON_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"source":"manual-test"}'
```

Replay the latest saved trending posts to Make.com for Facebook testing:

```bash
MAKE_FACEBOOK_WEBHOOK_URL="https://hook.example" node scripts/publish-trending-to-facebook.cjs --limit 3
```

Use `--dry-run` to preview payloads without sending them, or `--include-posted` to resend posts already marked as sent.

Note: the requested stack uses Next.js 14. npm audit currently flags known advisories across the Next.js 14 line. This project is configured as a static export, but a production server-rendered deployment should upgrade to a patched Next.js release when possible.
