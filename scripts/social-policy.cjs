const WEBSITE_URL = "https://www.katpanadesert.com/";

function withWebsite(caption) {
  if (typeof caption !== "string" || !caption.trim()) throw new Error("A publishing caption is required.");
  return /https:\/\/www\.katpanadesert\.com(?:\/|\b)/i.test(caption)
    ? caption : `${caption.trim()}\n\nPlan your trip: ${WEBSITE_URL}`;
}

function singleReelOperations(modules, dailyModuleId = 5) {
  const daily = modules.find((module) => module.id === dailyModuleId);
  if (daily?.module !== "facebook-pages:uploadAReel") throw new Error("Inspect the daily Facebook Reel module before updating its schedule.");
  return modules.filter((module) => module.module === "facebook-pages:uploadAReel" && module.id !== dailyModuleId)
    .map((module) => ({ op: "module_disabled_set", moduleId: module.id, disabled: true }));
}

function instagramCaption(caption) {
  const result = withWebsite(caption);
  if (result.length > 2200) throw new Error("Instagram caption exceeds 2,200 characters. Shorten the copy while retaining all required photo credits.");
  return result;
}

function instagramSourceOperations(module, config) {
  if (module?.module !== "instagram-business:CreateAReelPost" || !config?.mapper || module.filter?.name !== "Only today's credited Reel with a downloadable video") throw new Error("Inspect the Instagram route before changing its video source.");
  const conditions = module.filter.conditions;
  if (!Array.isArray(conditions) || conditions.length !== 1 || !Array.isArray(conditions[0]) || !conditions[0].some((entry) => entry.a === "{{7.source}}" && entry.o === "exist")) throw new Error("The Instagram source filter changed; inspect it before updating.");
  const filtered = conditions[0].map((entry) => entry.a === "{{7.source}}" && entry.o === "exist" ? { ...entry, a: "{{1.instagram_video_url}}" } : entry);
  filtered.push({ a: "{{1.instagram_video_url}}", o: "text:notequal", b: "" });
  return [
    { op: "module_config_set", moduleId: module.id, config: { mapper: { ...config.mapper, video_url: "{{1.instagram_video_url}}" } } },
    { op: "filter_set", moduleId: module.id, filter: { ...module.filter, conditions: [filtered] } },
  ];
}

module.exports = { WEBSITE_URL, withWebsite, singleReelOperations, instagramCaption, instagramSourceOperations };
