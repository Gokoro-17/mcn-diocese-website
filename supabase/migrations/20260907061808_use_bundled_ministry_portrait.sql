update public.ministry_profiles
set leader_photo_url = null,
    updated_at = now()
where ministry_slug = 'childrens-ministry'
  and leader_photo_storage_path is null
  and leader_photo_url = '/images/ministries/sis-mercy-bassey.png';
