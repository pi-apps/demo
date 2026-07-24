-- Pi Network App Tables

-- Users table for Pi authenticated users
CREATE TABLE IF NOT EXISTS public.pi_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT UNIQUE NOT NULL,
  pi_username TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages table for chat
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid TEXT NOT NULL,
  pi_username TEXT NOT NULL,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  reply_to_username TEXT,
  reply_to_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table for Pi payments
CREATE TABLE IF NOT EXISTS public.pi_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_payment_id TEXT UNIQUE,
  pi_uid TEXT NOT NULL,
  pi_username TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'pending',
  tx_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pi_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pi_payments ENABLE ROW LEVEL SECURITY;

-- Allow all operations (Pi SDK handles auth externally, API routes use service role key)
DROP POLICY IF EXISTS "pi_users_all" ON public.pi_users;
CREATE POLICY "pi_users_all" ON public.pi_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "messages_all" ON public.messages;
CREATE POLICY "messages_all" ON public.messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "pi_payments_all" ON public.pi_payments;
CREATE POLICY "pi_payments_all" ON public.pi_payments FOR ALL USING (true) WITH CHECK (true);
-- Profiles table for pioneers
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Messages table for chat
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_select_all" on public.messages for select using (true);
create policy "messages_insert_own" on public.messages for insert with check (auth.uid() = user_id);
create policy "messages_delete_own" on public.messages for delete using (auth.uid() = user_id);

-- Pi payments table
create table if not exists public.pi_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pi_payment_id text,
  amount numeric not null,
  memo text,
  status text not null default 'pending',
  tx_id text,
  created_at timestamptz default now()
);

alter table public.pi_payments enable row level security;

create policy "payments_select_own" on public.pi_payments for select using (auth.uid() = user_id);
create policy "payments_insert_own" on public.pi_payments for insert with check (auth.uid() = user_id);
create policy "payments_update_own" on public.pi_payments for update using (auth.uid() = user_id);

-- Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
