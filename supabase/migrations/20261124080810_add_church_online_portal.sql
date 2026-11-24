-- A member account never grants content-administrator access.
create table public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  phone text not null default '' check (char_length(phone) <= 40),
  ministry_slug text references public.ministry_profiles(ministry_slug) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 120),
  category text not null default 'General' check (category in ('General', 'Family', 'Health', 'Guidance', 'Thanksgiving')),
  message text not null check (char_length(trim(message)) between 10 and 4000),
  status text not null default 'received' check (status in ('received', 'praying', 'prayed_for')),
  created_at timestamptz not null default now()
);

create index prayer_requests_owner_created_idx on public.prayer_requests (user_id, created_at desc);
create index prayer_requests_status_created_idx on public.prayer_requests (status, created_at desc);

create table public.live_stream_settings (
  id integer primary key default 1 check (id = 1),
  title text not null default 'Worship with us' check (char_length(trim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 1000),
  watch_url text not null default '' check (
    char_length(watch_url) <= 1000 and (watch_url = '' or
    watch_url ~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com|facebook\.com|fb\.watch)/[^[:space:]]+$')
  ),
  status text not null default 'offline' check (status in ('offline', 'scheduled', 'live')),
  scheduled_at timestamptz,
  updated_at timestamptz not null default now(),
  check (status = 'offline' or watch_url <> ''),
  check (status <> 'scheduled' or scheduled_at is not null)
);

insert into public.live_stream_settings (id) values (1);

alter table public.member_profiles enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.live_stream_settings enable row level security;

revoke all on public.member_profiles, public.prayer_requests, public.live_stream_settings from public, anon, authenticated;
grant select, insert, update on public.member_profiles to authenticated;
grant select on public.prayer_requests to authenticated;
-- Members cannot choose a status, timestamp, or prayer-request ID on insert.
grant insert (user_id, name, category, message) on public.prayer_requests to authenticated;
grant update (status) on public.prayer_requests to authenticated;
grant select on public.live_stream_settings to anon, authenticated;
grant update (title, description, watch_url, status, scheduled_at, updated_at) on public.live_stream_settings to authenticated;

create policy "Members can read their own profile" on public.member_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Members can create their own profile" on public.member_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Members can update their own profile" on public.member_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Members can submit their own prayer requests" on public.prayer_requests
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Members can read their own prayer requests" on public.prayer_requests
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Administrators can read prayer requests" on public.prayer_requests
  for select to authenticated using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));
create policy "Administrators can update prayer status" on public.prayer_requests
  for update to authenticated using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Anyone can read live stream settings" on public.live_stream_settings
  for select to anon, authenticated using (true);
create policy "Administrators can update live stream settings" on public.live_stream_settings
  for update to authenticated using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));
