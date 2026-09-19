import { galleryItems, sermons as fallbackSermons, type MinistryPresident } from "../data/churchData";
import type { ChurchEventItem, GalleryMediaItem, LeaderItem, SermonItem, UploadedFile } from "../types/content";
import { isSupabaseConfigured, supabase, supabaseProjectUrl } from "./supabase";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
};

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

async function prepareUploadFile(file: File): Promise<File> {
  const extension = extensionOf(file.name);
  const isHeic = extension === "heic" || extension === "heif" || file.type === "image/heic" || file.type === "image/heif";

  if (isHeic) {
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const jpeg = Array.isArray(converted) ? converted[0] : converted;
    const baseName = file.name.replace(/\.(heic|heif)$/i, "") || "photo";
    return new File([jpeg], `${baseName}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
  }

  const inferredType = MIME_BY_EXTENSION[extension];
  if ((!file.type || file.type === "application/octet-stream") && inferredType) {
    return new File([file], file.name, { type: inferredType, lastModified: file.lastModified });
  }

  if (!file.type || file.type === "application/octet-stream") {
    throw new Error(`“${file.name}” does not have a recognised photo, video, or audio file type.`);
  }

  return file;
}

function friendlyUploadError(error: unknown, file: File) {
  const message = error instanceof Error ? error.message : String(error);
  if (/413|maximum size exceeded|entity too large/i.test(message)) {
    const size = (file.size / (1024 * 1024)).toFixed(1);
    return new Error(`“${file.name}” is ${size} MB and is larger than this Supabase project's current upload limit. Increase the global Storage file size limit, compress the file, or use a YouTube or Facebook link for a large sermon.`);
  }
  if (/mime type|invalidmimetype/i.test(message)) {
    return new Error(`“${file.name}” was recognised as ${file.type || "an unknown type"}, which this media library does not accept.`);
  }
  return error instanceof Error ? error : new Error("The file could not be uploaded.");
}

export function mediaDownloadUrl(url: string, fileName?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.pathname.includes("/storage/v1/object/public/")) {
      const storedFileName = decodeURIComponent(parsed.pathname.split("/").pop() || "download");
      parsed.searchParams.set("download", fileName?.trim() || storedFileName);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function displayDate(value: string | null | undefined) {
  if (!value) return "Date to be announced";
  return DATE_FORMATTER.format(new Date(`${value}T00:00:00`));
}

export async function fetchPublishedSermons(): Promise<SermonItem[]> {
  if (!supabase) return fallbackSermons;

  const { data, error } = await supabase
    .from("sermons")
    .select("id,title,preacher,sermon_date,duration,description,category,thumbnail_url,video_url,audio_url,video_provider,created_at")
    .eq("is_published", true)
    .order("sermon_date", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Could not load published sermons", error);
    return fallbackSermons;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    preacher: row.preacher,
    sermonDate: row.sermon_date,
    date: displayDate(row.sermon_date),
    duration: row.duration ?? "",
    description: row.description ?? "",
    category: row.category,
    thumbnail: row.thumbnail_url,
    videoUrl: row.video_url ?? "",
    audioUrl: row.audio_url ?? "",
    videoProvider: row.video_provider,
    createdAt: row.created_at,
  }));
}

export async function fetchPublishedGallery(): Promise<GalleryMediaItem[]> {
  if (!supabase) {
    return galleryItems.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      mediaType: "image",
      mediaUrl: "",
    }));
  }

  const { data, error } = await supabase
    .from("media_items")
    .select("id,title,category,description,media_type,media_url,thumbnail_url,event_date,created_at")
    .eq("is_published", true)
    .order("event_date", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Could not load published gallery items", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description ?? "",
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    eventDate: row.event_date,
    createdAt: row.created_at,
  }));
}

export async function fetchPublishedLeaders(): Promise<LeaderItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("leaders")
    .select("id,name,position,description,image_url,display_order")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Could not load published leaders", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    position: row.position,
    description: row.description ?? "",
    imageUrl: row.image_url,
    displayOrder: row.display_order,
  }));
}

export async function fetchUpcomingEvents(): Promise<ChurchEventItem[]> {
  if (!supabase) return [];

  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const { data, error } = await supabase
    .from("church_events")
    .select("id,title,description,category,start_date,end_date,start_time,location,image_url,color")
    .eq("is_published", true)
    .or(`start_date.gte.${localToday},end_date.gte.${localToday}`)
    .order("start_date", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Could not load upcoming church events", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    location: row.location ?? "",
    imageUrl: row.image_url,
    color: row.color,
  }));
}

export interface MinistryGalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
}

export interface MinistryContent {
  president?: MinistryPresident;
  photos: MinistryGalleryPhoto[];
}

export async function fetchMinistryContent(
  ministrySlug: string,
): Promise<MinistryContent | null> {
  if (!supabase) return null;

  const [profileResult, galleryResult] = await Promise.all([
    supabase
      .from("ministry_profiles")
      .select("leader_name,leader_title,leader_phone,leader_whatsapp,leader_photo_url")
      .eq("ministry_slug", ministrySlug)
      .maybeSingle(),
    supabase
      .from("ministry_gallery_items")
      .select("id,title,image_url")
      .eq("ministry_slug", ministrySlug)
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error || galleryResult.error) {
    console.error(
      "Could not load ministry content",
      profileResult.error ?? galleryResult.error,
    );
    return null;
  }

  const profile = profileResult.data;
  const leaderName = profile?.leader_name?.trim() ?? "";

  return {
    president: leaderName
      ? {
          name: leaderName,
          title: profile?.leader_title?.trim() || "President",
          phone: profile?.leader_phone?.trim() || null,
          whatsapp: profile?.leader_whatsapp?.trim() || null,
          photo: profile?.leader_photo_url || null,
        }
      : undefined,
    photos: (galleryResult.data ?? []).map((photo) => ({
      id: photo.id,
      title: photo.title ?? "",
      imageUrl: photo.image_url,
    })),
  };
}

function safeFileName(name: string) {
  const extensionIndex = name.lastIndexOf(".");
  const extension = extensionIndex >= 0 ? name.slice(extensionIndex).toLowerCase() : "";
  const base = (extensionIndex >= 0 ? name.slice(0, extensionIndex) : name)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 70);
  return `${base || "media"}${extension}`;
}

export async function uploadMediaFile(
  bucket: "gallery-media" | "sermon-media" | "leadership-media" | "event-media" | "ministry-media",
  folder: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<UploadedFile> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error("Supabase is not configured yet.");
  }

  let uploadFile: File;
  try {
    uploadFile = await prepareUploadFile(file);
  } catch (error) {
    throw friendlyUploadError(error, file);
  }

  const objectPath = `${folder}/${crypto.randomUUID()}-${safeFileName(uploadFile.name)}`;

  try {
    if (uploadFile.size <= 6 * 1024 * 1024) {
      const { error } = await supabase.storage.from(bucket).upload(objectPath, uploadFile, {
        cacheControl: "3600",
        contentType: uploadFile.type,
        upsert: false,
      });
      if (error) throw error;
      onProgress(100);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Your session expired. Please sign in again.");

      const projectId = new URL(supabaseProjectUrl).hostname.split(".")[0];
      const tus = await import("tus-js-client");
      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(uploadFile, {
          endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            "x-upsert": "false",
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucket,
            objectName: objectPath,
            contentType: uploadFile.type,
            cacheControl: "3600",
          },
          chunkSize: 6 * 1024 * 1024,
          onError: reject,
          onProgress: (uploaded, total) => onProgress(Math.round((uploaded / total) * 100)),
          onSuccess: () => resolve(),
        });

        upload.findPreviousUploads().then((uploads) => {
          if (uploads.length > 0) upload.resumeFromPreviousUpload(uploads[0]);
          upload.start();
        }).catch(reject);
      });
    }
  } catch (error) {
    throw friendlyUploadError(error, uploadFile);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return { bucket, path: objectPath, publicUrl: data.publicUrl, contentType: uploadFile.type, fileName: uploadFile.name };
}

export function youtubeVideoId(url: string) {
  try {
    const value = url.trim();
    if (!value) return "";

    const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let id = "";

    if (hostname === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname.endsWith(".youtube.com") || hostname === "youtube-nocookie.com" || hostname.endsWith(".youtube-nocookie.com")) {
      const path = parsed.pathname.split("/").filter(Boolean);
      if (path[0] === "watch") id = parsed.searchParams.get("v") ?? "";
      if (["embed", "shorts", "live", "v"].includes(path[0])) id = path[1] ?? "";
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

export function youtubeEmbedUrl(url: string) {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
}

export function youtubeThumbnailUrl(url: string) {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function facebookVideoUrl(url: string) {
  try {
    const value = url.trim();
    if (!value) return "";

    const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const path = parsed.pathname.split("/").filter(Boolean).map((part) => part.toLowerCase());
    const isFacebookHost = hostname === "facebook.com" || hostname.endsWith(".facebook.com");
    const isFacebookVideoPath = path.includes("videos") || path.includes("video") || path.includes("reel") || path.includes("reels") || path[0] === "watch" || (path[0] === "share" && path[1] === "v");
    const hasVideoQuery = Boolean(parsed.searchParams.get("v") || parsed.searchParams.get("story_fbid"));

    if (hostname === "fb.watch" && path.length > 0) return parsed.toString();
    if (isFacebookHost && (isFacebookVideoPath || hasVideoQuery)) return parsed.toString();
    return "";
  } catch {
    return "";
  }
}

export function facebookEmbedUrl(url: string, autoplay = false) {
  const videoUrl = facebookVideoUrl(url);
  if (!videoUrl) return "";

  const embed = new URL("https://www.facebook.com/plugins/video.php");
  embed.searchParams.set("href", videoUrl);
  embed.searchParams.set("show_text", "false");
  embed.searchParams.set("width", "1280");
  embed.searchParams.set("autoplay", String(autoplay));
  return embed.toString();
}
