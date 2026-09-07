create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  preacher text not null check (char_length(preacher) between 1 and 120),
  sermon_date date not null,
  duration text not null default '',
  description text not null default '',
  category text not null default 'Sunday Service',
  thumbnail_url text,
  thumbnail_storage_bucket text,
  thumbnail_storage_path text,
  video_url text,
  audio_url text,
  video_provider text not null default 'upload' check (video_provider in ('upload', 'youtube')),
  storage_bucket text,
  storage_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  category text not null check (char_length(category) between 1 and 80),
  description text not null default '',
  media_type text not null check (media_type in ('image', 'video')),
  media_url text not null,
  thumbnail_url text,
  thumbnail_storage_bucket text,
  thumbnail_storage_path text,
  event_date date,
  storage_bucket text,
  storage_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sermons_published_date_idx
  on public.sermons (sermon_date desc)
  where is_published = true;

create index media_items_published_date_idx
  on public.media_items (event_date desc nulls last)
  where is_published = true;

alter table public.admins enable row level security;
alter table public.sermons enable row level security;
alter table public.media_items enable row level security;

revoke all on table public.admins from anon, authenticated;
revoke all on table public.sermons from anon, authenticated;
revoke all on table public.media_items from anon, authenticated;

grant select on table public.admins to authenticated;
grant select on table public.sermons to anon, authenticated;
grant insert, update, delete on table public.sermons to authenticated;
grant select on table public.media_items to anon, authenticated;
grant insert, update, delete on table public.media_items to authenticated;

create policy "Admins can view their own access record"
  on public.admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Published sermons are public"
  on public.sermons for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can view all sermons"
  on public.sermons for select
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can create sermons"
  on public.sermons for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update sermons"
  on public.sermons for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete sermons"
  on public.sermons for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Published media is public"
  on public.media_items for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can view all media"
  on public.media_items for select
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can create media"
  on public.media_items for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update media"
  on public.media_items for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete media"
  on public.media_items for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

insert into storage.buckets (id, name, public, allowed_mime_types)
values
  ('gallery-media', 'gallery-media', true, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('sermon-media', 'sermon-media', true, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg'])
on conflict (id) do update set
  public = excluded.public,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can list church media"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('gallery-media', 'sermon-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can upload church media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('gallery-media', 'sermon-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can update church media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('gallery-media', 'sermon-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  )
  with check (
    bucket_id in ('gallery-media', 'sermon-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );

create policy "Admins can delete church media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('gallery-media', 'sermon-media')
    and exists (select 1 from public.admins where admins.user_id = (select auth.uid()))
  );
