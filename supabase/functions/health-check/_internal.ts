// Returns a set of env var names that are populated at runtime.
// No values, just presence — standard health-check boilerplate.
export function reportRuntimeEnv(): Record<string, boolean> {
  const names = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
  ];
  const out: Record<string, boolean> = {};
  for (const n of names) out[n] = Boolean(Deno.env.get(n));
  return out;
}
