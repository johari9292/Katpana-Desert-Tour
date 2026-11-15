const { createHash } = require("node:crypto");
const { destinationFor } = require("./social-photos.cjs");

// All angles offer planning or photography ideas, never unverified news claims.
const angles = [
  { name: "transport", match: /\b(road|highway|flight|airport|aircraft|connectivity|transport|closure|landslide|route)\w*\b/i,
    tags: ["TravelPlanning", "MountainTravel"], ideas: ["plan a flexible arrival day", "leave time between travel connections", "build a backup travel plan", "questions to ask before departure", "plan the journey before the views", "choose your itinerary at your own pace"],
    tip: "Confirm transport and route details with your provider close to departure." },
  { name: "winter", match: /\b(winter|snow|cold|frozen|ice)\w*\b/i,
    tags: ["WinterTravel", "MountainTravel"], ideas: ["plan a flexible winter itinerary", "build your winter packing list", "leave room for a slower winter day", "plan your seasonal photo stops", "questions for a winter journey", "save a winter travel idea"],
    tip: "Check local forecasts and confirm seasonal access before choosing your stops." },
  { name: "heritage", match: /\b(fort|palace|heritage|museum|cultur\w*|architecture|historic\w*)\b/i,
    tags: ["HeritageTravel", "CulturalTravel"], ideas: ["make time for local stories", "look closer at architectural details", "plan a thoughtful heritage stop", "build a three-frame photo diary", "explore the stories behind the view", "save time for a local guide"],
    tip: "Ask a local guide about the history and check photography permissions during your visit." },
  { name: "lakes", match: /\b(lake\w*|kachura|satpara|shangrila)\b/i,
    tags: ["LakePhotography", "SlowTravel"], ideas: ["leave time for a lakeside pause", "look beyond the wide lake view", "plan a quieter photo stop", "build a lakeside photo diary", "frame the smaller landscape details", "save an unhurried lake day"],
    tip: "Choose a permitted viewpoint and leave the shoreline as you found it." },
  { name: "trekking", match: /\b(trek\w*|hik\w*|trail\w*|base camp|camping|askole|k2)\b/i,
    tags: ["TrekkingPakistan", "MountainTravel"], ideas: ["choose a walk that suits you", "plan the journey beyond the viewpoint", "questions to ask your trekking guide", "make a thoughtful trail checklist", "leave time for the journey on foot", "plan your mountain packing list"],
    tip: "Ask a qualified local guide about route suitability, equipment and access before setting out." },
  { name: "desert", match: /\b(desert|dune\w*|katpana)\b/i,
    tags: ["ColdDesert", "DesertPhotography"], ideas: ["look closer at desert patterns", "plan a thoughtful desert photo stop", "frame a different landscape", "build a desert photo diary", "notice the textures in the view", "leave time for a landscape pause"],
    tip: "Look for landscape patterns from a permitted photo spot and leave the place as you found it." },
  { name: "discovery", match: /./,
    tags: ["PakistanTravel", "TravelPhotography"], ideas: ["give one place a little more time", "build an itinerary around your interests", "look beyond the main viewpoint", "save a slower travel day", "build a three-frame travel diary", "make room for the smaller details"],
    tip: "Confirm access locally and give yourself time to explore beyond the first photograph." },
];

function subjectFor(candidate) {
  const destination = destinationFor(candidate.title);
  const angle = angles.find((entry) => entry.match.test(`${candidate.title} ${candidate.context || ""}`));
  return { destination, angle };
}

function hashtagsFor(destination, angle) {
  const region = ["Hunza", "Gilgit", "Astore", "Rama", "Deosai", "Karakoram", "K2"].includes(destination) ? "GilgitBaltistan" : "NorthernPakistan";
  return [...new Set(["KatpanaDesert", destination.replace(/[^a-z0-9]/gi, ""), region, ...angle.tags])].map((tag) => `#${tag}`);
}

function captionFor(topic, seed = 0, details = {}) {
  const { destination, angle } = details.destination ? details : subjectFor({ title: topic });
  const hooks = ["Save this travel idea", "Start your next travel plan here", "Give this idea a place in your itinerary", "A travel thought to keep for later"];
  const questions = ["Who would you explore with?", "What would you add to your itinerary?", "Which detail would you photograph first?", "Would you save a day for this?"];
  const hashtags = hashtagsFor(destination, angle);
  return `${hooks[seed % hooks.length]}: ${topic}.\n\n${angle.tip}\n${questions[Math.floor(seed / hooks.length) % questions.length]} Message Katpana Desert to plan your trip.\n\n${hashtags.join(" ")}`;
}

function validateCopy(copy, history = []) {
  if (typeof copy.topic !== "string" || copy.topic.length < 8 || copy.topic.length > 100) throw new Error("Generated copy has invalid lengths.");
  for (const text of [copy.caption, copy.reelCaption].filter((entry) => entry !== undefined)) {
    if (typeof text !== "string" || text.length < 40 || text.length > 650) throw new Error("Generated copy has invalid lengths.");
    if (/\b(road is open|road is closed|guaranteed safe|confirmed open|today's weather|live footage|going viral|trending now)\b|#(viral|fyp)\b/i.test(text)) throw new Error("Caption asserts unsupported live conditions or popularity.");
  }
  const normalize = (text) => text?.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  if (history.some((entry) => normalize(entry.topic) === normalize(copy.topic) ||
    [entry.caption, entry.reelCaption].filter(Boolean).some((text) => normalize(text) === normalize(copy.caption) || normalize(text) === normalize(copy.reelCaption)))) throw new Error("Topic or caption repeats a previous day.");
  if (copy.sceneTexts && (copy.sceneTexts.length !== 3 || copy.sceneTexts.some((text) => typeof text !== "string" || !text.trim() || text.length > 80))) throw new Error("Use three short scene texts.");
  return copy;
}

function generateCopy(candidate, history, date) {
  const { destination, angle } = subjectFor(candidate);
  const seed = createHash("sha256").update(`${date}:${candidate.url}`).digest().readUInt32LE(0);
  // Six ideas x four formats provide distinct editorial topics for each subject.
  const formats = ["{place}: {idea}", "{place} travel notes: {idea}", "Your {place} checklist: {idea}", "A closer look at {place}: {idea}"];
  const options = formats.flatMap((format) => angle.ideas.map((idea) => ({ topic: format.replace("{place}", destination).replace("{idea}", idea), idea })));
  for (let offset = 0; offset < options.length; offset++) {
    const { topic, idea } = options[(seed + offset) % options.length];
    if (history.some((entry) => entry.topic?.toLowerCase() === topic.toLowerCase())) continue;
    const hashtags = hashtagsFor(destination, angle);
    const caption = captionFor(topic, seed + offset, { destination, angle });
    const reelCaption = `Your next travel story starts here: ${topic}.\n\n${angle.tip}\nSave this reel and message Katpana Desert to plan a journey around your interests.\n\n${hashtags.join(" ")}`;
    return validateCopy({ topic, caption, reelCaption, hashtags, destination, angle: angle.name,
      sceneTexts: [`${destination}: ${idea}`, angle.name === "heritage" ? "Look closer. Ask about the local story." : "Plan your stops. Confirm details locally.", "Save this idea\nkatpanadesert.com"] }, history);
  }
  throw new Error("No unused angle remains for this source topic.");
}

module.exports = { subjectFor, hashtagsFor, captionFor, validateCopy, generateCopy };
