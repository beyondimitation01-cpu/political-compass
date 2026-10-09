import { readdir, readFile } from "fs/promises";
import { join } from "path";

import { createFileRoute } from "@tanstack/react-router";

const RUNNER_KEY = 1234;

const TRACKING_TABLE_SQL = `
create table if not exists public._migrations_applied (
  id text primary key,
  applied_at timestamptz not null default now()
);
`;

export const Route = createFileRoute("/api/public/ops/run-migrations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");

        if (key !== String(RUNNER_KEY)) {
          return Response.json(
            { ok: false, error: "unauthorized" },
            { status: 401 },
          );
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { error: initErr } = await supabaseAdmin.rpc("exec_sql", {
            sql_text: TRACKING_TABLE_SQL,
          });

          if (initErr) {
            return Response.json(
              { ok: false, error: initErr.message },
              { status: 500 },
            );
          }

          const dir = join(process.cwd(), "drizzle/migrations");
          const files = (await readdir(dir))
            .filter((file) => file.endsWith(".sql"))
            .sort();

          const applied: string[] = [];
          const skipped: string[] = [];

          for (const file of files) {
            const { data: existing, error: lookupErr } = await supabaseAdmin
              .from("_migrations_applied" as never)
              .select("id")
              .eq("id", file)
              .maybeSingle();

            if (lookupErr) {
              return Response.json(
                { ok: false, error: lookupErr.message, failed_at: file },
                { status: 500 },
              );
            }

            if (existing) {
              skipped.push(file);
              continue;
            }

            const sql = await readFile(join(dir, file), "utf8");
            const { data, error } = await supabaseAdmin.rpc("exec_sql", {
              sql_text: sql,
            });

            if (error) {
              return Response.json(
                { ok: false, error: error.message, failed_at: file },
                { status: 500 },
              );
            }

            if (
              data &&
              typeof data === "object" &&
              "ok" in data &&
              data["ok"] === false
            ) {
              return Response.json(
                {
                  ok: false,
                  error:
                    "error" in data && typeof data["error"] === "string"
                      ? data["error"]
                      : "unknown sql error",
                  failed_at: file,
                },
                { status: 500 },
              );
            }

            const { error: recordErr } = await supabaseAdmin
              .from("_migrations_applied" as never)
              .insert({ id: file } as never);

            if (recordErr) {
              return Response.json(
                { ok: false, error: recordErr.message, failed_at: file },
                { status: 500 },
              );
            }

            applied.push(file);
          }

          return Response.json({ ok: true, applied, skipped }, { status: 200 });
        } catch (error) {
          return Response.json(
            {
              ok: false,
              error: error instanceof Error ? error.message : String(error),
              failed_at: "unknown",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
