import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/feedback/count")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { count, error } = await (supabaseAdmin as any)
            .from("feedback")
            .select("id", { count: "exact", head: true });

          if (error) {
            console.error("Feedback count failed", error);
            return Response.json(
              { ok: false, error: "Unable to read feedback count" },
              { status: 500 },
            );
          }

          return Response.json({ ok: true, count: count ?? 0 });
        } catch (error) {
          console.error("Feedback count failed", error);
          return Response.json(
            { ok: false, error: "Unable to read feedback count" },
            { status: 500 },
          );
        }
      },
    },
  },
});
