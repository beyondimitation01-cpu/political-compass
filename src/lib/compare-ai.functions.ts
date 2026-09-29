import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { figures } from "@/lib/figures";

const schema = z.object({
  slugs: z.array(z.string()).min(2).max(4),
  question: z.string().trim().min(3).max(500),
});

export const compareWithAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const picked = [...new Set(data.slugs)]
      .map((s) => figures.find((f) => f.slug === s))
      .filter((f): f is NonNullable<typeof f> => !!f);
    if (picked.length < 2) return { ok: false as const, error: "Select at least two different leaders." };
    const { runComparison, GatewayError } = await import("@/lib/compare-ai.server");
    try {
      return { ok: true as const, text: await runComparison(picked, data.question) };
    } catch (e) {
      return { ok: false as const, error: e instanceof GatewayError ? e.message : "Something went wrong." };
    }
  });
