# Daily posts and Reels

The production schedule prepares a **different photo post and 12-second musical
Reel each day**, with the same travel topic and short caption on both.

## Schedule

- **07:37 Pakistan time:** GitHub Actions fetches fresh travel topics, prepares
  the caption, renders video/music and a square photo, and saves them in Make.
- **09:00 Pakistan time:** Make publishes the prepared photo and Reel.
- The old repeating Sunday Reel is disabled. The eight-photo catalog is no
  longer used by the production schedule.

[Daily preparation workflow](https://github.com/johari9292/Katpana-Desert-Tour/actions/workflows/daily-social.yml)
and [Make publishing scenario](https://eu1.make.com/1704156/scenarios/8551535/edit).

The first daily topic prepared on 13 November 2026 is **Askole: winter travel
planning**, scheduled for **14 November at 09:00 Pakistan time**.

## Fresh topics and variety

The worker first checks Pakistan's Google Trends RSS for travel-related topics.
When no relevant search trend exists, it uses travel-related Google News items
from the last seven days. That fallback is recent travel news inspiration,
not a claim that a subject ranks in Google Trends.

It excludes unrelated sports/political/crisis topics, previously used source
URLs, repeated titles/captions and duplicate video files. History is retained
in the workflow cache, with the current prepared topic also recorded in Make.
Repeated runs for the same prepared date do not overwrite it.

Titles and captions are planning invitations based on the source subject.
They do not report unverified current road, weather, price or safety conditions.
Sources and license/provenance details stay in internal records, not captions.
No text, image, video-generation or music API key is needed for this pipeline.

Each day's video edit uses a new topic/date seed to change the footage start,
framing, title and original music arrangement. The square photo is extracted
from that edit. The current footage library is the existing licensed travel
clip; this creates different edits, not newly filmed or AI-generated scenes.
Adding more owned/licensed footage is the next step for greater scene variety.

The worker uses the Pexels-licensed clip already in the repository, whose
license does not require public attribution. It does not strip required credits
from Creative Commons photos: those images are excluded from this daily flow.

## Failure behavior

Both publishing routes require the content date to equal today's Pakistan date.
If the feed, renderer or preparation job fails, the old video/post is skipped
instead of repeating it. A workflow failure is visible in GitHub Actions.
GitHub cron may run late; preparation is scheduled ahead of the publishing slot.
Make consumes its normal account credits, and Actions uses the repository's
runner allowance. No additional video-generator account has been enabled.

## Maintenance

Repository secrets: `MAKE_MCP_API_KEY` and `MAKE_MCP_URL`. Values are encrypted
in GitHub's secret store and never committed. They are already configured.

```powershell
npm.cmd run social:prepare -- --dry-run
npm.cmd run social:prepare
npm.cmd run social:test
```

`SOCIAL_TARGET_DATE=YYYY-MM-DD` chooses a future 09:00 Pakistan slot; otherwise
the next slot is selected. In GitHub, use **Run workflow → target_date**.
Prepared MP4/JPEG/JSON files are retained as workflow artifacts for seven days.
Do not rerun publication directly to retry preparation: preparation does not
publish immediately, and Make owns the publishing clock.

The earlier one-slot manual queue refuses to overwrite the active daily flow.
Reel Studio option 3 now prepares the next matching post/Reel together. The
explicit `reels:publish-test` command still publishes a selected test Reel and
restores the daily schedule afterward.

Supabase remains independent of this flow; its paused state does not prevent
daily topic selection, rendering or Facebook publication.
