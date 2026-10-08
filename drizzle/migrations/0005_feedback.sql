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
