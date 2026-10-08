create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  category text not null,
  rating integer not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint feedback_rating_range check (rating between 1 and 5)
);
grant all on public.complaints to service_role;
grant all on public.feedback to service_role;
alter table public.complaints enable row level security;
alter table public.feedback enable row level security;
create index if not exists complaints_created_at_idx on public.complaints (created_at desc);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);