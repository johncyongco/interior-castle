create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique
);

create table if not exists public.interior_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  state text not null,
  "timestamp" timestamptz not null default now()
);

create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  content text not null,
  ai_response text not null
);

create table if not exists public.companions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  companion_id uuid not null references public.users (id) on delete cascade,
  unique (user_id, companion_id)
);

alter table public.users enable row level security;
alter table public.interior_logs enable row level security;
alter table public.reflections enable row level security;
alter table public.companions enable row level security;

create policy "users read own row"
on public.users
for select
using (auth.uid() = id);

create policy "users insert own row"
on public.users
for insert
with check (auth.uid() = id);

create policy "logs read own row"
on public.interior_logs
for select
using (auth.uid() = user_id);

create policy "logs insert own row"
on public.interior_logs
for insert
with check (auth.uid() = user_id);

create policy "reflections read own row"
on public.reflections
for select
using (auth.uid() = user_id);

create policy "reflections insert own row"
on public.reflections
for insert
with check (auth.uid() = user_id);

create policy "companions read own row"
on public.companions
for select
using (auth.uid() = user_id or auth.uid() = companion_id);

create policy "companions insert own row"
on public.companions
for insert
with check (auth.uid() = user_id);
