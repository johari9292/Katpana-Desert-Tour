const fs = require("node:fs");
const { callMake } = require("./make-mcp.cjs");
const catalog = require("../data/facebook-evergreen.json");

const STATE = ".supabase/facebook-scheduler-state.json";
const pageId = "668690229664491";
const connectionId = 7833051;

function rotation(values) {
  // Make quoted strings preserve backslash-n; use literal line breaks instead.
  const quote = (value) => JSON.stringify(value).replaceAll("\\n", "\n");
  const cases = values.flatMap((value, index) => [String(index), quote(value)]);
  return `{{switch(parseNumber(formatDate(now; "DDD"; "Asia/Karachi")) % ${values.length}; ${cases.join("; ")}; ${quote(values[0])})}}`;
}

function variables(publishEnabled) {
  return {
    parameters: {},
    mapper: { variables: [
      { name: "image_url", value: rotation(catalog.map((post) => `https://www.katpanadesert.com/images/places/${post.image}`)) },
      { name: "caption", value: rotation(catalog.map((post) => post.caption)) },
      { name: "publish_enabled", value: publishEnabled },
    ] },
  };
}

async function main() {
  if (fs.existsSync(STATE)) {
    const state = JSON.parse(fs.readFileSync(STATE, "utf8"));
    console.log(JSON.stringify({ existingScenarioId: state.scenarioId, message: "Already created; inspect before changing." }));
    return;
  }
  const video = fs.readFileSync(".supabase/katpana-desert-reel.mp4").toString("base64");
  const result = await callMake("scenario_create", {
    teamId: 1704156,
    name: "Katpana Desert - daily photo and Sunday Reel",
    autoActivate: false,
    scheduling: { type: "daily", time: "09:00" },
    modules: [
      { id: 1, module: "util:SetVariables", version: 1, root: "main", label: "Rotate eight destination photos", config: variables(false) },
      { id: 2, module: "builtin:BasicRouter", version: 1, follows: 1, config: {} },
      {
        id: 3, module: "facebook-pages:CreatePostWithPhotos", version: 6,
        parent: { moduleId: 2, kind: "route", index: 0, label: "Daily photo" },
        filter: { name: "Publishing enabled", conditions: [[{ a: "{{1.publish_enabled}}", o: "boolean:equal", b: true }]] },
        config: {
          parameters: { __IMTCONN__: connectionId },
          mapper: { page_id: pageId, message: "{{1.caption}}", photos: [{ type: "url", url: "{{1.image_url}}" }] },
        },
      },
      {
        id: 4, module: "facebook-pages:uploadAReel", version: 6,
        parent: { moduleId: 2, kind: "route", index: 1, label: "Sunday Reel" },
        filter: { name: "Publishing enabled and Sunday in Pakistan", conditions: [[
          { a: "{{1.publish_enabled}}", o: "boolean:equal", b: true },
          { a: '{{formatDate(now; "d"; "Asia/Karachi")}}', o: "text:equal", b: "0" },
        ]] },
        config: {
          parameters: { __IMTCONN__: connectionId },
          mapper: {
            page_id: pageId, uploadMethod: "data", fileName: "katpana-desert.mp4",
            data: `{{toBinary("${video}"; "base64")}}`, title: "Discover Katpana Desert, Skardu",
            description: "Discover Katpana Desert in Skardu. Message us to start planning your northern Pakistan trip.\nhttps://www.katpanadesert.com/\n#KatpanaDesert #Skardu #PakistanTravel\n\nAnimated photo: Abdullah Shakoor, Skardu Katpana Desert (CC0). Cropped with motion and text added. https://commons.wikimedia.org/wiki/File:Skardu_Katpana_Desert.jpg",
          },
        },
      },
    ],
  });
  fs.writeFileSync(".supabase/facebook-scheduler-create-result.json", JSON.stringify(result, null, 2));
  if (result.isError) throw new Error(JSON.stringify(result));
  const data = result.structuredContent;
  const scenarioId = data?.scenario?.id || data?.scenarioId || data?.id;
  if (scenarioId) fs.writeFileSync(STATE, JSON.stringify({ scenarioId, publishingEnabled: false, timezoneVerified: false }, null, 2));
  console.log(JSON.stringify(result));
}

module.exports = { variables };
if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
