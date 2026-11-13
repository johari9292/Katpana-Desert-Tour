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

## Production build requirement

Deploy the complete `npm run build` lifecycle, including `postbuild`. The Next.js
static export shares the existing English root layout. Because that layout
cannot read a descendant language parameter, `normalize-export-locales.cjs`
sets only the opening document element's `lang` and `dir` in each known landing
page's HTML in both `out/` and `.next/server/app/`. The current Vercel deployment
serves Next's prerendered HTML, so normalizing only `out/` does not cover the live
response. Other static hosts can serve `out/` directly. Both copies must carry
the same document attributes, content and SEO data. Localized content also
declares its language and direction, and `LocaleDocument` keeps the document
attributes correct during navigation.

`check-multilingual.cjs` verifies document attributes, localized headings and
descriptions, self-canonicals, WebPage schema, all reciprocal language alternates
and sitemap coverage. When Next's prerender directory exists, it also verifies
every known language landing file there and requires it to match the validated
static export. It runs automatically after production builds and through
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
