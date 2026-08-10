# SEO travel-update editorial workflow

The `generate-trending-article` function now creates bounded SEO drafts. It never publishes an article, posts it to Facebook, or selects an arbitrary Google Trends topic.

## 1. Apply and deploy

Apply migrations `202608100001_harden_trending_editorial_workflow.sql` and `202608100002_schedule_weekly_trending_drafts.sql`, then deploy the Edge Function. The first migration archives legacy auto-published rows that have no documented human review. The second replaces the daily job with one weekly draft job.

## 2. Create a draft

The weekly job chooses the first unused intent from the approved SEO catalog. To request a particular approved intent and supply evidence, call the function with a body like this:

```json
{
  "intentKey": "deosai-road-access-status",
  "citations": [
    {
      "id": "1",
      "title": "Exact source-page title",
      "publisher": "Responsible authority or first-party operator",
      "url": "https://example.gov.pk/exact-page",
      "accessed_at": "2026-08-10T09:00:00+05:00",
      "notes": "What this source supports; do not paste source copy"
    }
  ],
  "localEvidence": [
    {
      "id": "local-1",
      "type": "field-check",
      "description": "Specific observation or check, including its limitations",
      "observed_at": "2026-08-10T08:00:00+05:00",
      "location": "Deosai road from Skardu",
      "verified_by": "Full reviewer or guide name"
    }
  ]
}
```

Allowed local-evidence types are `field-check`, `guide-note`, `operator-record`, and `traveler-question`. A traveler question can document real search demand, but it cannot verify a changing factual claim; approval also requires at least one field check, guide note, or operator record. Only HTTPS citations are accepted. The generator stores exactly the supplied citation and evidence objects; it is not allowed to invent either. Use a verifier name only with that person's consent, and never put traveler contact, passport, health, or payment data in an evidence record.

## 3. Review in Supabase

Open the new row in `public.trending_articles`. It must remain `draft` or `in_review` while the editor:

1. Confirms the primary query has a distinct intent from the `canonical_parent` page.
2. Checks every route, price, permit, availability, timing, weather, safety, and access claim against the cited source or named local record.
3. Removes generic destination copy, hype, keyword repetition, and unsupported claims.
4. Confirms at least four substantive sections, a useful introduction, a next step to the canonical parent, and visible source context.
5. Completes `citations`, `local_evidence`, and `editorial_summary`. Do not insert fabricated reviews, field checks, dates, or credentials.
6. Reviews the mobile layout, links, headings, keyboard behavior, and booking path in preview.

Do not update `status` directly to `published`. The database constraint will reject incomplete publication data.

## 4. Approve

After the human review, run this in the Supabase SQL editor using the draft UUID and the actual reviewer name:

```sql
select public.approve_trending_article(
  p_article_id := '00000000-0000-0000-0000-000000000000'::uuid,
  p_reviewed_by := 'Reviewer full name',
  p_editorial_notes := 'Checked intent overlap, all volatile facts, source-to-claim support, local evidence, safety wording, copy quality, links, and mobile presentation.',
  p_next_review_at := current_date + 30
);
```

The approval function rejects articles without a unique intent, at least 600 words of substantive section copy, at least one complete HTTPS citation, at least one named and dated local evidence record, or adequate editorial notes. It sets the verification, review, and publication timestamps. Only `service_role` can execute it.

## 5. Build and release

Run a new production build after approval. The `prebuild` archive sync exports only approved rows that pass a second static validation gate. Those articles receive indexable `/trending/<slug>/` pages. The `/trending/` collection remains `noindex,follow` while empty, then becomes indexable only when it has approved, server-rendered article links.

After checking the deployed canonical URL, an editor may run the separate Facebook publishing script. Social publishing is intentionally decoupled from draft generation and approval.

To withdraw an update, set it to `archived`, add a reason to `editorial_notes`, choose the best relevant permanent redirect, and rebuild. To refresh an existing intent, edit the same row and URL—never create a date-stamped replacement. A material edit to published copy, intent fields, citations, or local evidence automatically changes the row to `in_review` and clears its prior approval stamp; reapprove it after the new verification pass.
