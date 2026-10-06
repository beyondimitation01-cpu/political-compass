import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/test-deploy")({
  server: {
    handlers: {
      GET: async () =>
        new Response("hero", {
          headers: { "Content-Type": "text/plain" },
        }),
    },
  },
});
