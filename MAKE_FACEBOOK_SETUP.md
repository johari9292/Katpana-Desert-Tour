# Katpana Desert Facebook automation

**Current production behavior:** daily fresh-topic photo **and Reel** at 09:00
Pakistan time. See [DAILY_SOCIAL_AUTOMATION.md](DAILY_SOCIAL_AUTOMATION.md).
The old repeating Sunday Reel and eight-photo rotation described in the
original setup below have been superseded by this daily flow.

## Live configuration

- Make zone: `eu1.make.com`, team `1704156`.
- Facebook Page: **Katpana Desert (Skardu)**, ID `668690229664491`.
- Existing article webhook: scenario `5891502`.
- New media schedule: [scenario 8551535](https://eu1.make.com/1704156/scenarios/8551535/edit).
- Credentials are stored only in ignored `.env.local`.

The new scenario is active. It runs daily at **09:00 Pakistan time**. Make's
next execution was verified as `2026-11-14T04:00:00.000Z`, equivalent to 09:00
in `Asia/Karachi`. An image is published every day; a Reel is also published on
Sunday, checked explicitly in Pakistan time.

Eight existing destination photographs and captions rotate every eight days.
Captions include source and license credits. This is an evergreen rotation,
not fresh AI content on each run. The weekly Reel reuses a silent, vertical
1080x1920, 12-second animation of the CC0 Katpana photograph with slow motion
and text. Its binary is embedded in Make, so this computer and separate video
hosting do not need to stay online.

No paid image or video generator is used. Make still meters operations against
the account's credit allowance. Facebook reports the existing connection as
expiring; reconnect it in Make when needed.

## Verified on 13 November 2026

- Dry run: photo selection, caption line breaks and publishing guard passed.
- All eight photo URLs returned HTTP 200 with image content types.
- Photo post: `668690229664491_122199601934915220`.
- Reel upload: `3339873096223519`.
- Both Facebook module runs succeeded. The Sunday-only Reel filter was restored
  after the upload test; the active daily schedule was checked again afterward.

## Maintenance

For moving-footage Reels with music, double-click `Create-Reel.cmd` or run
`npm run reels`. See [REELS_WORKFLOW.md](REELS_WORKFLOW.md) for generation,
import, article-topic matching and dated Make delivery. A Hunza-topic sample
with music was queued for **14 November 2026 at 09:00 Pakistan time**. The
additional dated Reel route preserves the daily photos and weekly Reel;
the original weekly Reel is skipped on dates with a queued topic Reel.

```powershell
node scripts/make-mcp.cjs
node scripts/supabase-management-api.cjs projects
```

The MCP helper accepts a tool name followed by an optional JSON argument file.
For example, call `scenario_get` with `{"scenarioId":8551535}` to inspect the
live configuration. Follow the input schema returned by `tools/list`.

The catalog is `data/facebook-evergreen.json`. Local edits do not automatically
change the live scenario. The exported `variables` function in
`scripts/setup-facebook-scheduler.cjs` builds module 1's configuration; update
it with `scenario_patch` using the latest `lastEdit` from `scenario_get`.
The creation script checks an ignored state file to avoid duplicate creation.
On another computer, reuse scenario 8551535 instead of running creation again.

To recreate the Reel with FFmpeg installed:

```powershell
node scripts/render-social-reel.cjs path/to/ffmpeg
```

Set `SOCIAL_FONT_PATH` to a TrueType font if Windows Arial Bold is unavailable.
The output is `.supabase/katpana-desert-reel.mp4`. To replace the live video,
update module 4's binary mapping in Make, preserving its connection, Page and
Sunday filter. Do not print or commit credentials when inspecting configuration.

## Supabase

The refreshed access token works. The project was reported **INACTIVE (paused)**.
The new media schedule runs directly in Make and does not depend on Supabase.
The older article-generation workflow needs the project resumed before it can
run again. Webhook acceptance alone does not prove Facebook publication.

Make documentation: https://developers.make.com/mcp-server
Facebook modules: https://apps.make.com/facebook-pages
