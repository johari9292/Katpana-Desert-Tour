// Explicitly publishes one real Reel, then restores the existing schedule.
const fs = require("node:fs");
const path = require("node:path");
const { callMake } = require("./make-mcp.cjs");

function check(result) {
  if (result.isError || result.structuredContent?.errors?.length) {
    throw new Error(JSON.stringify(result));
  }
  return result.structuredContent;
}

async function publishNow(filename) {
  const metadata = JSON.parse(fs.readFileSync(filename, "utf8"));
  if (!metadata.topic || !metadata.caption || !Number.isFinite(metadata.seconds) || metadata.seconds < 10 || metadata.seconds > 60) {
    throw new Error("Use a reel.json created by reels:create with a 10-60 second video.");
  }
  const video = fs.readFileSync(metadata.video);
  if (video.length > 650000) throw new Error("Video exceeds Make's embedded-delivery size limit.");
  const scenarioId = 8551535;
  const before = check(await callMake("scenario_get", { scenarioId }));
  if (before.scenario.status !== "active") throw new Error("The existing scheduler is not active.");
  const target = before.modules.find((module) => module.label === "Queued topic Reel" || module.label === "Fresh daily Reel");
  if (!target) throw new Error("Queue a topic Reel first so the test route exists.");
  const module = check(await callMake("scenario_module_get", { scenarioId, moduleIds: [target.id] })).modules[0];
  const routes = before.modules.filter((entry) => entry.parent?.kind === "route" && entry.parent.moduleId === 2);
  fs.mkdirSync(".supabase", { recursive: true });
  const backup = `.supabase/live-reel-test-backup-${Date.now()}.json`;
  fs.writeFileSync(backup, JSON.stringify({ module, routes }, null, 2));
  let changed = false;
  let execution;
  try {
    // Restore even if Make accepted the edit but its HTTP response was lost.
    changed = true;
    check(await callMake("scenario_patch", {
      scenarioId, expectedLastEdit: before.scenario.lastEdit,
      operations: [
        { op: "module_config_set", moduleId: target.id, config: {
          ...module.config, mapper: {
            ...module.config.mapper,
            data: `{{toBinary("${video.toString("base64")}"; "base64")}}`,
            fileName: path.basename(metadata.video), title: metadata.topic, description: metadata.caption,
          },
        } },
        ...routes.map((entry) => ({
          op: "filter_set", moduleId: entry.id,
          filter: { name: "Single live Reel test", conditions: [[{ a: "test", o: "text:equal", b: entry.id === target.id ? "test" : "skip" }]] },
        })),
      ],
    }));
    execution = check(await callMake("scenario_run", { scenarioId }));
    fs.writeFileSync(".supabase/latest-live-reel-test.json", JSON.stringify({ ...execution, topic: metadata.topic, backup }, null, 2));
  } finally {
    if (changed) {
      let restored = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const current = check(await callMake("scenario_get", { scenarioId }));
          check(await callMake("scenario_patch", {
            scenarioId, expectedLastEdit: current.scenario.lastEdit,
            operations: [
              { op: "module_config_set", moduleId: target.id, config: module.config },
              ...routes.map((entry) => ({ op: "filter_set", moduleId: entry.id, filter: entry.filter || {} })),
            ],
          }));
          restored = true;
          break;
        } catch (error) {
          if (attempt === 4) throw new Error(`Restore the schedule from ${backup}: ${error.message}`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
      if (!restored) throw new Error(`Schedule restoration needs inspection: ${backup}`);
    }
  }
  const records = check(await callMake("scenario_execution_module_get", {
    scenarioId, executionId: execution.executionId, moduleId: target.id, cycle: 1,
  }));
  const output = records.records?.find((record) => record.direction === "output" && !record.error);
  const data = output?.data?.[0] ? JSON.parse(output.data[0]) : null;
  const result = { ...execution, videoId: data?.video_id || null, topic: metadata.topic, scheduleRestored: true };
  fs.writeFileSync(".supabase/latest-live-reel-test.json", JSON.stringify(result, null, 2));
  return result;
}

if (require.main === module) {
  if (!process.argv[2]) { console.error("Usage: npm run reels:publish-test -- path/to/reel.json (publishes immediately)"); process.exitCode = 1; }
  else publishNow(process.argv[2])
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
