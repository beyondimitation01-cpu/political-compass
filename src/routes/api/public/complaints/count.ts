import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/complaints/count")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { count, error } = await (supabaseAdmin as any)
            .from("complaints")
            .select("id", { count: "exact", head: true });

          if (error) {
            console.error("Complaint count failed", error);
            return Response.json(
              { ok: false, error: "Unable to read complaint count" },
              { status: 500 },
            );
          }

          return Response.json({ ok: true, count: count ?? 0 });
        } catch (error) {
          console.error("Complaint count failed", error);
          return Response.json(
            { ok: false, error: "Unable to read complaint count" },
            { status: 500 },
          );
        }
      },
    },
  },
});
