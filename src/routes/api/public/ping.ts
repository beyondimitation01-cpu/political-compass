import { createFileRoute } from "@tanstack/react-router";

const pong = (echo?: string) =>
  Response.json({
    ping: "pong",
    ...(echo ? { echo } : {}),
    at: new Date().toISOString(),
  });

const readEcho = async (request: Request) => {
  try {
    const body = (await request.json()) as { msg?: unknown };
    return typeof body?.msg === "string" ? body.msg.slice(0, 200) : undefined;
  } catch {
    return undefined;
  }
};

export const Route = createFileRoute("/api/public/ping")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        pong(new URL(request.url).searchParams.get("msg") ?? undefined),
      POST: async ({ request }) => pong(await readEcho(request)),
    },
  },
});
