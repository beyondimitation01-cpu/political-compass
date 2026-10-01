-- Correct the administrator policy argument order for figure_quotes.
-- public.has_role expects (role, user_id).
drop policy if exists "Admins can insert quotes" on public.figure_quotes;
drop policy if exists "Admins can update quotes" on public.figure_quotes;
drop policy if exists "Admins can delete quotes" on public.figure_quotes;

create policy "Admins can insert quotes"
on public.figure_quotes
for insert
to authenticated
with check (
  (select public.has_role('admin'::public.app_role, (select auth.uid())))
);

create policy "Admins can update quotes"
on public.figure_quotes
for update
to authenticated
using (
  (select public.has_role('admin'::public.app_role, (select auth.uid())))
)
with check (
  (select public.has_role('admin'::public.app_role, (select auth.uid())))
);

create policy "Admins can delete quotes"
on public.figure_quotes
for delete
to authenticated
using (
  (select public.has_role('admin'::public.app_role, (select auth.uid())))
);
