alter table public.sermons
  drop constraint if exists sermons_video_provider_check;

alter table public.sermons
  add constraint sermons_video_provider_check
  check (video_provider in ('upload', 'youtube', 'facebook'));
