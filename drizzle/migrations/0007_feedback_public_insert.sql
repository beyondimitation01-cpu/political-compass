alter table public.feedback enable row level security;

drop policy if exists "anyone can submit" on public.feedback;
create policy "anyone can submit"
  on public.feedback
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anyone can read" on public.feedback;
create policy "anyone can read"
  on public.feedback
  for select
  to anon, authenticated
  using (true);

grant select, insert on table public.feedback to anon, authenticated;
