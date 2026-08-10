# Content editorial workflow

The site deliberately separates search demand from publishable travel advice. A keyword opportunity can create a draft, but it cannot make that draft accurate, current, or safe enough to index.

## Indexing gate for `/articles/`

The generated article library defaults to `editorialStatus: "draft"`. Draft pages:

- remain available for internal review and existing bookmarks;
- use `noindex,follow`;
- emit no `Article` structured data; and
- receive no internal promotion and are excluded from the XML sitemap.

To approve an article, add all four fields to its seed in `data/articles.ts`:

```ts
editorialStatus: "reviewed",
reviewedBy: "Full name and role",
reviewedAt: "YYYY-MM-DD",
evidenceSources: ["https://authoritative.example/source"]
```

The code checks every field. Changing only the status does not make a page indexable.

## Review checklist

1. Match one primary intent and one content cluster; merge or redirect overlapping pages.
2. Replace repeated template prose with route-specific first-hand detail.
3. Verify access, permit, season, altitude, journey-time and safety claims close to publication.
4. Cite official or primary sources for changeable facts and record the date checked.
5. Confirm every photo belongs to the stated place and write literal alt text only when the image conveys content.
6. Add useful internal links to a parent guide, destination, matching tour and safety/terms page.
7. Have a named local route specialist approve the page.
8. Recheck the built canonical, robots directive, schema and sitemap entry before release.

Review content after a material route or permit change and at least once per operating season. If a claim can no longer be verified, return the article to `draft` until it is corrected.

## SEO-led trending workflow

Trending topics use the same principle: search data may propose a brief, but a human must confirm relevance, evidence, originality and local accuracy. The implementation details and approval states are documented in `supabase/TRENDING_EDITORIAL_WORKFLOW.md`.
