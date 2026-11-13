// Render a silent vertical Reel from the site's CC0 Katpana photograph.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ffmpeg = process.env.FFMPEG_PATH || process.argv[2] || "ffmpeg";
fs.mkdirSync(".supabase", { recursive: true });
const font = process.env.SOCIAL_FONT_PATH || "C:/Windows/Fonts/arialbd.ttf";
if (!fs.existsSync(font)) throw new Error("Set SOCIAL_FONT_PATH to a TrueType font.");
fs.copyFileSync(font, ".supabase/social-font.ttf");
const output = ".supabase/katpana-desert-reel.mp4";
const filters = [
  "scale=1080:1920:force_original_aspect_ratio=increase",
  "crop=1080:1920",
  "zoompan=z='1+0.0002*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=300:s=1080x1920:fps=25",
  "drawbox=x=0:y=1390:w=iw:h=530:color=black@0.5:t=fill",
  "drawtext=fontfile=.supabase/social-font.ttf:text='KATPANA DESERT':fontcolor=white:fontsize=68:x=(w-tw)/2:y=1460",
  "drawtext=fontfile=.supabase/social-font.ttf:text='SKARDU - PAKISTAN':fontcolor=white:fontsize=42:x=(w-tw)/2:y=1560",
  "drawtext=fontfile=.supabase/social-font.ttf:text='Plan your next adventure':fontcolor=white:fontsize=38:x=(w-tw)/2:y=1660",
  "format=yuv420p",
].join(",");
const result = spawnSync(ffmpeg, [
  "-y", "-hide_banner", "-loglevel", "error",
  "-i", "public/images/places/katapana-desert.jpg",
  "-vf", filters, "-t", "12", "-an", "-c:v", "libx264",
  "-preset", "fast", "-crf", "33", "-maxrate", "300k", "-bufsize", "600k",
  "-movflags", "+faststart", output,
], { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log(JSON.stringify({ output: path.resolve(output), bytes: fs.statSync(output).size }));
