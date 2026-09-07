create table public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  position text not null check (char_length(position) between 1 and 120),
  description text not null default '',
  image_url text,
  storage_bucket text,
  storage_path text,
  display_order integer not null default 100 check (display_order >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.church_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  category text not null default 'Church Event' check (char_length(category) between 1 and 80),
  start_date date not null,
  end_date date,
  start_time time,
  location text not null default '',
  image_url text,
  storage_bucket text,
  storage_path text,
  color text not null default '#C8102E' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint church_events_date_order check (end_date is null or end_date >= start_date)
);

create index leaders_published_order_idx
  on public.leaders (display_order, created_at)
  where is_published = true;

create index church_events_published_date_idx
  on public.church_events (start_date, end_date)
  where is_published = true;

alter table public.leaders enable row level security;
alter table public.church_events enable row level security;

revoke all on table public.leaders from anon, authenticated;
revoke all on table public.church_events from anon, authenticated;

grant select on table public.leaders to anon, authenticated;
grant insert, update, delete on table public.leaders to authenticated;
grant select on table public.church_events to anon, authenticated;
grant insert, update, delete on table public.church_events to authenticated;

create policy "Published leaders are public"
  on public.leaders for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can view all leaders"
  on public.leaders for select
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can create leaders"
  on public.leaders for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update leaders"
  on public.leaders for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete leaders"
  on public.leaders for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Published church events are public"
  on public.church_events for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can view all church events"
  on public.church_events for select
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can create church events"
  on public.church_events for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update church events"
  on public.church_events for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete church events"
  on public.church_events for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

insert into storage.buckets (id, name, public, allowed_mime_types)
values
  ('leadership-media', 'leadership-media', true, array['image/jpeg', 'image/png', 'image/webp']),
  ('event-media', 'event-media', true, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can list leadership and event media"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('leadership-media', 'event-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can upload leadership and event media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('leadership-media', 'event-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can update leadership and event media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('leadership-media', 'event-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  )
  with check (
    bucket_id in ('leadership-media', 'event-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can delete leadership and event media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('leadership-media', 'event-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );
