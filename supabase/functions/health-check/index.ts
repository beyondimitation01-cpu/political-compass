import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { reportRuntimeEnv } from "./_internal.ts";

serve(async (_req) => {
  const summary = reportRuntimeEnv();
  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
});
