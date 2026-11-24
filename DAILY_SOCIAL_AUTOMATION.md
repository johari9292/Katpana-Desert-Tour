# Daily posts and Reels

The production schedule prepares a **different photo post and 12-second musical
Reel each day**, with the same travel topic and separate photo/Reel captions.

## Schedule

- **07:37 Pakistan time:** GitHub Actions fetches fresh travel topics, prepares
  the caption, renders video/music and a square photo, and saves them in Make.
- **09:00 Pakistan time:** Make publishes the prepared photo and one Reel.
- Only one Facebook Reel route is enabled; the scenario runs sequentially.
- Every new Facebook Reel is followed by a comment containing the full website
  link, https://www.katpanadesert.com/. New captions also include that URL.
  A video overlay is visual text; the clickable destination is the URL next to it.
- The old repeating Sunday Reel is disabled. The eight-photo catalog is no
  longer used by the production schedule.

[Daily preparation workflow](https://github.com/johari9292/Katpana-Desert-Tour/actions/workflows/daily-social.yml)
and [Make publishing scenario](https://eu1.make.com/1704156/scenarios/8551535/edit).

## Fresh topics and variety

The worker first checks Pakistan's Google Trends RSS for travel-related topics.
When no relevant search trend exists, it uses travel-related Google News items
from the last seven days. That fallback is recent travel news inspiration,
not a claim that a subject ranks in Google Trends.

It excludes unrelated sports/political/crisis topics, previously used source
URLs, syndicated headlines, repeated titles/captions and duplicate video files.
Within each source type, destinations used less in the last seven preparations
are preferred. History is retained
in the workflow cache, with the current prepared topic also recorded in Make.
Repeated runs for the same prepared date do not overwrite it.

Titles and captions offer topic-specific planning or photography ideas for
winter, transport, heritage, lakes, trekking, desert and general travel topics.
Photo posts and Reels have distinct captions. Each uses up to five relevant
brand, destination, region and subject hashtags. No hashtag or topic selection
promises viral reach. Three timed text scenes carry the idea through the Reel.
They do not report unverified current road, weather, price or safety conditions.
Photo captions and Reel descriptions include photographer, source and licence credits.
Political images and nonscenic place-name matches are excluded from photo selection.
No text, image, video-generation or music API key is needed for this pipeline.

Each preparation seeks up to four distinct destination photos from Wikimedia Commons,
searching up to 200 results per destination.
One becomes the square daily post; the others become a musical portrait
slideshow with gentle zoom, topic text and a call to action. If only one new,
relevant licensed photo is available, both formats use it, with an animated
Reel and three timed text scenes. These are archive
destination photos, not a live report of current conditions. Explicitly labelled
AI images, maps, drawings and unrelated destinations are filtered out. Ambiguous
names such as K2 also require geographic context; planetary illustrations and
military subjects are excluded.

Only JPEGs with usable dimensions, author/source metadata and recognized CC0,
public-domain or CC BY licences are accepted. Other licence terms are skipped.
Credits identify cropping/animation and link to each source and licence. Full
provenance is saved in `photos.json`, Reel metadata and the Make variables.
The 90-entry history tracks photo IDs and original/download hashes to avoid
recent reuse, even if a new video edit would have a different file hash.
If no unused licensed photos are available for Katpana, Skardu, Baltistan or
Pakistan, preparation can use the checked-in CC0 Katpana photograph credited to
Abdullah Shakoor if it has not been used in the retained history. It records that
fallback in the photo provenance and renders a new video with new copy and music.
For other destinations it tries another topic rather than showing the wrong place.
When feeds are unavailable or fresh candidates cannot be prepared, evergreen
Katpana planning ideas also search Commons for unused photos. Evergreen ideas are
recorded as `evergreen-travel`, never presented as current news or trends. If no
unused suitable photo is available, preparation fails instead of repeating the
local image. History covers up to 90 preparations, not all time.

## Supplied video and music

The default Reel is an animated photo slideshow with synthesized instrumental
music; it is not generated or filmed footage. To use actual travel footage and
recordings you are allowed to publish, add `social-media/manifest.json` and the
referenced files to the environment running the worker. For GitHub Actions,
the files must be available in the checkout or explicitly provisioned on the
runner; files only on your computer are not available to the scheduled job.
For example:

```json
{
  "videos": [{ "id": "hunza-1", "file": "hunza.mp4", "destinations": ["Hunza"], "credit": "Footage by ...", "permission": "Permission for Facebook and Instagram business posts" }],
  "music": [{ "id": "track-1", "file": "track.mp3", "credit": "Track and artist", "permission": "Licensed for Facebook and Instagram business posts" }]
}
```

The worker selects footage only for its matching destination and rotates the
least recently used entries. Footage must be at least 12 seconds; source audio
is replaced. If there is no matching footage, the photo slideshow is used. If
there is no supplied track, the original instrumental is used. Credits are
included in the Reel caption; media IDs are kept in the rotation history. IDs
must be unique within each list, and file paths must be inside the manifest
folder. Malformed manifests or missing files stop preparation.

The listed commercial songs are not bundled or licensed by this project.
Only add recordings when you have the necessary permissions for these uses and
platforms. Meta's available music and permissions can vary by account and use;
its Sound Collection is another option. Adding a track to this manifest does
not itself obtain rights. The workflow does not generate realistic AI video;
use real cleared clips or supply an exported generated clip with appropriate rights.

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

## Instagram sharing

The same daily video can be shared to Instagram after its Business account is
linked to the Katpana Desert Facebook Page and authorized in Make. The current
Facebook-login connector requires a Business account, not a personal/Creator
account. See https://apps.make.com/instagram-business.

```powershell
npm.cmd run social:configure
npm.cmd run social:instagram
```

The first command maintains the daily schedule and website-link comment. The
second checks the saved authorization request, resolves the actual linked account,
then adds a Facebook video lookup and one Instagram Reel module. It does not
publish immediately. No email/password login is stored or used.

Instagram uses the published Facebook video source URL and the complete credited
Reel caption. Captions longer than 2,200 characters fail preparation rather than
losing attribution. The Instagram route requires that caption and a downloadable
video, and retains the dated publishing gate. Add the website to the Instagram
profile Links field for a clickable profile destination; caption URL clickability
depends on the account and features Meta exposes.

Instagram sharing is connected to **@katpanadesert**. The existing daily Reel
is followed by its website-link comment, a Facebook video lookup and one Instagram
Reel module. The Instagram caption preserves the full photo credits and includes
the website URL. It can fall back to the published Facebook video description
when an older preparation worker does not provide `reel_publish_caption`.
Captions with insufficient space for the website link are gated before upload.
The schedule remains once daily at 09:00 Pakistan time.
