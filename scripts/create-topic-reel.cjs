const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { resolvePost, briefFor } = require("./reel-topic.cjs");
const { createMusic } = require("./reel-music.cjs");

function args(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, "");
    if (["brief", "help"].includes(key)) options[key] = true;
    else if (["post", "topic", "date", "seconds", "video", "music", "out", "ffmpeg", "font"].includes(key)) {
      if (!argv[i + 1] || argv[i + 1].startsWith("--")) throw new Error(`Missing value for --${key}`);
      options[key] = argv[++i];
    } else throw new Error(`Unknown option: ${argv[i]}`);
  }
  return options;
}

function wrap(text, width = 27, maxLines = 3) {
  const lines = [""];
  for (const word of text.replace(/\s+/g, " ").split(" ")) {
    const current = lines.length - 1;
    if (lines[current].length + word.length + 1 > width && lines[current]) lines.push(word);
    else lines[current] += (lines[current] ? " " : "") + word;
  }
  if (lines.length > maxLines) lines[maxLines - 1] = lines[maxLines - 1].slice(0, width - 3) + "...";
  return lines.slice(0, maxLines).join("\n");
}

function ffmpegPath(options) {
  const candidate = options.ffmpeg || process.env.FFMPEG_PATH ||
    (fs.existsSync(".supabase/package/ffmpeg.exe") ? ".supabase/package/ffmpeg.exe" : "ffmpeg");
  return candidate.includes("/") || candidate.includes("\\") ? path.resolve(candidate) : candidate;
}

function render(options) {
  const seconds = Number(options.seconds || 12);
  if (!Number.isInteger(seconds) || seconds < 10 || seconds > 60) throw new Error("--seconds must be an integer between 10 and 60.");
  const post = resolvePost(options);
  const seed = createHash("sha256").update(`${post.date}:${post.title}`).digest().readUInt32LE(0);
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "travel";
  const directory = path.resolve(options.out || `.supabase/reels/${post.date}-${slug}`);
  fs.mkdirSync(directory, { recursive: true });
  const brief = briefFor(post, seconds);
  const briefPath = path.join(directory, "brief.json");
  fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2));
  fs.writeFileSync(path.join(directory, "generation-prompt.txt"), brief.generationPrompt + "\n");
  if (options.brief) return { brief: briefPath, topic: post.title, source: post.source };

  const source = path.resolve(options.video || "public/videos/skardu-destinations.mp4");
  if (!fs.existsSync(source)) throw new Error("Video not found. Use --video with footage or an exported generated video.");
  const output = path.join(directory, "reel.mp4");
  if (source === output) throw new Error("Input video and output must be different files.");
  const ffmpeg = ffmpegPath(options);
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", source], { encoding: "utf8" });
  if (probe.error) throw new Error(`FFmpeg unavailable: ${probe.error.message}. Set FFMPEG_PATH or --ffmpeg.`);
  const duration = probe.stderr?.match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!duration || !/Video:/.test(probe.stderr)) throw new Error("Could not inspect the source video.");
  const available = Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]);
  if (available < seconds) throw new Error(`Source video is ${available}s; supply at least ${seconds}s of footage.`);
  const font = path.resolve(options.font || process.env.SOCIAL_FONT_PATH || (process.platform === "win32" ? "C:/Windows/Fonts/arialbd.ttf" : "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"));
  if (!fs.existsSync(font)) throw new Error("Set --font or SOCIAL_FONT_PATH to a TrueType font.");
  fs.copyFileSync(font, path.join(directory, "font.ttf"));
  fs.writeFileSync(path.join(directory, "title.txt"), wrap(post.title));
  fs.writeFileSync(path.join(directory, "cta.txt"), "Plan your next adventure\nkatpanadesert.com");
  const music = options.music ? path.resolve(options.music) : createMusic(path.join(directory, "original-music.wav"), seconds, seed);
  if (!fs.existsSync(music)) throw new Error("Music file not found.");
  if (music === output) throw new Error("Music input and output must be different files.");
  const filter = [
    `[0:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280:x=(iw-ow)*${0.15 + (seed % 71) / 100},setsar=1,fps=25`,
    ",drawbox=x=0:y=840:w=iw:h=440:color=black@0.55:t=fill",
    ",drawtext=fontfile=font.ttf:text='KATPANA DESERT':expansion=none:fontcolor=white:fontsize=24:x=48:y=875",
    `,drawtext=fontfile=font.ttf:textfile=title.txt:expansion=none:fontcolor=white:fontsize=39:line_spacing=12:x=48:y=932:enable='lt(t,${seconds - 4})'`,
    `,drawtext=fontfile=font.ttf:textfile=cta.txt:expansion=none:fontcolor=white:fontsize=36:line_spacing=18:x=48:y=965:enable='gte(t,${seconds - 4})'`,
    ",format=yuv420p[v];",
    `[1:a]atrim=duration=${seconds},asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st=${seconds - 1}:d=1,volume=${options.music ? 0.65 : 2}[a]`,
  ].join("");
  const result = spawnSync(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error", "-ss", String(((seed % 1000) / 1000) * Math.max(0, available - seconds)), "-i", source,
    "-stream_loop", "-1", "-i", music,
    "-filter_complex", filter, "-map", "[v]", "-map", "[a]", "-t", String(seconds),
    "-c:v", "libx264", "-preset", "fast", "-crf", "24", "-maxrate", "270k", "-bufsize", "540k",
    "-c:a", "aac", "-b:a", "64k", "-ac", "2", "-ar", "44100", "-movflags", "+faststart", output,
  ], { cwd: directory, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg exited with code ${result.status}.`);
  const metadata = {
    video: output, seconds, width: 720, height: 1280, topic: post.title,
    date: post.date, source: post.source,
    caption: post.source === "daily-evergreen-post" ? post.caption.split("\n\nPhoto:")[0] : post.caption,
    provenance: { seed, footageSource: options.video ? "operator-supplied" : "https://www.pexels.com/video/19150358/", license: options.video ? "operator-supplied" : "Pexels license; attribution not required", musicSource: options.music ? "operator-supplied" : "original synthesized instrumental" },
    music: options.music ? "user-supplied" : "original-synthesized",
    footage: source, bytes: fs.statSync(output).size,
  };
  fs.writeFileSync(path.join(directory, "reel.json"), JSON.stringify(metadata, null, 2));
  return metadata;
}

module.exports = { args, wrap, render };
if (require.main === module) {
  try {
    const options = args(process.argv.slice(2));
    if (options.help) console.log("Create a 10-60 second portrait Reel with music.\nUsage: npm run reels:create -- [--post daily-post.json | --topic TEXT] [--video clip.mp4] [--music track.mp3] [--seconds 12] [--date YYYY-MM-DD] [--brief]\nDefault topic follows the daily Make photo rotation. --post uses the exact supplied article/topic. No paid API is called.");
    else console.log(JSON.stringify(render(options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
