import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/extension-proof")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          ok: true,
          from: "extension",
          ts: new Date().toISOString(),
        });
      },
    },
  },
});
