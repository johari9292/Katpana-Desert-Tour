# Multilingual landing pages

The English landing page remains at `/`. Nineteen additional language versions
have their own static URLs. The language table in `lib/i18n/config.ts` is the
source of truth. Landing content, navigation, trip enquiries and metadata are
translated. Detailed tour and travel-guide pages remain in English; the landing
pages explain this before linking to those resources.

Each language version has a self-referencing canonical, reciprocal language
alternates and an English `x-default`. The XML sitemap lists all landing pages
with the same alternate group. Existing English deep links are preserved. There
are no country-based or browser-language redirects.

## Server-rendered document language

The site uses two root layouts. `app/(english)/layout.tsx` renders English pages
at their existing URLs; the route-group name does not appear in URLs.
`app/[locale]/layout.tsx` receives the language parameter and renders the
localized landing page's document. Both use the shared `SiteDocument` component
for fonts, styles and the document shell.

`lang` and `dir` are rendered directly on `<html>` by the correct root layout.
Urdu, Arabic and Persian use `dir="rtl"`. These attributes are present in the
initial HTML response, before JavaScript runs. No build step rewrites exported
HTML or Next's prerendered files. Localized content also declares its language
and direction. Crossing between root layouts causes a full document navigation.

`check-multilingual.cjs` verifies document attributes, localized headings and
descriptions, self-canonicals, WebPage schema, all reciprocal language alternates
and sitemap coverage. When Next's prerender directory exists, it also verifies
every known language landing file there and requires it to match the validated
static export. Deploy the complete `npm run build` lifecycle, including the
read-only `postbuild` checks. These checks also run through
`npm run check:export` or `npm run check:i18n`. After deployment, verify the raw
HTTP response for the language URLs as well as their browser appearance.

The optional Supabase archive sync retains the committed reviewed archive when
the source has a temporary network outage. The build still filters expired
reviews, and authentication or database-schema failures still stop the sync.
Healthy syncs continue to refresh the archive normally. Run
`node --test scripts/trending-sync-fallback.test.cjs` to check these cases.

## Content and search quality

The pages describe the existing trip-planning service. They do not invent
prices, availability, ratings, testimonials or multilingual guide staffing.
Search engines choose their own rankings and presentation. Translations should
receive native-speaker review before new complex travel, safety or legal content
is added.
