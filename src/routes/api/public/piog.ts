import { createFileRoute } from "@tanstack/react-router";

const greet = (name?: string) =>
  Response.json({
    piog: "hello hello",
    ...(name ? { name } : {}),
    at: new Date().toISOString(),
  });

export const Route = createFileRoute("/api/public/piog")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        greet(new URL(request.url).searchParams.get("name") ?? undefined),
      POST: async ({ request }) => {
        let name: string | undefined;
        try {
          const body = (await request.json()) as { name?: unknown };
          name =
            typeof body?.name === "string" ? body.name.slice(0, 100) : undefined;
        } catch {
          // no body — that's fine
        }
        return greet(name);
      },
    },
  },
});
