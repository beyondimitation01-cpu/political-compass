import { createFileRoute } from "@tanstack/react-router";

import { db } from "@/lib/db";
import { complaints } from "../../../../../drizzle/schema";

export const Route = createFileRoute("/api/public/complaints/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            name?: unknown;
            email?: unknown;
            message?: unknown;
          };

          const name = typeof body.name === "string" ? body.name.trim() : "";
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const message =
            typeof body.message === "string" ? body.message.trim() : "";

          if (!name) return Response.json({ ok: false, error: "Name is required" }, { status: 400 });
          if (!email) return Response.json({ ok: false, error: "Email is required" }, { status: 400 });
          if (!email.includes("@")) return Response.json({ ok: false, error: "Email must contain @" }, { status: 400 });
          if (!message) return Response.json({ ok: false, error: "Message is required" }, { status: 400 });

          const [row] = await db.insert(complaints).values({ name, email, message }).returning({ id: complaints.id });
          return Response.json({ ok: true, id: row.id });
        } catch (error) {
          console.error("Complaint submission failed", error);
          return Response.json({ ok: false, error: "Unable to submit complaint" }, { status: 500 });
        }
      },
    },
  },
});
