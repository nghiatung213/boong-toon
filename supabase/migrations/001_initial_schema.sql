-- MirAi Production Schema v1
-- Run in Supabase SQL Editor or: supabase db push

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  constraint profiles_username_len check (char_length(username) >= 3),
  constraint profiles_username_unique unique (username),
  constraint profiles_email_unique unique (email)
);

create index profiles_username_idx on public.profiles (lower(username));
create index profiles_email_idx on public.profiles (lower(email));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
create table public.genres (
  id bigserial primary key,
  name text not null unique
);

create table public.series (
  id text primary key,
  slug text not null unique,
  title text not null,
  type text not null check (type in ('novel', 'manga')),
  synopsis text not null default '',
  cover_url text not null,
  genres text[] not null default '{}',
  status text not null default 'ongoing' check (status in ('ongoing', 'completed', 'hiatus')),
  tagline text,
  is_premium boolean not null default false,
  price integer not null default 0 check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index series_slug_idx on public.series (slug);
create index series_premium_idx on public.series (is_premium) where is_premium = true;

create table public.chapters (
  id text not null,
  series_id text not null references public.series (id) on delete cascade,
  title text not null,
  file_path text not null default '',
  content_markdown text,
  sort_order integer not null default 0,
  is_locked boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (series_id, id)
);

create index chapters_series_order_idx on public.chapters (series_id, sort_order);
create index chapters_published_idx on public.chapters (series_id, published_at);

-- ---------------------------------------------------------------------------
-- Purchases & entitlements
-- ---------------------------------------------------------------------------
create table public.purchase_requests (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  username text not null,
  email text not null,
  series_id text not null references public.series (id) on delete cascade,
  series_slug text not null,
  series_title text not null,
  transfer_note text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index purchase_requests_status_idx on public.purchase_requests (status, created_at desc);
create index purchase_requests_user_idx on public.purchase_requests (user_id);
create index purchase_requests_series_idx on public.purchase_requests (series_slug);

create table public.entitlements (
  id bigserial primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_id text not null references public.series (id) on delete cascade,
  series_slug text not null,
  purchase_request_id text references public.purchase_requests (id) on delete set null,
  approved_at timestamptz not null default now(),
  unique (user_id, series_slug)
);

create index entitlements_user_idx on public.entitlements (user_id);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table public.notifications (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('welcome', 'purchase_approved', 'purchase_rejected', 'system')),
  title text not null,
  message text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where read = false;

-- ---------------------------------------------------------------------------
-- User library (cloud sync for Web / PWA / mobile)
-- ---------------------------------------------------------------------------
create table public.reading_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_slug text not null,
  chapter_id text not null,
  scroll_y integer not null default 0,
  percent smallint not null default 0 check (percent >= 0 and percent <= 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, series_slug, chapter_id)
);

create table public.continue_reading (
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_slug text not null,
  series_title text not null,
  chapter_id text not null,
  chapter_title text not null,
  percent smallint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, series_slug)
);

create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, series_slug)
);

create table public.reading_history (
  id bigserial primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_slug text not null,
  series_title text not null,
  chapter_id text not null,
  chapter_title text not null,
  read_at timestamptz not null default now()
);

create index reading_history_user_idx on public.reading_history (user_id, read_at desc);

-- ---------------------------------------------------------------------------
-- Updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger series_updated_at before update on public.series
  for each row execute function public.set_updated_at();

create trigger chapters_updated_at before update on public.chapters
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.genres enable row level security;
alter table public.series enable row level security;
alter table public.chapters enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.entitlements enable row level security;
alter table public.notifications enable row level security;
alter table public.reading_progress enable row level security;
alter table public.continue_reading enable row level security;
alter table public.favorites enable row level security;
alter table public.reading_history enable row level security;

-- Profiles: users read/update own
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Public catalog read
create policy "genres_public_read" on public.genres for select using (true);
create policy "series_public_read" on public.series for select using (true);
create policy "chapters_public_read" on public.chapters for select using (true);

-- Purchase requests: user CRUD own
create policy "purchases_select_own" on public.purchase_requests for select using (auth.uid() = user_id);
create policy "purchases_insert_own" on public.purchase_requests for insert with check (auth.uid() = user_id);

-- Entitlements: user read own
create policy "entitlements_select_own" on public.entitlements for select using (auth.uid() = user_id);

-- Notifications: user read/update own
create policy "notifications_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications for update using (auth.uid() = user_id);

-- Library sync: user owns rows
create policy "progress_all_own" on public.reading_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "continue_all_own" on public.continue_reading for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favorites_all_own" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "history_select_own" on public.reading_history for select using (auth.uid() = user_id);
create policy "history_insert_own" on public.reading_history for insert with check (auth.uid() = user_id);
create policy "history_delete_own" on public.reading_history for delete using (auth.uid() = user_id);

-- Service role bypasses RLS (used in admin API routes server-side)

-- ---------------------------------------------------------------------------
-- Storage buckets (run in Dashboard or via API)
-- covers: public read
-- chapter-images: public read
-- chapter-content: authenticated read (or public for free chapters - use public for simplicity)
-- ---------------------------------------------------------------------------
-- insert into storage.buckets (id, name, public) values
--   ('covers', 'covers', true),
--   ('chapter-images', 'chapter-images', true),
--   ('chapter-content', 'chapter-content', true);
