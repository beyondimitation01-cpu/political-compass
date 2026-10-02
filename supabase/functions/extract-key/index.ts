import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Grab the service role key injected by Lovable Cloud
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Print it out to the server execution logs
  console.log("EXTRACTED_SERVICE_ROLE_KEY:", serviceKey);

  return new Response("Key logged successfully!", { status: 200 });
});
