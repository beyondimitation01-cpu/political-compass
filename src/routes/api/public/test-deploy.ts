import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/test-deploy")({
  server: {
    handlers: {
      GET: async () =>
        new Response("hello", {
          headers: { "Content-Type": "text/plain" },
        }),
    },
  },
});
