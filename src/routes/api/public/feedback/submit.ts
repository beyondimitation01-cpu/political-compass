import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/feedback/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            name?: unknown;
            email?: unknown;
            category?: unknown;
            rating?: unknown;
            message?: unknown;
          };

          const name = typeof body.name === "string" ? body.name.trim() : "";
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const category =
            typeof body.category === "string" ? body.category.trim() : "";
          const message =
            typeof body.message === "string" ? body.message.trim() : "";
          const rating =
            typeof body.rating === "string"
              ? Number(body.rating)
              : typeof body.rating === "number"
                ? body.rating
                : Number.NaN;

          if (!category) {
            return Response.json(
              { ok: false, error: "Feedback type is required" },
              { status: 400 },
            );
          }

          if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return Response.json(
              { ok: false, error: "Rating must be between 1 and 5" },
              { status: 400 },
            );
          }

          if (!message || message.length < 5) {
            return Response.json(
              { ok: false, error: "Feedback must be at least 5 characters" },
              { status: 400 },
            );
          }

          if (email && !email.includes("@")) {
            return Response.json(
              { ok: false, error: "Email must contain @" },
              { status: 400 },
            );
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );
          const { data, error } = await (supabaseAdmin as any)
            .from("feedback")
            .insert({
              name: name || null,
              email: email || null,
              category,
              rating,
              message,
            })
            .select("id")
            .single();

          if (error || !data?.id) {
            console.error("Feedback submission failed", error);
            return Response.json(
              { ok: false, error: "Unable to submit feedback" },
              { status: 500 },
            );
          }

          return Response.json({ ok: true, id: data.id });
        } catch (error) {
          console.error("Feedback submission failed", error);
          return Response.json(
            { ok: false, error: "Unable to submit feedback" },
            { status: 500 },
          );
        }
      },
    },
  },
});
