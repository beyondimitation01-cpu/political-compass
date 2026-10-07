import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/complaints/recent")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { data, error } = await (supabaseAdmin as any)
            .from("complaints")
            .select("id,name,message,created_at")
            .order("created_at", { ascending: false })
            .limit(20);

          if (error) {
            console.error("Recent complaints lookup failed", error);
            return Response.json(
              { ok: false, error: "Unable to load recent complaints" },
              { status: 500 },
            );
          }

          return Response.json({
            ok: true,
            complaints: (data ?? []).map((complaint: any) => ({
              id: complaint.id,
              name: complaint.name,
              message: complaint.message,
              createdAt: complaint.created_at,
            })),
          });
        } catch (error) {
          console.error("Recent complaints lookup failed", error);
          return Response.json(
            { ok: false, error: "Unable to load recent complaints" },
            { status: 500 },
          );
        }
      },
    },
  },
});
