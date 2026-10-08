alter table public.complaints enable row level security;

drop policy if exists "anyone can submit" on public.complaints;
create policy "anyone can submit"
  on public.complaints
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anyone can read" on public.complaints;
create policy "anyone can read"
  on public.complaints
  for select
  to anon, authenticated
  using (true);

grant select, insert on table public.complaints to anon, authenticated;
