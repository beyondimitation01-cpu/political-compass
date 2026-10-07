import { createFileRoute } from "@tanstack/react-router";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { complaints } from "../../../../../drizzle/schema";

export const Route = createFileRoute("/api/public/complaints/recent")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const rows = await db
            .select({
              id: complaints.id,
              name: complaints.name,
              message: complaints.message,
              createdAt: complaints.createdAt,
            })
            .from(complaints)
            .orderBy(desc(complaints.createdAt))
            .limit(20);

          return Response.json({ ok: true, complaints: rows });
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
