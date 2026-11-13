# Reels with music

Double-click **Create-Reel.cmd**, or run `npm run reels` from this project.
In PowerShell, use `npm.cmd` instead of `npm` if script execution is blocked.

The menu offers:

1. Create a **12-second vertical Reel** from moving footage with an original
   instrumental track, topic text, and a closing call to action.
2. Generate a topic-matched **prompt/brief for an AI video service**.
3. Queue a finished Reel in the existing Make scheduler for its selected date.

The local renderer calls no paid AI API. It edits moving video; it does not
generate new scenes from a text prompt. By default it uses the travel footage
already in the project. You can select your own footage or a video exported
from a generation service and your own licensed music instead. Source audio
is replaced by the selected music bed. Short clips are rejected rather than
silently stretched or looped to meet the minimum length.

## Match the daily post

The default topic follows the **same date and photo rotation as Make**, using
Pakistan time. Choose the intended publishing date before rendering. This is
the existing evergreen content rotation, not a live trends feed.

For a trending article, supply its exact JSON payload. The existing Facebook
webhook payload works: the renderer reads `article.title`, `article.excerpt`,
`post_caption`, and the article URL. A plain object with `title`, `excerpt`,
`url`, and `message` also works. No trending topic or current conditions are
invented. Supply footage relevant to that article.

```powershell
# Default topic for a particular day's existing photo post:
npm run reels:create -- --date 2026-11-14

# Match a supplied daily/trending article using your video and music:
npm run reels:create -- --post daily-post.json --date 2026-11-14 --video travel.mp4 --music licensed-track.mp3 --seconds 12

# Produce an AI-video prompt without rendering or making API calls:
npm run reels:create -- --post daily-post.json --date 2026-11-14 --brief
```

The date examples above must be changed when they are in the past.

Outputs are saved in `.supabase/reels/<date>-<topic>/`:

- `reel.mp4`: 720x1280 H.264, AAC music, 10-60 seconds (12 by default).
- `reel.json`: topic, date, caption, duration and video path for Make.
- `generation-prompt.txt` and `brief.json`: scene and music direction.
- `original-music.wav`: instrumental composed by the local workflow when no
  user music file is selected. No recordings or song samples are used.

Preview the video before queuing. The default footage is illustrative travel
imagery; it does not verify a specific location or current conditions. This is
stated in its caption. Use location-matched footage for a factual destination
report. Photo credits from the evergreen photo caption are removed from the
Reel caption; the video and music credits are supplied instead.

## Queue in Make

Choose option 3 in the menu and paste the path to the generated `reel.json`, or:

```powershell
npm run reels:queue -- .supabase/reels/2026-11-14-hunza-on-your-travel-wish-list/reel.json --dry-run
npm run reels:queue -- .supabase/reels/2026-11-14-hunza-on-your-travel-wish-list/reel.json
```

The Reel runs at **09:00 Pakistan time on its date**, through the existing
Facebook connection. The daily photo schedule remains active. The original
weekly Reel resumes on other Sundays; on a Sunday with a queued topic Reel,
the older weekly video is skipped to avoid posting two Reels.

There is **one pending topic Reel slot**. Queuing another video replaces it;
this is not a multi-day queue. The dated filter stops the video repeating on
later days. Uploading the file to Make happens when you queue it, so this
computer need not stay on afterward. The script does not publish immediately.

## Publish a live Facebook test

To publish a prepared Reel immediately:

```powershell
npm run reels:publish-test -- .supabase/reels/2026-11-13-karakoram-travel-inspiration/reel.json
```

This is a real public Facebook upload. The script temporarily gates off the
other routes, uses the existing queued-Reel route for the test, then restores
its original video and all route filters. The future schedule is kept in Make;
GitHub does not run the publishing clock. Pushing this repository saves the
automation code, while Make continues running the configured daily and weekly
schedule independently of this computer.

Make's request size requires compact video: the queue accepts up to 650 KB.
The default 12-second renderer is tuned for this limit. Longer or complex
videos may exceed it and need URL-based hosting before they can be automated.

Rendering is local and on demand. Make does not run FFmpeg, fetch live trends,
or generate a fresh AI video unattended. Those tasks need a connected video
provider or a separate rendering worker/feed. Supabase was paused at setup;
the option accepts article JSON even while that feed is unavailable.

## AI-generated scenes and ChatGPT Plus

ChatGPT Plus does not provide general-purpose Make video API access or include
third-party video-generation credits. OpenAI's Videos API and Sora models were
retired on **24 September 2026**; do not configure a new Sora API integration.

Runway is an optional connected service for creating new AI video and audio.
It needs its own account connection and available credits. Use the generated
brief there, export a clip of at least 10 seconds, then import it through the
Reel Studio menu. No Runway account has been connected by this setup.

Official sources:
- https://developers.openai.com/api/docs/deprecations
- https://developers.openai.com/api/docs/guides/chatgpt-api-credits

## Requirements and checks

FFmpeg is required. The current workspace has a local copy in
`.supabase/package/ffmpeg.exe`; on another machine install FFmpeg and set
`FFMPEG_PATH`. The renderer also accepts `--ffmpeg <path>` and `--font <path>`.
Keep the `.supabase` output and `.env.local` private and out of Git.

`npm run reels:test` checks date/topic matching, valid durations, original audio
output, supplied article handling, and Make queue behavior.
