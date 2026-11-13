const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { dailyPost, checkedDate, pakistanDate, resolvePost, briefFor } = require("./reel-topic.cjs");
const { createMusic } = require("./reel-music.cjs");
const { args, render } = require("./create-topic-reel.cjs");
const { validate, queue } = require("./queue-topic-reel.cjs");

test("daily topic follows Make's day-of-year rotation, including leap years", () => {
  assert.equal(dailyPost("2026-11-13").image, "k2-base-camp.jpg");
  assert.equal(dailyPost("2026-11-14").image, "hunza-valley.jpg");
  assert.equal(dailyPost("2024-03-01").image, "k2-base-camp.jpg");
});

test("Pakistan date advances five hours ahead of UTC", () => {
  assert.equal(pakistanDate(new Date("2026-11-13T20:00:00Z")), "2026-11-14");
});

test("invalid dates and sub-ten-second renders fail before creating artifacts", () => {
  assert.throws(() => checkedDate("2026-02-30"), /valid/);
  assert.throws(() => render({ seconds: 9 }), /10 and 60/);
  assert.throws(() => args(["--video"]), /Missing value/);
});

test("exact supplied article topic and caption are preserved", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-reels-"));
  try {
    const filename = path.join(dir, "post.json");
    fs.writeFileSync(filename, JSON.stringify({ article: { title: "Deosai planning", excerpt: "Check access before travel." }, post_caption: "Daily post caption" }));
    const post = resolvePost({ post: filename, date: "2026-11-14" });
    assert.equal(post.title, "Deosai planning");
    assert.equal(post.caption, "Daily post caption");
    assert.equal(post.source, "supplied-post");
    assert.match(briefFor(post).generationPrompt, /Deosai planning/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("original music is a non-silent PCM WAV of the requested duration", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-music-"));
  try {
    const filename = path.join(dir, "music.wav");
    createMusic(filename, 12);
    const wav = fs.readFileSync(filename);
    assert.equal(wav.toString("ascii", 0, 4), "RIFF");
    assert.equal(wav.readUInt32LE(40), 44100 * 12 * 2);
    assert.ok(wav.subarray(44).some((value) => value !== 0));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("daily seeds produce different instrumental arrangements", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-music-variety-"));
  try {
    const first = path.join(dir, "first.wav");
    const second = path.join(dir, "second.wav");
    createMusic(first, 1, 100);
    createMusic(second, 1, 101);
    assert.notDeepEqual(fs.readFileSync(first), fs.readFileSync(second));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("queue rejects past slots and converts Pakistan time correctly", () => {
  const reel = { date: "2026-11-14", seconds: 12, video: "reel.mp4", caption: "caption", topic: "topic" };
  assert.equal(validate(reel, new Date("2026-11-13T08:00:00Z")), "2026-11-14T04:00:00.000Z");
  assert.throws(() => validate(reel, new Date("2026-11-14T04:00:00Z")), /passed/);
});

test("queuing a dated Reel preserves daily photos and avoids duplicate Sunday Reels", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "katpana-queue-"));
  const calls = [];
  try {
    const video = path.join(dir, "clip.mp4");
    fs.writeFileSync(video, "test-video");
    const filename = path.join(dir, "reel.json");
    fs.writeFileSync(filename, JSON.stringify({ date: "2099-11-14", seconds: 12, video, caption: "Caption", topic: "Topic" }));
    const make = async (name, args) => {
      calls.push({ name, args });
      if (name === "scenario_get") return { structuredContent: {
        scenario: { status: "active", lastEdit: "edit-1" },
        modules: [{ id: 4, filter: { conditions: [[{ a: "sunday", o: "text:equal", b: "0" }]] } }],
      } };
      if (name === "scenario_module_get") return { structuredContent: { modules: [{ module: "facebook-pages:uploadAReel", version: 6, config: { parameters: { __IMTCONN__: 123 }, mapper: { page_id: "page" } } }] } };
      if (name === "scenario_patch") return { structuredContent: { errors: [] } };
      throw new Error("Unexpected mutation");
    };
    const result = await queue(filename, false, make);
    assert.equal(result.scheduledAt, "2099-11-14T04:00:00.000Z");
    const patch = calls.find((c) => c.name === "scenario_patch").args;
    assert.equal(patch.expectedLastEdit, "edit-1");
    assert.ok(!patch.operations.some((op) => op.moduleId === 3));
    assert.equal(patch.operations[0].op, "module_add");
    assert.equal(patch.operations[0].parent.index, 2);
    assert.equal(patch.operations[0].filter.conditions[0][1].b, "2099-11-14");
    assert.equal(patch.operations[1].filter.conditions[0][1].o, "text:notequal");
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
