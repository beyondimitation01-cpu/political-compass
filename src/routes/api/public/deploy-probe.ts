import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/deploy-probe")({
  server: {
    handlers: {
      GET: async () =>
        new Response("okee", {
          headers: { "Content-Type": "text/plain" },
        }),
    },
  },
});
