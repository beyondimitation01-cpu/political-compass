import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import type { Figure } from "@/lib/figures";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export class GatewayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function profileText(f: Figure) {
  return [
    `## ${f.name}`,
    `Title: ${f.title}`,
    `Country: ${f.country} | Region: ${f.region} | Era: ${f.era}`,
    `Party: ${f.party} | Born: ${f.born} | Died: ${f.died ?? "living"}`,
    `Summary: ${f.summary}`,
    `Biography:\n${f.bio.join("\n")}`,
    `Offices:\n- ${f.offices.join("\n- ")}`,
    `Timeline:\n${f.timeline.map((t) => `- ${t.year}: ${t.title} — ${t.detail}`).join("\n")}`,
  ].join("\n");
}

export async function runComparison(figs: Figure[], question: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new GatewayError(500, "AI is not configured.");

  let status = 0;
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const res = await fetch(input, init);
      status = res.status;
      return res;
    },
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system:
      "You are a neutral, non-partisan political historian. Compare the given figures strictly using the supplied profiles. " +
      "Do not praise or condemn; present facts evenly and give each figure comparable space. " +
      "If the profiles don't contain information needed to answer, say so plainly instead of guessing. " +
      "Answer in concise Markdown under 350 words, with short headings or bullets.",
    prompt: `Profiles:\n\n${figs.map(profileText).join("\n\n")}\n\nComparison question: ${question}`,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    const text = await result.text;
    if (!text.trim()) throw new GatewayError(422, "The AI declined to produce a comparison.");
    return text;
  } catch (e) {
    if (e instanceof GatewayError) throw e;
    const s = (e as { statusCode?: number }).statusCode ?? status;
    if (s === 429) throw new GatewayError(429, "Too many requests right now. Please try again shortly.");
    if (s === 402) throw new GatewayError(402, "AI credits are exhausted for this workspace.");
    if (s === 403) throw new GatewayError(403, "AI access is currently blocked for this workspace.");
    throw new GatewayError(s || 500, "The comparison could not be generated.");
  }
}
