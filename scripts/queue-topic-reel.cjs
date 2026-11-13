const fs = require("node:fs");
const path = require("node:path");
const { callMake } = require("./make-mcp.cjs");
const { checkedDate } = require("./reel-topic.cjs");

function validate(metadata, now = new Date()) {
  checkedDate(metadata.date);
  const scheduledAt = new Date(`${metadata.date}T09:00:00+05:00`);
  if (scheduledAt <= now) throw new Error("The 9:00 AM Pakistan slot has passed. Create a Reel with --date set to a future publishing date.");
  if (!Number.isFinite(metadata.seconds) || metadata.seconds < 10 || metadata.seconds > 60) throw new Error("The Reel must be 10-60 seconds long.");
  if (!metadata.video || !metadata.caption || !metadata.topic) throw new Error("Reel metadata needs video, caption and topic.");
  return scheduledAt.toISOString();
}

async function queue(filename, dryRun = false, makeCall = callMake) {
  const metadata = JSON.parse(fs.readFileSync(filename, "utf8"));
  const scheduledAt = validate(metadata);
  const videoPath = path.resolve(metadata.video);
  const bytes = fs.readFileSync(videoPath);
  // Make's MCP request limit is about 1 MB. Fail before modifying the scenario.
  if (bytes.length > 650000) throw new Error("Reel is too large for embedded Make delivery. Render it with reels:create to compress it, or use URL-based video hosting.");
  const scenarioId = 8551535;
  if (dryRun) return { dryRun: true, scenarioId, topic: metadata.topic, scheduledAt, bytes: bytes.length };
  const snapshot = await makeCall("scenario_get", { scenarioId });
  if (snapshot.isError || !snapshot.structuredContent?.scenario) throw new Error("Could not inspect the existing scheduler.");
  const scenario = snapshot.structuredContent;
  if (scenario.scenario.status !== "active") throw new Error("The daily scheduler must be active before queuing a Reel.");
  const reelModule = await makeCall("scenario_module_get", { scenarioId, moduleIds: [4] });
  const current = reelModule.structuredContent?.modules?.[0];
  if (!current?.config) throw new Error("Could not inspect the Reel module.");
  fs.mkdirSync(".supabase", { recursive: true });
  // Keep the last configuration for deliberate restoration; it contains no API key.
  const backup = `.supabase/reel-module-before-${Date.now()}.json`;
  fs.writeFileSync(backup, JSON.stringify({ module: current, filter: scenario.modules.find((m) => m.id === 4)?.filter }, null, 2));
  const config = {
    ...current.config,
    mapper: {
      ...current.config.mapper,
      uploadMethod: "data", fileName: path.basename(videoPath),
      data: `{{toBinary("${bytes.toString("base64")}"; "base64")}}`,
      title: metadata.topic, description: metadata.caption,
    },
  };
  const existingQueued = scenario.modules.find((module) => module.label === "Queued topic Reel");
  const dateFilter = {
    name: `Reel for ${metadata.date} in Pakistan`, conditions: [[
      { a: "{{1.publish_enabled}}", o: "boolean:equal", b: true },
      { a: '{{formatDate(now; "YYYY-MM-DD"; "Asia/Karachi")}}', o: "text:equal", b: metadata.date },
    ]],
  };
  const sundayFilter = scenario.modules.find((module) => module.id === 4)?.filter;
  if (!sundayFilter?.conditions?.length) throw new Error("Inspect the weekly Reel filter before queuing a new video.");
  const skipQueuedDate = {
    name: "Sunday Reel except the queued topic date",
    conditions: sundayFilter.conditions.map((group) => [
      ...group.filter((condition) => !(condition.a === '{{formatDate(now; "YYYY-MM-DD"; "Asia/Karachi")}}' && condition.o === "text:notequal")),
      { a: '{{formatDate(now; "YYYY-MM-DD"; "Asia/Karachi")}}', o: "text:notequal", b: metadata.date },
    ]),
  };
  const operations = existingQueued ? [
    { op: "module_config_set", moduleId: existingQueued.id, config },
    { op: "filter_set", moduleId: existingQueued.id, filter: dateFilter },
  ] : [{
    op: "module_add", module: current.module, version: current.version,
    parent: { moduleId: 2, kind: "route", index: 2 },
    label: "Queued topic Reel", config, filter: dateFilter,
  }];
  const result = await makeCall("scenario_patch", {
    scenarioId, expectedLastEdit: scenario.scenario.lastEdit,
    operations: [...operations, { op: "filter_set", moduleId: 4, filter: skipQueuedDate }],
  });
  if (result.isError || result.structuredContent?.errors?.length) throw new Error(JSON.stringify(result));
  return {
    scenarioId, scheduledAt, topic: metadata.topic, backup,
    note: "Queued one Reel for the selected date. The daily photo and weekly Reel schedules remain active; on a queued Sunday, only the queued Reel runs. This holds one pending topic Reel: queuing another replaces that pending video. Nothing was published immediately.",
  };
}

module.exports = { validate, queue };
if (require.main === module) {
  const filename = process.argv[2];
  if (!filename) { console.error("Usage: npm run reels:queue -- path/to/reel.json [--dry-run]"); process.exitCode = 1; }
  else queue(filename, process.argv.includes("--dry-run"))
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
