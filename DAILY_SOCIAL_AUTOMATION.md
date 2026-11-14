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
Photo captions and Reel descriptions include photographer, source and licence credits.
No text, image, video-generation or music API key is needed for this pipeline.

Each preparation downloads four distinct destination photos from Wikimedia Commons.
One becomes the square daily post; the other three become a musical portrait
slideshow with gentle zoom, topic text and a call to action. These are archive
destination photos, not a live report of current conditions. Explicitly labelled
AI images, maps, drawings and unrelated destinations are filtered out.

Only JPEGs with usable dimensions, author/source metadata and recognized CC0,
public-domain or CC BY licences are accepted. Other licence terms are skipped.
Credits identify cropping/animation and link to each source and licence. Full
provenance is saved in `photos.json`, Reel metadata and the Make variables.
The 90-entry history tracks photo IDs and original/download hashes to avoid
recent reuse, even if a new video edit would have a different file hash.
If too few unused licensed photos are available, preparation fails instead
of reusing the old clip. This feature needs network access to Wikimedia Commons.

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
