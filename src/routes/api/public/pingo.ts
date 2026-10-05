import { createFileRoute } from "@tanstack/react-router";

const hello = (name?: string) =>
  Response.json({
    pingo: "hello world",
    ...(name ? { name } : {}),
    at: new Date().toISOString(),
  });

export const Route = createFileRoute("/api/public/pingo")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        hello(new URL(request.url).searchParams.get("name") ?? undefined),
      POST: async ({ request }) => {
        let name: string | undefined;
        try {
          const body = (await request.json()) as { name?: unknown };
          name = typeof body?.name === "string" ? body.name.slice(0, 100) : undefined;
        } catch {
          // no body — that's fine
        }
        return hello(name);
      },
    },
  },
});
