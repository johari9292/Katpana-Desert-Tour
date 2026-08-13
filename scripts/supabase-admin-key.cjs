function resolveSupabaseAdminKey(env = process.env) {
  const candidates = [
    ["SUPABASE_SECRET_KEY", env.SUPABASE_SECRET_KEY],
    ["SUPABASE_SERVICE_ROLE_KEY", env.SUPABASE_SERVICE_ROLE_KEY],
  ];
  const configured = candidates.filter(([, value]) => Boolean(value));

  if (!configured.length) return null;

  for (const [, value] of configured) {
    if (isSupabaseAdminKey(value)) return value;
  }

  const configuredNames = configured.map(([name]) => name).join(" and ");
  throw new Error(
    `${configuredNames} does not contain a Supabase admin key. `
      + "Use an sb_secret_ key or a legacy JWT whose role is service_role; an anon/publishable key cannot read the editorial archive.",
  );
}

function isSupabaseAdminKey(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("sb_secret_")) return true;
  if (value.startsWith("sb_publishable_")) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return payload?.role === "service_role";
  } catch {
    return false;
  }
}

module.exports = { isSupabaseAdminKey, resolveSupabaseAdminKey };
