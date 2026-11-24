const fs = require("node:fs");
const { callMake } = require("./make-mcp.cjs");
const { WEBSITE_URL, withWebsite, singleReelOperations, instagramSourceOperations } = require("./social-policy.cjs");

const SCENARIO = 8551535;
const TEAM = 1704156;
const ORGANIZATION = 7662741;
const FACEBOOK_CONNECTION = 7833051;
const PAGE = "668690229664491";
const REQUEST = ".supabase/instagram-connection-request.json";
const COMMENT_LABEL = "Website link for the daily Reel";

function checked(result) {
  if (result.isError || !result.structuredContent || result.structuredContent.errors?.length) throw new Error(JSON.stringify(result));
  return result.structuredContent;
}
async function invoke(name, args) { return checked(await callMake(name, args)); }
async function resolvePage(module, connection = FACEBOOK_CONNECTION) {
  const result = await invoke("module_field_resolve", { organizationId: ORGANIZATION, teamId: TEAM, module, version: 6,
    path: "/mapper/page_id", config: { parameters: { __IMTCONN__: connection } } });
  if (!result.options?.some((option) => option.value === PAGE)) throw new Error("The Katpana Desert Facebook Page is unavailable on this connection.");
}
async function patch(snapshot, operations) {
  return invoke("scenario_patch", { scenarioId: SCENARIO, expectedLastEdit: snapshot.scenario.lastEdit, operations });
}

async function configureFacebook() {
  const snapshot = await invoke("scenario_get", { scenarioId: SCENARIO });
  if (snapshot.modules.some((module) => module.filter?.name === "Single live Reel test")) throw new Error("Wait for the live publishing test to finish before editing the scheduler.");
  const existingComment = snapshot.modules.find((module) => module.label === COMMENT_LABEL);
  const ids = [1, 5, ...(existingComment ? [existingComment.id] : [])];
  const saved = await invoke("scenario_module_get", { scenarioId: SCENARIO, moduleIds: ids });
  const variables = saved.modules.find((module) => module.id === 1);
  const reel = saved.modules.find((module) => module.id === 5);
  if (!variables?.config?.mapper || !reel?.config?.mapper) throw new Error("Could not read the daily publishing configuration.");
  await invoke("module_spec", { organizationId: ORGANIZATION, teamId: TEAM,
    modules: ["facebook-pages:CreateComment"], schemas: true });
  await resolvePage("facebook-pages:CreateComment");
  await invoke("module_field_resolve", { organizationId: ORGANIZATION, teamId: TEAM, module: "facebook-pages:CreateComment", version: 6,
    path: "/mapper/id", config: { parameters: { __IMTCONN__: FACEBOOK_CONNECTION }, mapper: { page_id: PAGE, id: "{{5.video_id}}" } } });

  const description = withWebsite(reel.config.mapper.description);
  const current = variables.config.mapper.variables || [];
  const mapped = current.map((entry) => ["caption", "post_caption", "reel_caption"].includes(entry.name)
    ? { ...entry, value: withWebsite(entry.value) } : entry).filter((entry) => !["website_url", "reel_publish_caption"].includes(entry.name));
  mapped.push({ name: "website_url", value: WEBSITE_URL }, { name: "reel_publish_caption", value: description });
  const commentConfig = { parameters: { __IMTCONN__: FACEBOOK_CONNECTION }, mapper: {
    page_id: PAGE, id: "{{5.video_id}}", message: `Plan your Katpana Desert and northern Pakistan trip: ${WEBSITE_URL}`, attachment: ""
  } };
  const operations = [
    { op: "name_set", name: "Katpana Desert - one daily Reel and photo" },
    { op: "scheduling_set", scheduling: { type: "daily", time: "09:00" } },
    { op: "settings_set", settings: { sequential: true } },
    ...singleReelOperations(snapshot.modules),
    { op: "module_config_set", moduleId: 1, config: { mapper: { ...variables.config.mapper, variables: mapped } } },
    { op: "module_config_set", moduleId: 5, config: { mapper: { ...reel.config.mapper, description } } },
    existingComment
      ? { op: "module_config_set", moduleId: existingComment.id, config: commentConfig }
      : { op: "module_add", module: "facebook-pages:CreateComment", version: 6, follows: 5, label: COMMENT_LABEL,
        config: commentConfig, filter: { name: "Link only the newly published Reel", conditions: [[{ a: "{{5.video_id}}", o: "exist" }]] } }
  ];
  fs.mkdirSync(".supabase", { recursive: true });
  fs.writeFileSync(`.supabase/social-schedule-before-${Date.now()}.json`, JSON.stringify({ snapshot, modules: saved.modules }, null, 2));
  await patch(snapshot, operations);
  const verified = await invoke("scenario_get", { scenarioId: SCENARIO });
  const activeReels = verified.modules.filter((module) => module.module === "facebook-pages:uploadAReel" && !module.disabled && !module.parent?.disabled);
  if (activeReels.length !== 1 || activeReels[0].id !== 5) throw new Error("The saved schedule does not have exactly one active Facebook Reel route.");
  return { scenarioId: SCENARIO, activeDailyReelRoutes: activeReels.length,
    website: WEBSITE_URL, websiteCommentModuleId: verified.modules.find((module) => module.label === COMMENT_LABEL)?.id,
    nextScheduledExecution: verified.scenario.nextScheduledExecution };
}

async function connectInstagram() {
  if (!fs.existsSync(REQUEST)) throw new Error("Create the Instagram authorization request in Make first.");
  const request = JSON.parse(fs.readFileSync(REQUEST, "utf8")).structuredContent;
  const status = await invoke("connection_get", { requestId: request.requestId });
  if (status.status !== "authorized") return { connected: false, status: status.status, authorizationUrl: request.url };
  const spec = await invoke("module_spec", { organizationId: ORGANIZATION, teamId: TEAM,
    modules: ["instagram-business:CreateAReelPost", "facebook-pages:GetVideo"], schemas: true });
  const instagram = spec.modules.find((module) => module.module === "instagram-business:CreateAReelPost");
  let selected;
  const granted = status.credentials.find((credential) => credential.app === "instagram-business" && credential.state === "authorized")?.connectionId;
  const connections = instagram.connection.existing.filter((connection) => !granted || connection.id === granted);
  for (const connection of connections) {
    const resolved = await invoke("module_field_resolve", { organizationId: ORGANIZATION, teamId: TEAM,
      module: instagram.module, version: instagram.version, path: "/mapper/accountId", config: { parameters: { __IMTCONN__: connection.id } } });
    const matches = (resolved.options || []).filter((option) => /katpana/i.test(option.label || ""));
    if (matches.length === 1) { selected = { connection: connection.id, account: matches[0] }; break; }
  }
  if (!selected) throw new Error("Authorize the Katpana Instagram Business account linked to its Facebook Page, then retry.");
  await resolvePage("facebook-pages:GetVideo");
  let snapshot = await invoke("scenario_get", { scenarioId: SCENARIO });
  if (snapshot.modules.some((module) => module.module === "instagram-business:CreateAReelPost" && !module.disabled)) {
    return { connected: true, alreadyConfigured: true, account: selected.account.label };
  }
  let video = snapshot.modules.find((module) => module.label === "Read the daily Reel video for Instagram");
  if (!video) {
    const comment = snapshot.modules.find((module) => module.label === COMMENT_LABEL);
    await patch(snapshot, [{ op: "module_add", module: "facebook-pages:GetVideo", version: 6, follows: comment?.id || 5,
      label: "Read the daily Reel video for Instagram", config: { parameters: { __IMTCONN__: FACEBOOK_CONNECTION }, mapper: { page_id: PAGE, video_id: "{{5.video_id}}" } } }]);
    snapshot = await invoke("scenario_get", { scenarioId: SCENARIO });
    video = snapshot.modules.find((module) => module.label === "Read the daily Reel video for Instagram");
  }
  if (!video) throw new Error("The video lookup module was not saved.");
  await patch(snapshot, [{ op: "module_add", module: instagram.module, version: instagram.version, follows: video.id,
    label: "Share the same daily Reel to Instagram", config: { parameters: { __IMTCONN__: selected.connection }, mapper: {
      accountId: selected.account.value, video_url: "{{1.instagram_video_url}}", caption: `{{ifempty(1.reel_publish_caption; ${video.id}.description)}}\n\n{{if(contains(ifempty(1.reel_publish_caption; ${video.id}.description); "https://www.katpanadesert.com/"); emptystring; "Plan your trip: https://www.katpanadesert.com/")}}`, share_to_feed: true
    } }, filter: { name: "Only today's credited Reel with a downloadable video", conditions: [[
      { a: "{{1.instagram_video_url}}", o: "exist" }, { a: "{{1.instagram_video_url}}", o: "text:notequal", b: "" }, { a: `{{${video.id}.description}}`, o: "exist" },
      { a: `{{length(ifempty(1.reel_publish_caption; ${video.id}.description))}}`, o: "number:less", b: 2100 },
      { a: "{{1.content_date}}", o: "text:equal", b: '{{formatDate(now; "YYYY-MM-DD"; "Asia/Karachi")}}' }
    ]] } }]);
  const verified = await invoke("scenario_get", { scenarioId: SCENARIO });
  const active = verified.modules.filter((module) => module.module === instagram.module && !module.disabled);
  if (active.length !== 1) throw new Error("Inspect the Instagram route count before publishing.");
  return { connected: true, account: selected.account.label, activeDailyInstagramReelRoutes: active.length };
}

async function configureInstagramSource() {
  const snapshot = await invoke("scenario_get", { scenarioId: SCENARIO });
  if (snapshot.modules.some((module) => module.filter?.name === "Single live Reel test")) throw new Error("Wait for the live publishing test to finish before editing the scheduler.");
  const active = snapshot.modules.filter((module) => module.module === "instagram-business:CreateAReelPost" && !module.disabled);
  if (active.length !== 1) throw new Error("Inspect the Instagram route count before updating the video source.");
  const instagram = active[0];
  const saved = await invoke("scenario_module_get", { scenarioId: SCENARIO, moduleIds: [instagram.id] });
  const config = saved.modules[0]?.config;
  if (config?.mapper?.video_url === "{{1.instagram_video_url}}") return { scenarioId: SCENARIO, instagramModuleId: instagram.id, alreadyConfigured: true };
  const operations = instagramSourceOperations(instagram, config);
  fs.mkdirSync(".supabase", { recursive: true });
  fs.writeFileSync(`.supabase/instagram-source-before-${Date.now()}.json`, JSON.stringify({ snapshot, module: saved.modules[0] }, null, 2));
  await patch(snapshot, operations);
  const verified = await invoke("scenario_get", { scenarioId: SCENARIO });
  const finalConfig = await invoke("scenario_module_get", { scenarioId: SCENARIO, moduleIds: [instagram.id] });
  if (finalConfig.modules[0]?.config?.mapper?.video_url !== "{{1.instagram_video_url}}" || !verified.modules.find((m) => m.id === instagram.id)?.filter?.conditions?.[0]?.some((c) => c.a === "{{1.instagram_video_url}}" && c.o === "text:notequal")) throw new Error("Inspect the saved Instagram source and filter.");
  return { scenarioId: SCENARIO, instagramModuleId: instagram.id, source: "original hosted MP4", nextScheduledExecution: verified.scenario.nextScheduledExecution };
}

module.exports = { configureFacebook, connectInstagram, configureInstagramSource };
if (require.main === module) (async () => {
  const result = process.argv.includes("--instagram-source") ? await configureInstagramSource() : process.argv.includes("--instagram") ? await connectInstagram() : await configureFacebook();
  console.log(JSON.stringify(result, null, 2));
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
