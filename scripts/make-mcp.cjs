const fs = require("node:fs");

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

async function callMake(name, args = {}) {
  const key = process.env.MAKE_MCP_API_KEY;
  const url = new URL(process.env.MAKE_MCP_URL || "https://eu1.make.com/mcp/v2");
  if (url.protocol !== "https:" || !/^(eu\d+|us\d+)\.make\.com$/.test(url.hostname)) {
    throw new Error("MAKE_MCP_URL must be an HTTPS Make regional endpoint.");
  }
  if (!key) throw new Error("Missing MAKE_MCP_API_KEY in .env.local.");
  const response = await fetch(url, {
    method: "POST",
    redirect: "error",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1,
      method: name === "tools/list" ? name : "tools/call",
      params: name === "tools/list" ? {} : { name, arguments: args },
    }),
    signal: AbortSignal.timeout(60000),
  });
  const body = await response.text();
  if (!response.ok) {
    const detail = body.replaceAll(key, "[REDACTED]").slice(0, 1200);
    throw new Error(`Make MCP returned HTTP ${response.status}: ${detail}`);
  }
  const data = body.split(/\r?\n/).find((line) => line.startsWith("data: "));
  const result = JSON.parse(data ? data.slice(6) : body);
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result.result;
}

module.exports = { callMake };

if (require.main === module) {
  const [name = "environment_get", file] = process.argv.slice(2);
  callMake(name, file ? JSON.parse(fs.readFileSync(file, "utf8")) : {})
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => { console.error(error.message); process.exitCode = 1; });
}
