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

module.exports = { WEBSITE_URL, withWebsite, singleReelOperations, instagramCaption };
