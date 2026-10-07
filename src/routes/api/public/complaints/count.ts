import { createFileRoute } from "@tanstack/react-router";
import { count } from "drizzle-orm";

import { db } from "@/lib/db";
import { complaints } from "../../../../../drizzle/schema";

export const Route = createFileRoute("/api/public/complaints/count")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [result] = await db.select({ count: count() }).from(complaints);
          return Response.json({ ok: true, count: result.count });
        } catch (error) {
          console.error("Complaint count failed", error);
          return Response.json({ ok: false, error: "Unable to read complaint count" }, { status: 500 });
        }
      },
    },
  },
});
