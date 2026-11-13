const { createInterface } = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const { render } = require("./create-topic-reel.cjs");
const { queue } = require("./queue-topic-reel.cjs");
const { pakistanDate } = require("./reel-topic.cjs");

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const ask = async (label, fallback = "") => {
    const answer = (await rl.question(`${label}${fallback ? ` [${fallback}]` : ""}: `)).trim();
    return answer.replace(/^"(.*)"$/, "$1") || fallback;
  };
  try {
    console.log("\nKatpana Desert Reel Studio\n");
    console.log("1. Create a 12-second Reel with music\n2. Create a prompt for an AI video app\n3. Queue a prepared Reel in Make\n");
    const choice = await ask("Choose", "1");
    if (choice === "3") {
      console.log("Queues one video for the date in its reel.json file. A new queue replaces the pending topic Reel.");
      console.log(JSON.stringify(await queue(await ask("Path to reel.json")), null, 2));
      return;
    }
    if (!["1", "2"].includes(choice)) throw new Error("Choose 1, 2 or 3.");
    const tomorrow = pakistanDate(new Date(Date.now() + 86400000));
    const date = await ask("Publishing date in Pakistan (YYYY-MM-DD)", tomorrow);
    const post = await ask("Daily/trending post JSON file, or leave empty for the current photo rotation");
    const options = { date, ...(post ? { post } : {}), brief: choice === "2" };
    if (choice === "1") {
      const video = await ask("Your footage or exported AI video, or leave empty for the existing travel clip");
      const music = await ask("Your licensed music file, or leave empty for an original instrumental");
      if (video) options.video = video;
      if (music) options.music = music;
      console.log("Rendering...");
    }
    const result = render(options);
    console.log(JSON.stringify(result, null, 2));
    console.log("\nSaved locally. Choose option 3 when you want to queue the prepared Reel in Make.");
  } finally { rl.close(); }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
