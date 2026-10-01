-- Fact-Checked Quotes Archive
-- Public readers can see published entries. Only admins can create and edit archive records.
create table if not exists public.figure_quotes (
  id uuid primary key default gen_random_uuid(),
  figure_slug text not null,
  figure_name text not null,
  quote_text text not null check (length(trim(quote_text)) > 0),
  statement_type text not null default 'quote'
    check (statement_type in ('quote', 'speech', 'interview', 'public_statement')),
  spoken_at date,
  venue text,
  context text not null default '',
  topic_tags text[] not null default '{}',
  source_title text not null,
  source_url text not null check (source_url ~* '^https?://'),
  source_publisher text,
  verification_status text not null default 'unverified'
    check (verification_status in ('verified', 'partially_verified', 'disputed', 'unverified')),
  verification_notes text not null default '',
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists figure_quotes_public_date_idx
  on public.figure_quotes (published, spoken_at desc);
create index if not exists figure_quotes_figure_slug_idx
  on public.figure_quotes (figure_slug);
create index if not exists figure_quotes_tags_idx
  on public.figure_quotes using gin (topic_tags);

create or replace function public.set_figure_quotes_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_figure_quotes_updated_at on public.figure_quotes;
create trigger set_figure_quotes_updated_at
before update on public.figure_quotes
for each row execute function public.set_figure_quotes_updated_at();

alter table public.figure_quotes enable row level security;
revoke all on table public.figure_quotes from anon, authenticated;
grant select on table public.figure_quotes to anon, authenticated;
grant insert, update, delete on table public.figure_quotes to authenticated;

create policy "Anyone can read published quotes"
on public.figure_quotes for select to anon, authenticated
using (published = true or (select public.has_role('admin'::public.app_role, (select auth.uid()))));

create policy "Admins can insert quotes"
on public.figure_quotes for insert to authenticated
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

create policy "Admins can update quotes"
on public.figure_quotes for update to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

create policy "Admins can delete quotes"
on public.figure_quotes for delete to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
