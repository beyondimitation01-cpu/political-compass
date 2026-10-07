const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Research = {
  name: string;
  wikipedia?: {
    title: string;
    description?: string;
    extract?: string;
    url?: string;
    thumbnail?: string;
  };
  wikidata?: {
    id?: string;
    description?: string;
    occupations?: string[];
    parties?: string[];
    countries?: string[];
    birthDate?: string;
    deathDate?: string;
  };
  sources: string[];
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const cleanName = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 160) : "";

async function wikipedia(name: string) {
  const title = encodeURIComponent(name.replace(/\s+/g, "_"));
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    { headers: { "User-Agent": "PoliticalCompass/1.0" } },
  );

  if (!response.ok) return undefined;
  const data = await response.json();
  return {
    title: data.title,
    description: data.description,
    extract: data.extract,
    url: data.content_urls?.desktop?.page,
    thumbnail: data.thumbnail?.source,
  };
}

async function wikidata(name: string) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: name,
    language: "en",
    format: "json",
    limit: "1",
  });

  const searchResponse = await fetch(
    `https://www.wikidata.org/w/api.php?${params}`,
    { headers: { "User-Agent": "PoliticalCompass/1.0" } },
  );
  if (!searchResponse.ok) return undefined;

  const search = await searchResponse.json();
  const id = search.search?.[0]?.id;
  if (!id) return undefined;

  const entityResponse = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
    { headers: { "User-Agent": "PoliticalCompass/1.0" } },
  );
  if (!entityResponse.ok) return { id };

  const entity = (await entityResponse.json()).entities?.[id];
  const claims = entity?.claims ?? {};

  const labels = async (property: string) => {
    const ids = (claims[property] ?? [])
      .map((claim: any) => claim.mainsnak?.datavalue?.value?.id)
      .filter(Boolean)
      .slice(0, 8);
    if (!ids.length) return [];

    const p = new URLSearchParams({
      action: "wbgetentities",
      ids: ids.join("|"),
      props: "labels",
      languages: "en",
      format: "json",
    });
    const r = await fetch(`https://www.wikidata.org/w/api.php?${p}`);
    if (!r.ok) return [];
    const data = await r.json();
    return ids.map((item: string) => data.entities?.[item]?.labels?.en?.value).filter(Boolean);
  };

  const time = (property: string) =>
    claims[property]?.[0]?.mainsnak?.datavalue?.value?.time?.replace(/^\+/, "").split("T")[0];

  return {
    id,
    description: entity?.descriptions?.en?.value,
    occupations: await labels("P106"),
    parties: await labels("P102"),
    countries: await labels("P27"),
    birthDate: time("P569"),
    deathDate: time("P570"),
  };
}

async function researchFigure(name: string): Promise<Research> {
  const [wiki, wd] = await Promise.all([
    wikipedia(name).catch(() => undefined),
    wikidata(name).catch(() => undefined),
  ]);

  return {
    name,
    wikipedia: wiki,
    wikidata: wd,
    sources: [
      wiki?.url,
      wd?.id ? `https://www.wikidata.org/wiki/${wd.id}` : undefined,
    ].filter(Boolean) as string[],
  };
}

async function analyzeFigure(
  name: string,
  research: Research,
  context?: string,
) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in the Supabase function environment.");
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-5-mini";
  const evidence = JSON.stringify(research);

  const prompt = `Analyze this political figure using documented evidence.

Figure: ${name}

Research:
${evidence}

Additional context:
${context?.slice(0, 12000) || "None"}

Return a JSON object with exactly:
{
  "figure": string,
  "economic": number,
  "social": number,
  "economic_label": string,
  "social_label": string,
  "quadrant": string,
  "confidence": number,
  "summary": string,
  "evidence": [{"claim": string, "direction": "economic"|"social"|"both", "source": string}]
}

Scales:
- economic: -10 = strongly interventionist/left, 0 = mixed, +10 = strongly free-market/right.
- social: -10 = strongly libertarian/civil-liberties, 0 = mixed, +10 = strongly authoritarian/order.
- quadrant must be one of: "Left-Libertarian", "Left-Authoritarian", "Right-Libertarian", "Right-Authoritarian", or "Centrist/Mixed".
- confidence is 0 to 1.

Rules:
1. Use documented policies, laws, speeches, institutional actions, and credible biographical evidence.
2. Do not infer a position merely from party membership or a modern political label.
3. Separate historical context from ideological judgment.
4. If evidence is weak or contradictory, move the score toward 0 and reduce confidence.
5. Be neutral and concise.
6. Evidence sources must be URLs from the supplied research whenever possible.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a neutral political historian. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI analysis failed (${response.status}): ${detail.slice(0, 500)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned no analysis.");

  return JSON.parse(content);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const body = await request.json();
    const action = body?.action;
    const name = cleanName(body?.name);

    if (!name) return json({ error: "A political figure name is required." }, 400);
    if (action !== "research" && action !== "analyze") {
      return json({ error: "action must be 'research' or 'analyze'." }, 400);
    }

    const research = body?.research ?? await researchFigure(name);

    if (action === "research") {
      return json({ ok: true, research });
    }

    const analysis = await analyzeFigure(name, research, body?.context);
    return json({ ok: true, research, analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return json({ ok: false, error: message }, 500);
  }
});
