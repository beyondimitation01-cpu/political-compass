create table if not exists public.figure_relationships (
  id uuid primary key default gen_random_uuid(),
  from_figure_slug text not null,
  from_figure_name text not null,
  to_figure_slug text not null,
  to_figure_name text not null,
  relationship_type text not null check (relationship_type in ('cabinet_colleague','political_ally','political_rival','predecessor','successor','family')),
  description text not null default '',
  started_at date,
  ended_at date,
  source_title text not null check (length(trim(source_title)) > 0),
  source_url text not null check (source_url ~* '^https?://'),
  source_publisher text,
  verification_status text not null default 'unverified'
    check (verification_status in ('verified','partially_verified','disputed','unverified')),
  verification_notes text not null default '',
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_figure_slug <> to_figure_slug),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);
create index if not exists figure_relationships_from_idx on public.figure_relationships(from_figure_slug);
create index if not exists figure_relationships_to_idx on public.figure_relationships(to_figure_slug);
create index if not exists figure_relationships_public_idx on public.figure_relationships(published, relationship_type);
create or replace function public.set_figure_relationships_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists set_figure_relationships_updated_at on public.figure_relationships;
create trigger set_figure_relationships_updated_at before update on public.figure_relationships
for each row execute function public.set_figure_relationships_updated_at();
alter table public.figure_relationships enable row level security;
revoke all on table public.figure_relationships from anon, authenticated;
grant select on table public.figure_relationships to anon, authenticated;
grant insert, update, delete on table public.figure_relationships to authenticated;
grant all on table public.figure_relationships to service_role;
create policy "Anyone can read published relationships"
on public.figure_relationships for select to anon, authenticated
using (published = true or (select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can insert relationships"
on public.figure_relationships for insert to authenticated
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can update relationships"
on public.figure_relationships for update to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
with check ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
create policy "Admins can delete relationships"
on public.figure_relationships for delete to authenticated
using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));