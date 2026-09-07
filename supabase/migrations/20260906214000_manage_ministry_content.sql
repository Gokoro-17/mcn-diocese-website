create table public.ministry_profiles (
  ministry_slug text primary key check (char_length(ministry_slug) between 1 and 100),
  leader_name text not null default '' check (char_length(leader_name) <= 120),
  leader_title text not null default 'President' check (char_length(leader_title) between 1 and 80),
  leader_phone text not null default '' check (char_length(leader_phone) <= 40),
  leader_whatsapp text not null default '' check (char_length(leader_whatsapp) <= 500),
  leader_photo_url text,
  leader_photo_storage_bucket text,
  leader_photo_storage_path text,
  updated_at timestamptz not null default now()
);

create table public.ministry_gallery_items (
  id uuid primary key default gen_random_uuid(),
  ministry_slug text not null references public.ministry_profiles(ministry_slug) on delete cascade,
  title text not null default '' check (char_length(title) <= 160),
  image_url text not null,
  storage_bucket text not null,
  storage_path text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ministry_gallery_published_idx
  on public.ministry_gallery_items (ministry_slug, display_order, created_at desc)
  where is_published = true;

insert into public.ministry_profiles (ministry_slug, leader_name, leader_title, leader_photo_url)
values
  ('childrens-ministry', 'Sis. Mercy Bassey', 'Superintendent', '/images/ministries/sis-mercy-bassey.png'),
  ('youth-fellowship', '', 'President', null),
  ('womens-fellowship', '', 'President', null),
  ('mens-fellowship', '', 'President', null),
  ('ladies-and-girls-fellowship', '', 'President', null),
  ('young-mens-fellowship', '', 'President', null),
  ('worship-ministry', '', 'President', null),
  ('media-unit', '', 'Coordinator', null)
on conflict (ministry_slug) do nothing;

alter table public.ministry_profiles enable row level security;
alter table public.ministry_gallery_items enable row level security;

revoke all on table public.ministry_profiles from anon, authenticated;
revoke all on table public.ministry_gallery_items from anon, authenticated;

grant select on table public.ministry_profiles to anon, authenticated;
grant insert, update, delete on table public.ministry_profiles to authenticated;
grant select on table public.ministry_gallery_items to anon, authenticated;
grant insert, update, delete on table public.ministry_gallery_items to authenticated;

create policy "Ministry profiles are public"
  on public.ministry_profiles for select
  to anon, authenticated
  using (true);

create policy "Admins can create ministry profiles"
  on public.ministry_profiles for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update ministry profiles"
  on public.ministry_profiles for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete ministry profiles"
  on public.ministry_profiles for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Published ministry gallery items are public"
  on public.ministry_gallery_items for select
  to anon, authenticated
  using (is_published = true);

create policy "Admins can view all ministry gallery items"
  on public.ministry_gallery_items for select
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can create ministry gallery items"
  on public.ministry_gallery_items for insert
  to authenticated
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can update ministry gallery items"
  on public.ministry_gallery_items for update
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

create policy "Admins can delete ministry gallery items"
  on public.ministry_gallery_items for delete
  to authenticated
  using (exists (
    select 1 from public.admins where admins.user_id = (select auth.uid())
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ministry-media',
  'ministry-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can list ministry media"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'ministry-media'
    and exists (
      select 1 from public.admins where admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can upload ministry media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'ministry-media'
    and exists (
      select 1 from public.admins where admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can update ministry media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'ministry-media'
    and exists (
      select 1 from public.admins where admins.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'ministry-media'
    and exists (
      select 1 from public.admins where admins.user_id = (select auth.uid())
    )
  );

create policy "Admins can delete ministry media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'ministry-media'
    and exists (
      select 1 from public.admins where admins.user_id = (select auth.uid())
    )
  );
