create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  score integer not null default 0,
  level integer not null default 1,
  lost_revenue integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.simulation_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  verdict text not null,
  action text not null,
  type text not null,
  time_taken_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.security_leaks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  asset text not null,
  created_at timestamptz not null default now()
);

create index if not exists simulation_history_profile_id_created_at_idx
  on public.simulation_history (profile_id, created_at desc);

create index if not exists security_leaks_profile_id_created_at_idx
  on public.security_leaks (profile_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.simulation_history enable row level security;
alter table public.security_leaks enable row level security;

drop policy if exists "Public access to profiles" on public.profiles;
create policy "Public access to profiles"
  on public.profiles
  for all
  using (true)
  with check (true);

drop policy if exists "Public access to simulation_history" on public.simulation_history;
create policy "Public access to simulation_history"
  on public.simulation_history
  for all
  using (true)
  with check (true);

drop policy if exists "Public access to security_leaks" on public.security_leaks;
create policy "Public access to security_leaks"
  on public.security_leaks
  for all
  using (true)
  with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.simulation_history to anon, authenticated;
grant select, insert, update, delete on public.security_leaks to anon, authenticated;
