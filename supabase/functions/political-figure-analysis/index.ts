const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-6-astra";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const question = typeof body?.question === "string" ? body.question.trim() : "";
    if (!name || name.length > 200) return json({ error: "A valid figure name is required." }, 400);
    if (question.length > 1000) return json({ error: "Question is too long." }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a neutral, non-partisan political historian. Present facts evenly, do not praise or condemn, and say plainly when you are unsure. Answer in concise Markdown under 300 words.",
          },
          {
            role: "user",
            content: `Figure: ${name}\n${question || "Give a balanced overview of this figure's career and legacy."}`,
          },
        ],
      }),
    });

    if (res.status === 429) return json({ error: "Too many requests. Try again shortly." }, 429);
    if (res.status === 402) return json({ error: "AI credits are exhausted." }, 402);
    if (!res.ok) return json({ error: "The analysis could not be generated." }, 502);

    const data = await res.json();
    const analysis: string = data?.choices?.[0]?.message?.content ?? "";
    return json({ analysis });
  } catch (_e) {
    return json({ error: "Unexpected error." }, 500);
  }
});
