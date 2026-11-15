# Localized inner pages

The language selector preserves the current route, query string and anchor.
English has no prefix; the other 19 languages use their language code, for
example `/fr/destinations/deosai-national-park/`.

The localized catch-all route reuses the original English page components and
content. Translation happens during server rendering, including headings,
paragraphs, image descriptions, forms, metadata and JSON-LD. Visitors and search
engines receive translated HTML without contacting a translation service.
Navigation, breadcrumbs, search results and related-page links retain the locale.
Form values, handlers, IDs, external links and original editorial noindex rules
remain intact. Each language version has its own canonical and reciprocal
hreflang links; completed indexable translations also appear in the sitemap.

The translation dictionaries support all 19 non-English languages, including
full tour itineraries, inclusions and exclusions, FAQs,
article bodies, destination details, trek information and shared interface text.
`i18n:test` checks dictionary completeness and renders real tour, article,
destination and trek pages in every language to detect English body fallbacks.

For local Gemini maintenance, use `npm run i18n:translate:gemini` with the
project's `GEMINI_API_KEY` and `GEMINI_MODEL` in the ignored local environment
files. Each completed batch is saved atomically and subsequent runs resume
missing entries. No API credential is committed or stored in GitHub. The
public endpoint remains available through `i18n:translate`.

## Translation maintenance

```powershell
npm.cmd run i18n:extract
# Review data/translations/source.json before sending any text externally.
npm.cmd run i18n:translate
npm.cmd run i18n:test
npm.cmd run build
```

`i18n:extract` regenerates the route registry from the English route tree and
collects the actual rendered copy, metadata and interactive labels. This includes
publicly accessible draft article routes: review the corpus before external use.

`i18n:translate` is an optional maintenance script that sends that corpus to
Google's translation endpoint and writes a resumable JSON dictionary per language.
It is never run by the build, production site or daily publishing workflow. The
endpoint requires internet access and may be unavailable or rate limited; reviewed
translations can instead be supplied directly in `data/translations/<code>.json`.
Dictionary keys are original English strings with whitespace normalized. Review
machine translations before release, particularly route and booking information.

A missing or incomplete dictionary produces a noindex preview and is excluded
from the sitemap. Complete the dictionaries before deploying the multilingual
rollout or releasing new source content. Run extraction and translation again
when page copy changes. English content keeps its existing indexing behavior.
