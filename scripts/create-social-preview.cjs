// Local or GitHub Actions preview; never updates Make or publishes a post.
const path = require("node:path");
const { selectPhotos } = require("./social-photos.cjs");
const { recordedMusic } = require("./social-recorded-music.cjs");
const { render } = require("./create-topic-reel.cjs");
const { pakistanDate } = require("./reel-topic.cjs");
const { hostOriginalVideo } = require("./social-hosting.cjs");

async function preview() {
  const directory = path.resolve(".supabase/reels/internet-preview");
  const date = pakistanDate();
  const photos = await selectPhotos({ topic: "Hunza valley", date, directory, count: 3, minCount: 2 });
  const music = await recordedMusic({ directory });
  const reel = render({ topic: "Discover Hunza Valley", date, out: directory, photos, music: music.path, musicCredit: music.credit, musicStart: music.start });
  if (process.env.SOCIAL_HOST_VIDEO === "true") reel.hosted = await hostOriginalVideo({ file: reel.video, date });
  return reel;
}
preview().then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => { console.error(error.message); process.exitCode = 1; });
