# Instagram alongside Facebook

Status on 13 November 2026: **awaiting account authorization**.

The existing Facebook connection (`7833051`) returned no Instagram accounts.
The other saved Facebook connection (`7429562`) could not read its account
options. No Instagram publishing modules have been enabled yet.

## Authorization

[Authorize Katpana Desert Instagram in Make](https://eu1.make.com/1704156/credentials-requests/inbox?requestId=8834e0b5-a4af-4396-a7ff-63ba5f146e0e).

Request ID: `8834e0b5-a4af-4396-a7ff-63ba5f146e0e`.
Use `connection_get` to inspect completion and collect the new connection ID.
Resolve `/mapper/accountId` with `module_field_resolve` for
`instagram-business:CreatePostPhoto` before selecting the destination account.

Make's Facebook-login Instagram app requires an Instagram **Business** account
linked to a Facebook Page, with the authorizing Facebook user holding admin
access. If the account list is empty after authorization, check that linkage
in Meta Business Suite. The app's current documentation says Creator accounts
are not supported by this particular integration.

## Intended behavior

Extend existing scenario `8551535`: daily photo at **09:00 Pakistan time**,
Sunday Reel, and the same dated topic Reel as Facebook. Preserve the Facebook
schedule and avoid replaying Facebook posts while testing Instagram.

Confirmed modules and fields:

- `instagram-business:CreatePostPhoto`, version 1:
  `parameters.__IMTCONN__`, `mapper.accountId`, `image_url`, `caption`.
- `instagram-business:CreateAReelPost`, version 1:
  same connection/account plus `video_url`, `caption`, `share_to_feed`.

Instagram requires public media URLs. Unlike the Facebook Reel module, this
module does not accept embedded binary video. `facebook-pages:GetVideo` exposes
a `source` URL that may be reusable after Facebook finishes processing; verify
that URL and Instagram's ability to download it before relying on it. Otherwise
provide durable public MP4 hosting. Never substitute a Facebook watch/permalink
page for a direct video URL.

Captions must fit Instagram's 2200-character limit while retaining required
image credits. The current evergreen photo captions fit comfortably, but
full-article captions need a separate short version.

Seven catalog photographs meet the documented photo aspect-ratio range.
`hunza-valley.jpg` is 2448x3264 (3:4), outside the supported 4:5 to 1.91:1
range. Prepare and host a compatible crop before enabling that day's photo.
JPEGs also need to remain within the 8 MiB file limit.

Cached, ignored inspection results and the connection request are in
`.supabase/instagram-*.json`. Use the live module schemas when implementing.

Documentation: https://apps.make.com/instagram-business
