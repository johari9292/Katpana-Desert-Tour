# Katpana Desert Tour

Static Next.js travel website for private Skardu, Deosai, Karakoram and northern Pakistan route planning.

## What is implemented

- Mobile-first tour, destination and intent-led travel-guide architecture
- Canonical metadata, robots controls and XML sitemap generation
- Truthful `Organization`, `WebSite`, `WebPage`, `TouristDestination`, `TouristTrip`, `Article`, `ItemList` and `BreadcrumbList` structured data
- Responsive local imagery for static export, a prioritized LCP hero and user-triggered video
- Keyboard skip targets, visible focus styles, reduced-motion behavior and 48px primary controls
- Persistent mobile WhatsApp and custom-itinerary actions with conversion events
- Booking, privacy, safety, responsible-travel, about and contact pages
- Human approval gates for generated articles and SEO-led travel updates

The implementation intentionally does not invent an address, prices, availability, opening hours, reviews, ratings, credentials or publication dates. Add those only when the business can verify and maintain them.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run check:seo
npm run build
npm run check:export
```

Run the complete sequence with:

```bash
npm run check
```

The production build creates `out/` and automatically runs the final export check. That check scans exported HTML for broken internal links, duplicate IDs, metadata/schema defects, sitemap/indexing conflicts and asset-budget regressions.
Release thresholds and field-measurement guidance are in [PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md).

## Content publication gate

The generated `/articles/` inventory is an editorial workspace. Draft URLs remain accessible for review and existing bookmarks, but use `noindex,follow`, emit no Article schema, receive no internal promotion and stay outside the sitemap until every required review field is present. See [CONTENT_EDITORIAL_WORKFLOW.md](./CONTENT_EDITORIAL_WORKFLOW.md).

The indexable guide architecture starts at `/travel-guides/` and connects the strongest existing destination, tour, trekking and logistics resources by search intent.
Cluster ownership and semantic coverage are documented in [SEO_CONTENT_MAP.md](./SEO_CONTENT_MAP.md). Production-only tasks are in [SEO_LAUNCH_OPERATIONS.md](./SEO_LAUNCH_OPERATIONS.md).

## SEO-led travel updates

The trending workflow no longer follows arbitrary news or auto-publishes daily pages. A bounded catalog creates at most one weekly SEO draft for distinct demand such as Deosai access, Katpana conditions, Skardu 4x4 routes or K2 logistics.

The build sync also consolidates relevant legacy archive rows into aggregate demand signals for existing canonical SEO guides. It never republishes the archived AI copy. While no reviewed update exists, the homepage and `/trending/` use those signals to promote maintained guide URLs; the empty trending hub remains `noindex` and outside the sitemap.

Apply the two August 2026 workflow migrations in order, then deploy the Edge Function:

```bash
supabase functions deploy generate-trending-article
```

Required function secrets:

```bash
supabase secrets set GEMINI_API_KEY=your-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set CRON_SECRET=your-long-random-secret
supabase secrets set GEMINI_MODEL=your-approved-model
```

Set the Edge Function base URL and the same cron secret as database settings before enabling the weekly job. The generator can write only `draft`; a service-role-only SQL approval function enforces sources, named local evidence, substantive copy and a review date before publication.

Approved rows are exported during `prebuild`:

```bash
npm run sync:trending-archive
```

Social publishing is a separate editor-triggered step. Preview it first:

```bash
node scripts/publish-trending-to-facebook.cjs --dry-run --limit 3
```

See [supabase/TRENDING_EDITORIAL_WORKFLOW.md](./supabase/TRENDING_EDITORIAL_WORKFLOW.md) for the request format, approval SQL and withdrawal process.

## Deployment

The project uses `output: "export"` and trailing-slash URLs. Deploy `out/` to a static host. Preserve `public/_headers` and `public/_redirects`; Vercel-specific redirects are also recorded in `vercel.json`.

After deployment:

1. Verify the canonical host redirect and HTTPS headers.
2. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Validate representative rich results and inspect rendered canonicals/robots.
4. Measure mobile field data in Search Console and CrUX; lab tests alone do not prove Core Web Vitals.
5. Add verified business identity details and genuine sourced feedback only when documentation is available.
