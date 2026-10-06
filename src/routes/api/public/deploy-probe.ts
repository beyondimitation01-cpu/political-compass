import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/deploy-probe")({
  server: {
    handlers: {
      GET: async () =>
        new Response("ok", {
          headers: { "Content-Type": "text/plain" },
        }),
    },
  },
});
