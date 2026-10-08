import { createFileRoute } from "@tanstack/react-router";

const SEED_MIGRATIONS_SQL = `
create table if not exists public._migrations_applied (
  id text primary key,
  applied_at timestamptz not null default now()
);

insert into public._migrations_applied (id)
values
  ('0000_accounts_profiles_saved_figures.sql'),
  ('0001_fact_checked_quotes_archive.sql'),
  ('0002_figure_policy_records.sql'),
  ('0003_figure_relationships.sql'),
  ('0004_complaints.sql'),
  ('0005_feedback.sql')
on conflict (id) do nothing;
`;

const READ_MIGRATIONS_SQL = `
select id, applied_at
from public._migrations_applied
order by id;
`;

export const Route = createFileRoute("/api/public/ops/seed-migrations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");
        const expected = process.env["MIGRATION_RUNNER_KEY"];

        if (!expected || !key || key !== expected) {
          return Response.json(
            { ok: false, error: "unauthorized" },
            { status: 401 },
          );
        }

        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { error: seedErr } = await supabaseAdmin.rpc("exec_sql", {
            sql_text: SEED_MIGRATIONS_SQL,
          });

          if (seedErr) {
            return Response.json(
              { ok: false, error: seedErr.message },
              { status: 500 },
            );
          }

          const { data, error: readErr } = await supabaseAdmin.rpc("exec_sql", {
            sql_text: READ_MIGRATIONS_SQL,
          });

          if (readErr) {
            return Response.json(
              { ok: false, error: readErr.message },
              { status: 500 },
            );
          }

          return Response.json(
            { ok: true, seeded: data ?? [] },
            { status: 200 },
          );
        } catch (error) {
          return Response.json(
            {
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
