create table if not exists public.figure_policy_records (
  id uuid primary key default gen_random_uuid(),
  figure_slug text not null,
  figure_name text not null,
  policy_topic text not null check (length(trim(policy_topic)) > 0),
  record_type text not null default 'position' check (record_type in ('position', 'vote')),
  position text not null check (length(trim(position)) > 0),
  description text not null default '',
  recorded_at date,
  legislative_body text,
  bill_or_policy text,
  vote text check (vote is null or vote in ('for', 'against', 'abstain', 'absent', 'not_applicable')),
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
create index if not exists figure_policy_records_public_date_idx on public.figure_policy_records (published, recorded_at desc);
create index if not exists figure_policy_records_figure_idx on public.figure_policy_records (figure_slug);
create index if not exists figure_policy_records_topic_idx on public.figure_policy_records (policy_topic);
create or replace function public.set_figure_policy_records_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists set_figure_policy_records_updated_at on public.figure_policy_records;
create trigger set_figure_policy_records_updated_at before update on public.figure_policy_records
for each row execute function public.set_figure_policy_records_updated_at();
alter table public.figure_policy_records enable row level security;
revoke all on table public.figure_policy_records from anon, authenticated;
grant select on table public.figure_policy_records to anon, authenticated;
grant insert, update, delete on table public.figure_policy_records to authenticated;
grant all on table public.figure_policy_records to service_role;
create policy "Anyone can read published policy records" on public.figure_policy_records
for select to anon, authenticated using (published = true or (select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can insert policy records" on public.figure_policy_records
for insert to authenticated with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can update policy records" on public.figure_policy_records
for update to authenticated using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can delete policy records" on public.figure_policy_records
for delete to authenticated using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));