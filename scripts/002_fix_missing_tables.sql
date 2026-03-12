-- Pi Users table (stores Pi Network authenticated users)
create table if not exists public.pi_users (
  id uuid primary key default gen_random_uuid(),
  pi_uid text unique not null,
  username text not null,
  access_token text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pi_users enable row level security;

drop policy if exists "pi_users_select_all" on public.pi_users;
create policy "pi_users_select_all" on public.pi_users for select using (true);

drop policy if exists "pi_users_insert_service" on public.pi_users;
create policy "pi_users_insert_service" on public.pi_users for insert with check (true);

drop policy if exists "pi_users_update_service" on public.pi_users;
create policy "pi_users_update_service" on public.pi_users for update using (true);

-- Banned Users table
create table if not exists public.banned_users (
  id uuid primary key default gen_random_uuid(),
  pi_uid text unique not null,
  username text not null,
  reason text default 'Violazione regole chat',
  banned_at timestamptz default now(),
  banned_by text
);

alter table public.banned_users enable row level security;

drop policy if exists "banned_users_select_all" on public.banned_users;
create policy "banned_users_select_all" on public.banned_users for select using (true);

drop policy if exists "banned_users_insert_service" on public.banned_users;
create policy "banned_users_insert_service" on public.banned_users for insert with check (true);

drop policy if exists "banned_users_update_service" on public.banned_users;
create policy "banned_users_update_service" on public.banned_users for update using (true);

-- Access Logs table (for admin panel to track all user logins)
create table if not exists public.access_logs (
  id uuid primary key default gen_random_uuid(),
  pi_uid text not null,
  username text not null,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.access_logs enable row level security;

drop policy if exists "access_logs_select_admin" on public.access_logs;
create policy "access_logs_select_admin" on public.access_logs for select using (true);

drop policy if exists "access_logs_insert_service" on public.access_logs;
create policy "access_logs_insert_service" on public.access_logs for insert with check (true);

-- Donations table (tracks Pi Network donations/payments)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  pi_uid text not null,
  username text not null,
  pi_payment_id text unique,
  tx_id text,
  amount numeric not null,
  memo text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.donations enable row level security;

drop policy if exists "donations_select_all" on public.donations;
create policy "donations_select_all" on public.donations for select using (true);

drop policy if exists "donations_insert_service" on public.donations;
create policy "donations_insert_service" on public.donations for insert with check (true);

drop policy if exists "donations_update_service" on public.donations;
create policy "donations_update_service" on public.donations for update using (true);

-- Create indexes for better performance
create index if not exists idx_access_logs_created_at on public.access_logs(created_at desc);
create index if not exists idx_access_logs_pi_uid on public.access_logs(pi_uid);
create index if not exists idx_donations_pi_uid on public.donations(pi_uid);
create index if not exists idx_donations_status on public.donations(status);
