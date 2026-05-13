create table if not exists public.prayer_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mode text not null default 'Free Prayer',
  type text not null default 'public',
  creator text not null,
  password text,
  user_count int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.prayer_rooms enable row level security;

create policy "anyone can read prayer rooms" on public.prayer_rooms for select using (true);
create policy "anonymous can insert prayer rooms" on public.prayer_rooms for insert with check (true);
create policy "creator can delete own room" on public.prayer_rooms for delete using (auth.uid() = creator);
