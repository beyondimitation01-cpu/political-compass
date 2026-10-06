import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/test-deploy")({
  server: {
    handlers: {
      GET: async () =>
        new Response("hennal", {
          headers: { "Content-Type": "text/plain" },
        }),
    },
  },
});
