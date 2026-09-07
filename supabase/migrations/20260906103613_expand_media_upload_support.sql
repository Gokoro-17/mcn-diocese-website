-- Keep bucket MIME restrictions explicit while allowing photos captured by
-- modern iPhones. HEIC/HEIF files are converted to JPEG in the browser before
-- upload so they remain viewable on browsers that cannot render HEIC directly.
update storage.buckets
set
  file_size_limit = null,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
where id = 'gallery-media';

update storage.buckets
set
  file_size_limit = null,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/ogg'
  ]
where id = 'sermon-media';

update storage.buckets
set
  file_size_limit = null,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
where id in ('leadership-media', 'event-media');
