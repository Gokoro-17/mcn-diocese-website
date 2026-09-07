import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Church,
  Eye,
  EyeOff,
  FileVideo,
  ImagePlus,
  Loader2,
  LockKeyhole,
  LogOut,
  Music2,
  Trash2,
  UploadCloud,
  UserPlus,
} from "lucide-react";
import mcnLogo from "../../assets/mcn-logo.jpg";
import { ministries } from "../../data/churchData";
import { loadAdminDraftFile, saveAdminDraftFile } from "../../lib/adminDrafts";
import { facebookEmbedUrl, uploadMediaFile, youtubeEmbedUrl } from "../../lib/media";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type Tab = "upload" | "library";
type UploadKind = "gallery" | "sermon" | "leader" | "event" | "ministry";
type ContentTable = "sermons" | "media_items" | "leaders" | "church_events";

interface AdminSermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  category: string;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  thumbnail_storage_bucket: string | null;
  thumbnail_storage_path: string | null;
  is_published: boolean;
}

interface AdminMedia {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  media_url: string;
  storage_bucket: string | null;
  storage_path: string | null;
  is_published: boolean;
}

interface AdminLeader {
  id: string;
  title: string;
  position: string;
  storage_bucket: string | null;
  storage_path: string | null;
  is_published: boolean;
}

interface AdminEvent {
  id: string;
  title: string;
  start_date: string;
  category: string;
  storage_bucket: string | null;
  storage_path: string | null;
  is_published: boolean;
}

interface AdminMinistryProfile {
  ministry_slug: string;
  leader_name: string;
  leader_title: string;
  leader_phone: string;
  leader_whatsapp: string;
  leader_photo_url: string | null;
  leader_photo_storage_bucket: string | null;
  leader_photo_storage_path: string | null;
}

interface AdminMinistryPhoto {
  id: string;
  title: string;
  image_url: string;
  storage_bucket: string;
  storage_path: string;
  is_published: boolean;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10";
const galleryCategories = [
  "Worship Services",
  "Events",
  "Choir",
  "Youth",
  "Community Outreach",
];
const sermonCategories = [
  "Sunday Service",
  "Bible Study",
  "Special Service",
  "Choir Ministration",
  "Doctrine Series",
];
const eventCategories = [
  "Church Event",
  "Worship Service",
  "Conference",
  "Fellowship",
  "Outreach",
  "Celebration",
  "Meeting",
];
const ADMIN_DRAFT_PREFIX = "mcn-admin-draft:";
const ADMIN_TIMEOUT_FLAG = "mcn-admin-session-expired";
const INACTIVITY_TIMEOUT_MS = 5 * 60_000;

function useDraftValue<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `${ADMIN_DRAFT_PREFIX}${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      return saved === null ? initialValue : (JSON.parse(saved) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Draft recovery is best-effort when browser storage is unavailable.
    }
  }, [storageKey, value]);

  return [value, setValue];
}

function useDraftFile(key: string): [File | null, (file: File | null) => void] {
  const [file, setFile] = useState<File | null>(null);
  const changed = useRef(false);

  useEffect(() => {
    let active = true;
    void loadAdminDraftFile(key).then((savedFile) => {
      if (active && !changed.current && savedFile) setFile(savedFile);
    });
    return () => {
      active = false;
    };
  }, [key]);

  const updateFile = useCallback(
    (nextFile: File | null) => {
      changed.current = true;
      setFile(nextFile);
      void saveAdminDraftFile(key, nextFile);
    },
    [key],
  );

  return [file, updateFile];
}

function setAdminBusy(busy: boolean) {
  window.dispatchEvent(
    new CustomEvent<boolean>("mcn-admin-busy", { detail: busy }),
  );
}

function SetupRequired() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <LockKeyhole size={30} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Connect Supabase first
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
          The administration area is ready, but this copy of the website does
          not have a Supabase project URL and publishable key yet.
        </p>
        <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-left font-mono text-xs leading-6 text-slate-200">
          <div>VITE_SUPABASE_URL=https://your-project-ref.supabase.co</div>
          <div>VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key</div>
        </div>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 font-bold text-red-700 hover:text-red-800"
        >
          <ArrowLeft size={18} /> Return to website
        </a>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src={mcnLogo}
            alt="Methodist Church Nigeria"
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow"
          />
          <div>
            <div className="font-bold text-slate-900">Cathedral of Favour</div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
              Content administration
            </div>
          </div>
        </a>
        <a
          href="/"
          className="hidden items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-700 sm:flex"
        >
          <ArrowLeft size={17} /> Public website
        </a>
      </div>
      {children}
    </main>
  );
}

function Login({ onSignedIn }: { onSignedIn: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionNotice] = useState(() => {
    const expired = window.sessionStorage.getItem(ADMIN_TIMEOUT_FLAG) === "1";
    window.sessionStorage.removeItem(ADMIN_TIMEOUT_FLAG);
    return expired
      ? "Your session expired after 5 minutes of inactivity. Sign in again to continue your saved work."
      : "";
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setSubmitting(true);
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password },
    );
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    if (data.user) onSignedIn(data.user);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-xl md:p-10">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <LockKeyhole size={27} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Administrator sign in
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Only approved church administrators can upload or change website
          content.
        </p>
        {sessionNotice && (
          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
            {sessionNotice}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Email address
            </span>
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Password
            </span>
            <div className="relative">
              <input
                className={`${inputClass} pr-12`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <button
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-800 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={19} />
            ) : (
              <LockKeyhole size={18} />
            )}
            {submitting ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

function GalleryUpload({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useDraftValue("gallery-title", "");
  const [category, setCategory] = useDraftValue("gallery-category", "Choir");
  const [description, setDescription] = useDraftValue(
    "gallery-description",
    "",
  );
  const [eventDate, setEventDate] = useDraftValue("gallery-date", "");
  const [file, setFile] = useDraftFile("gallery-file");
  const [published, setPublished] = useDraftValue("gallery-published", true);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !file) return;
    setSaving(true);
    setAdminBusy(true);
    setError("");
    setProgress(0);
    try {
      const uploaded = await uploadMediaFile(
        "gallery-media",
        "gallery",
        file,
        setProgress,
      );
      const { error: insertError } = await supabase.from("media_items").insert({
        title,
        category,
        description,
        event_date: eventDate || null,
        media_type: uploaded.contentType.startsWith("video/") ? "video" : "image",
        media_url: uploaded.publicUrl,
        storage_bucket: uploaded.bucket,
        storage_path: uploaded.path,
        is_published: published,
      });
      if (insertError) {
        await supabase.storage.from(uploaded.bucket).remove([uploaded.path]);
        throw insertError;
      }
      setTitle("");
      setDescription("");
      setEventDate("");
      setFile(null);
      setProgress(0);
      onSaved();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The upload failed.",
      );
    } finally {
      setSaving(false);
      setAdminBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Title
          </span>
          <input
            className={inputClass}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Choir ministration at Sunday service"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Category
          </span>
          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {galleryCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Date
          </span>
          <input
            className={inputClass}
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Description
          </span>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A short description of this moment"
          />
        </label>
      </div>
      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-red-400 hover:bg-red-50/40">
        <ImagePlus className="mx-auto text-red-700" size={35} />
        <span className="mt-3 block font-bold text-slate-800">
          {file ? file.name : "Choose a photo or video"}
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          JPG, PNG, WEBP, HEIC, MP4, WEBM or MOV
        </span>
        <input
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif,video/mp4,video/webm,video/quicktime"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
      <PublishToggle checked={published} onChange={setPublished} />
      {saving && <UploadProgress progress={progress} />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <button
        disabled={saving || !file}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
      >
        <UploadCloud size={19} />
        {saving ? "Uploading…" : "Upload gallery media"}
      </button>
    </form>
  );
}

function SermonUpload({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useDraftValue("sermon-title", "");
  const [preacher, setPreacher] = useDraftValue("sermon-preacher", "");
  const [sermonDate, setSermonDate] = useDraftValue("sermon-date", "");
  const [duration, setDuration] = useDraftValue("sermon-duration", "");
  const [category, setCategory] = useDraftValue(
    "sermon-category",
    "Sunday Service",
  );
  const [description, setDescription] = useDraftValue("sermon-description", "");
  const [source, setSource] = useDraftValue<"file" | "youtube" | "facebook">(
    "sermon-source",
    "file",
  );
  const [youtubeUrl, setYoutubeUrl] = useDraftValue("sermon-youtube", "");
  const [mediaFile, setMediaFile] = useDraftFile("sermon-media-file");
  const [thumbnailFile, setThumbnailFile] = useDraftFile(
    "sermon-thumbnail-file",
  );
  const [published, setPublished] = useDraftValue("sermon-published", true);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setAdminBusy(true);
    setError("");
    setProgress(0);
    const uploadedPaths: Array<{ bucket: string; path: string }> = [];
    try {
      let mediaUrl = youtubeUrl.trim();
      let storageBucket: string | null = null;
      let storagePath: string | null = null;
      let isAudio = false;
      if (source === "file") {
        if (!mediaFile) throw new Error("Choose a sermon video or audio file.");
        const uploaded = await uploadMediaFile(
          "sermon-media",
          mediaFile.type.startsWith("audio/") ? "audio" : "video",
          mediaFile,
          setProgress,
        );
        mediaUrl = uploaded.publicUrl;
        storageBucket = uploaded.bucket;
        storagePath = uploaded.path;
        isAudio = uploaded.contentType.startsWith("audio/");
        uploadedPaths.push(uploaded);
      }
      if (!mediaUrl)
        throw new Error("Add a YouTube or Facebook link, or choose a media file.");
      if (source === "youtube" && !youtubeEmbedUrl(mediaUrl))
        throw new Error("Enter a valid YouTube video link. Watch, Shorts, Live and youtu.be links are supported.");
      if (source === "facebook" && !facebookEmbedUrl(mediaUrl))
        throw new Error("Enter a valid public Facebook video, reel or fb.watch link.");

      let thumbnailUrl: string | null = null;
      let thumbnailStorageBucket: string | null = null;
      let thumbnailStoragePath: string | null = null;
      if (thumbnailFile) {
        const uploadedThumbnail = await uploadMediaFile(
          "sermon-media",
          "thumbnails",
          thumbnailFile,
          () => undefined,
        );
        thumbnailUrl = uploadedThumbnail.publicUrl;
        thumbnailStorageBucket = uploadedThumbnail.bucket;
        thumbnailStoragePath = uploadedThumbnail.path;
        uploadedPaths.push(uploadedThumbnail);
      }

      const { error: insertError } = await supabase.from("sermons").insert({
        title,
        preacher,
        sermon_date: sermonDate,
        duration,
        category,
        description,
        thumbnail_url: thumbnailUrl,
        thumbnail_storage_bucket: thumbnailStorageBucket,
        thumbnail_storage_path: thumbnailStoragePath,
        video_url: isAudio ? null : mediaUrl,
        audio_url: isAudio ? mediaUrl : null,
        video_provider: source === "file" ? "upload" : source,
        storage_bucket: storageBucket,
        storage_path: storagePath,
        is_published: published,
      });
      if (insertError) throw insertError;

      setTitle("");
      setPreacher("");
      setSermonDate("");
      setDuration("");
      setDescription("");
      setYoutubeUrl("");
      setMediaFile(null);
      setThumbnailFile(null);
      setProgress(0);
      onSaved();
    } catch (uploadError) {
      await Promise.all(
        uploadedPaths.map((item) =>
          supabase?.storage.from(item.bucket).remove([item.path]),
        ),
      );
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The sermon could not be saved.",
      );
    } finally {
      setSaving(false);
      setAdminBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Sermon title
          </span>
          <input
            className={inputClass}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Walking in the fullness of God"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Preacher
          </span>
          <input
            className={inputClass}
            required
            value={preacher}
            onChange={(event) => setPreacher(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Date preached
          </span>
          <input
            className={inputClass}
            type="date"
            required
            value={sermonDate}
            onChange={(event) => setSermonDate(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Category
          </span>
          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {sermonCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Duration
          </span>
          <input
            className={inputClass}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="52:14"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Description
          </span>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setSource("file")}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${source === "file" ? "bg-white text-red-700 shadow" : "text-slate-500"}`}
        >
          Upload file
        </button>
        <button
          type="button"
          onClick={() => setSource("youtube")}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${source === "youtube" ? "bg-white text-red-700 shadow" : "text-slate-500"}`}
        >
          YouTube link
        </button>
        <button
          type="button"
          onClick={() => setSource("facebook")}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold ${source === "facebook" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}
        >
          Facebook link
        </button>
      </div>
      {source === "file" ? (
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-7 text-center hover:border-red-400">
          <FileVideo className="mx-auto text-red-700" size={34} />
          <span className="mt-3 block font-bold text-slate-800">
            {mediaFile ? mediaFile.name : "Choose sermon video or audio"}
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            MP4, WEBM, MOV, MP3, M4A, WAV or OGG
          </span>
          <input
            className="hidden"
            type="file"
            accept="video/mp4,video/webm,video/quicktime,audio/mpeg,audio/mp4,audio/wav,audio/ogg"
            onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
          />
        </label>
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            {source === "facebook" ? "Facebook video URL" : "YouTube video URL"}
          </span>
          <input
            className={inputClass}
            type="url"
            required
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder={source === "facebook" ? "https://www.facebook.com/.../videos/..." : "https://www.youtube.com/watch?v=..."}
          />
          {source === "facebook" && <span className="mt-2 block text-xs leading-5 text-slate-500">The Facebook video or reel must be public so visitors can watch it on the website.</span>}
        </label>
      )}
      <label className="block cursor-pointer rounded-xl border border-slate-200 bg-white p-4">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <ImagePlus size={18} />
          {thumbnailFile ? thumbnailFile.name : "Choose an optional thumbnail (JPG, PNG, WEBP or HEIC)"}
        </span>
        <input
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={(event) =>
            setThumbnailFile(event.target.files?.[0] ?? null)
          }
        />
      </label>
      <PublishToggle checked={published} onChange={setPublished} />
      {saving && source === "file" && <UploadProgress progress={progress} />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <button
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
      >
        <UploadCloud size={19} />
        {saving ? "Saving sermon…" : "Publish sermon"}
      </button>
    </form>
  );
}

function LeaderUpload({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useDraftValue("leader-name", "");
  const [position, setPosition] = useDraftValue("leader-position", "");
  const [description, setDescription] = useDraftValue("leader-description", "");
  const [displayOrder, setDisplayOrder] = useDraftValue("leader-order", "10");
  const [photo, setPhoto] = useDraftFile("leader-photo");
  const [published, setPublished] = useDraftValue("leader-published", true);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !photo) return;
    setSaving(true);
    setAdminBusy(true);
    setError("");
    setProgress(0);
    let uploaded: Awaited<ReturnType<typeof uploadMediaFile>> | null = null;
    try {
      uploaded = await uploadMediaFile(
        "leadership-media",
        "leaders",
        photo,
        setProgress,
      );
      const { error: insertError } = await supabase.from("leaders").insert({
        name,
        position,
        description,
        image_url: uploaded.publicUrl,
        storage_bucket: uploaded.bucket,
        storage_path: uploaded.path,
        display_order: Number(displayOrder),
        is_published: published,
      });
      if (insertError) throw insertError;
      setName("");
      setPosition("");
      setDescription("");
      setDisplayOrder("10");
      setPhoto(null);
      setProgress(0);
      onSaved();
    } catch (uploadError) {
      if (uploaded)
        await supabase.storage.from(uploaded.bucket).remove([uploaded.path]);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The leader could not be saved.",
      );
    } finally {
      setSaving(false);
      setAdminBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <strong>Ordering:</strong> use 1 for the lead minister, then 2, 3, 4 and
        so on for the remaining leaders.
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Full name
          </span>
          <input
            className={inputClass}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Position
          </span>
          <input
            className={inputClass}
            required
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            placeholder="Cathedral Minister"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Display order
          </span>
          <input
            className={inputClass}
            type="number"
            min="0"
            required
            value={displayOrder}
            onChange={(event) => setDisplayOrder(event.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Short biography
          </span>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-red-400">
        <UserPlus className="mx-auto text-red-700" size={35} />
        <span className="mt-3 block font-bold text-slate-800">
          {photo ? photo.name : "Choose the leader's portrait"}
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          JPG, PNG, WEBP or HEIC
        </span>
        <input
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
      </label>
      <PublishToggle checked={published} onChange={setPublished} />
      {saving && <UploadProgress progress={progress} />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <button
        disabled={saving || !photo}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
      >
        <UploadCloud size={19} />
        {saving ? "Saving leader…" : "Publish leader profile"}
      </button>
    </form>
  );
}

function EventUpload({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useDraftValue("event-title", "");
  const [category, setCategory] = useDraftValue(
    "event-category",
    "Church Event",
  );
  const [startDate, setStartDate] = useDraftValue("event-start-date", "");
  const [endDate, setEndDate] = useDraftValue("event-end-date", "");
  const [startTime, setStartTime] = useDraftValue("event-start-time", "");
  const [location, setLocation] = useDraftValue("event-location", "");
  const [description, setDescription] = useDraftValue("event-description", "");
  const [color, setColor] = useDraftValue("event-color", "#C8102E");
  const [poster, setPoster] = useDraftFile("event-poster");
  const [published, setPublished] = useDraftValue("event-published", true);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setAdminBusy(true);
    setError("");
    setProgress(0);
    let uploaded: Awaited<ReturnType<typeof uploadMediaFile>> | null = null;
    try {
      if (endDate && endDate < startDate)
        throw new Error("The end date cannot be before the start date.");
      if (poster)
        uploaded = await uploadMediaFile(
          "event-media",
          "posters",
          poster,
          setProgress,
        );
      const { error: insertError } = await supabase
        .from("church_events")
        .insert({
          title,
          category,
          start_date: startDate,
          end_date: endDate || null,
          start_time: startTime || null,
          location,
          description,
          color,
          image_url: uploaded?.publicUrl ?? null,
          storage_bucket: uploaded?.bucket ?? null,
          storage_path: uploaded?.path ?? null,
          is_published: published,
        });
      if (insertError) throw insertError;
      setTitle("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setLocation("");
      setDescription("");
      setPoster(null);
      setProgress(0);
      onSaved();
    } catch (uploadError) {
      if (uploaded)
        await supabase.storage.from(uploaded.bucket).remove([uploaded.path]);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The event could not be saved.",
      );
    } finally {
      setSaving(false);
      setAdminBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
        You can enter a whole year, or several years, of events now. The website
        automatically shows the next events and hides completed ones.
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Event title
          </span>
          <input
            className={inputClass}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Category
          </span>
          <select
            className={inputClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {eventCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Accent colour
          </span>
          <input
            className={`${inputClass} h-[46px] p-1`}
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Start date
          </span>
          <input
            className={inputClass}
            type="date"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            End date (optional)
          </span>
          <input
            className={inputClass}
            type="date"
            min={startDate || undefined}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Start time (optional)
          </span>
          <input
            className={inputClass}
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Location
          </span>
          <input
            className={inputClass}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Main Cathedral"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700">
            Description
          </span>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      <label className="block cursor-pointer rounded-xl border border-slate-200 bg-white p-4">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <ImagePlus size={18} />
          {poster ? poster.name : "Choose an optional event poster (JPG, PNG, WEBP or HEIC)"}
        </span>
        <input
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={(event) => setPoster(event.target.files?.[0] ?? null)}
        />
      </label>
      <PublishToggle checked={published} onChange={setPublished} />
      {saving && poster && <UploadProgress progress={progress} />}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      <button
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
      >
        <CalendarPlus size={19} />
        {saving ? "Saving event…" : "Publish calendar event"}
      </button>
    </form>
  );
}

function MinistryManager() {
  const [selectedSlug, setSelectedSlug] = useState(ministries[0].slug);
  const [leaderName, setLeaderName] = useState("");
  const [leaderTitle, setLeaderTitle] = useState("President");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderWhatsapp, setLeaderWhatsapp] = useState("");
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [currentPortraitUrl, setCurrentPortraitUrl] = useState("");
  const [persistedPortraitUrl, setPersistedPortraitUrl] = useState("");
  const [currentPortraitBucket, setCurrentPortraitBucket] = useState("");
  const [currentPortraitPath, setCurrentPortraitPath] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [gallery, setGallery] = useState<AdminMinistryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [workingPhotoId, setWorkingPhotoId] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMinistry = useCallback(async (slug: string) => {
    if (!supabase) return;
    setLoading(true);
    setError("");

    const [profileResult, galleryResult] = await Promise.all([
      supabase
        .from("ministry_profiles")
        .select("ministry_slug,leader_name,leader_title,leader_phone,leader_whatsapp,leader_photo_url,leader_photo_storage_bucket,leader_photo_storage_path")
        .eq("ministry_slug", slug)
        .maybeSingle(),
      supabase
        .from("ministry_gallery_items")
        .select("id,title,image_url,storage_bucket,storage_path,is_published")
        .eq("ministry_slug", slug)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    const loadError = profileResult.error ?? galleryResult.error;
    if (loadError) {
      setError(loadError.message);
      setLoading(false);
      return;
    }

    const fallback = ministries.find((ministry) => ministry.slug === slug);
    const profile = profileResult.data as AdminMinistryProfile | null;
    setLeaderName(profile?.leader_name || fallback?.president?.name || "");
    setLeaderTitle(profile?.leader_title || fallback?.president?.title || "President");
    setLeaderPhone(profile?.leader_phone || fallback?.president?.phone || "");
    setLeaderWhatsapp(profile?.leader_whatsapp || fallback?.president?.whatsapp || "");
    setPersistedPortraitUrl(profile?.leader_photo_url || "");
    setCurrentPortraitUrl(profile?.leader_photo_url || fallback?.president?.photo || "");
    setCurrentPortraitBucket(profile?.leader_photo_storage_bucket || "");
    setCurrentPortraitPath(profile?.leader_photo_storage_path || "");
    setPortraitFile(null);
    setGalleryFiles([]);
    setGallery((galleryResult.data ?? []) as AdminMinistryPhoto[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadMinistry(selectedSlug));
  }, [loadMinistry, selectedSlug]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setSavingProfile(true);
    setError("");
    setNotice("");
    setProgress(0);
    setAdminBusy(true);
    let uploaded: Awaited<ReturnType<typeof uploadMediaFile>> | null = null;

    try {
      if (portraitFile) {
        uploaded = await uploadMediaFile(
          "ministry-media",
          `${selectedSlug}/leader`,
          portraitFile,
          setProgress,
        );
      }

      const nextPortraitUrl = uploaded?.publicUrl ?? (persistedPortraitUrl || null);
      const nextPortraitBucket = uploaded?.bucket ?? (currentPortraitBucket || null);
      const nextPortraitPath = uploaded?.path ?? (currentPortraitPath || null);
      const { error: saveError } = await supabase
        .from("ministry_profiles")
        .upsert(
          {
            ministry_slug: selectedSlug,
            leader_name: leaderName.trim(),
            leader_title: leaderTitle.trim() || "President",
            leader_phone: leaderPhone.trim(),
            leader_whatsapp: leaderWhatsapp.trim(),
            leader_photo_url: nextPortraitUrl,
            leader_photo_storage_bucket: nextPortraitBucket,
            leader_photo_storage_path: nextPortraitPath,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "ministry_slug" },
        );

      if (saveError) {
        if (uploaded) await supabase.storage.from(uploaded.bucket).remove([uploaded.path]);
        throw saveError;
      }

      if (
        uploaded &&
        currentPortraitBucket &&
        currentPortraitPath &&
        currentPortraitPath !== uploaded.path
      ) {
        await supabase.storage
          .from(currentPortraitBucket)
          .remove([currentPortraitPath]);
      }

      setNotice("The ministry leader profile was saved.");
      setProgress(0);
      await loadMinistry(selectedSlug);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "The leader profile could not be saved.");
    } finally {
      setSavingProfile(false);
      setAdminBusy(false);
    }
  }

  async function uploadGallery(event: FormEvent) {
    event.preventDefault();
    if (!supabase || galleryFiles.length === 0) return;
    setUploadingGallery(true);
    setError("");
    setNotice("");
    setProgress(0);
    setAdminBusy(true);
    const uploadedFiles: Awaited<ReturnType<typeof uploadMediaFile>>[] = [];

    try {
      for (let index = 0; index < galleryFiles.length; index += 1) {
        const file = galleryFiles[index];
        const uploaded = await uploadMediaFile(
          "ministry-media",
          `${selectedSlug}/gallery`,
          file,
          (fileProgress) =>
            setProgress(
              Math.round(((index + fileProgress / 100) / galleryFiles.length) * 100),
            ),
        );
        uploadedFiles.push(uploaded);
      }

      const { error: insertError } = await supabase
        .from("ministry_gallery_items")
        .insert(
          uploadedFiles.map((uploaded, index) => ({
            ministry_slug: selectedSlug,
            title: uploaded.fileName
              .replace(/\.[^.]+$/, "")
              .replace(/[_-]+/g, " ")
              .trim(),
            image_url: uploaded.publicUrl,
            storage_bucket: uploaded.bucket,
            storage_path: uploaded.path,
            display_order: gallery.length + index,
            is_published: true,
          })),
        );

      if (insertError) throw insertError;

      setGalleryFiles([]);
      setProgress(0);
      setNotice(
        `${uploadedFiles.length} ${uploadedFiles.length === 1 ? "photo was" : "photos were"} added to the ministry gallery.`,
      );
      await loadMinistry(selectedSlug);
    } catch (uploadError) {
      if (uploadedFiles.length > 0) {
        await supabase.storage
          .from("ministry-media")
          .remove(uploadedFiles.map((uploaded) => uploaded.path));
      }
      setError(uploadError instanceof Error ? uploadError.message : "The ministry photos could not be uploaded.");
    } finally {
      setUploadingGallery(false);
      setAdminBusy(false);
    }
  }

  async function togglePhoto(photo: AdminMinistryPhoto) {
    if (!supabase) return;
    setWorkingPhotoId(photo.id);
    const { error: updateError } = await supabase
      .from("ministry_gallery_items")
      .update({ is_published: !photo.is_published, updated_at: new Date().toISOString() })
      .eq("id", photo.id);
    setWorkingPhotoId("");
    if (updateError) setError(updateError.message);
    else await loadMinistry(selectedSlug);
  }

  async function removePhoto(photo: AdminMinistryPhoto) {
    if (!supabase || !window.confirm(`Remove "${photo.title || "this photo"}" from the ministry gallery?`)) return;
    setWorkingPhotoId(photo.id);
    const { error: deleteError } = await supabase
      .from("ministry_gallery_items")
      .delete()
      .eq("id", photo.id);
    if (deleteError) {
      setWorkingPhotoId("");
      setError(deleteError.message);
      return;
    }
    const { error: storageError } = await supabase.storage
      .from(photo.storage_bucket)
      .remove([photo.storage_path]);
    setWorkingPhotoId("");
    await loadMinistry(selectedSlug);
    if (storageError) setError(`The record was removed, but its stored file could not be deleted: ${storageError.message}`);
    else setNotice("The ministry photo was removed.");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-green-50 p-5 text-sm leading-6 text-green-900">
        Choose a ministry to update its leader and gallery. Changes appear on the public ministry page without a GitHub update.
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Ministry</span>
        <select
          className={inputClass}
          value={selectedSlug}
          onChange={(event) => {
            setSelectedSlug(event.target.value);
            setNotice("");
          }}
        >
          {ministries.map((ministry) => (
            <option key={ministry.slug} value={ministry.slug}>{ministry.name}</option>
          ))}
        </select>
      </label>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-12 font-bold text-slate-500">
          <Loader2 className="animate-spin" /> Loading ministry content
        </div>
      ) : (
        <>
          {notice && <div className="rounded-xl bg-green-100 px-4 py-3 text-sm font-bold text-green-800">{notice}</div>}
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

          <form onSubmit={saveProfile} className="space-y-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ministry leader</h2>
              <p className="mt-1 text-sm text-slate-500">Update the leader's name, church title, portrait, and contact details.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Name</span>
                <input className={inputClass} required value={leaderName} onChange={(event) => setLeaderName(event.target.value)} placeholder="Sis. Mercy Bassey" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Church title</span>
                <input className={inputClass} required value={leaderTitle} onChange={(event) => setLeaderTitle(event.target.value)} placeholder="Superintendent" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Phone number</span>
                <input className={inputClass} value={leaderPhone} onChange={(event) => setLeaderPhone(event.target.value)} placeholder="Optional" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">WhatsApp number or link</span>
                <input className={inputClass} value={leaderWhatsapp} onChange={(event) => setLeaderWhatsapp(event.target.value)} placeholder="Optional" />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-[12rem_1fr] md:items-center">
              <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {currentPortraitUrl ? <img src={currentPortraitUrl} alt={leaderName || "Current ministry leader"} className="h-full w-full object-cover" /> : <UserPlus size={48} className="text-slate-300" />}
              </div>
              <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-7 text-center transition hover:border-green-500">
                <UserPlus className="mx-auto text-green-700" size={32} />
                <span className="mt-3 block font-bold text-slate-800">{portraitFile ? portraitFile.name : "Choose a new leader portrait"}</span>
                <span className="mt-1 block text-xs text-slate-500">JPG, PNG, WEBP or HEIC</span>
                <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={(event) => setPortraitFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>
            {savingProfile && portraitFile && <UploadProgress progress={progress} />}
            <button disabled={savingProfile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50">
              {savingProfile ? <Loader2 className="animate-spin" size={19} /> : <UserPlus size={19} />}
              {savingProfile ? "Saving leader profile" : "Save leader profile"}
            </button>
          </form>

          <form onSubmit={uploadGallery} className="space-y-5 rounded-2xl border border-slate-200 p-5 md:p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ministry gallery</h2>
              <p className="mt-1 text-sm text-slate-500">Select one or several activity photos. They will appear only on this ministry's page.</p>
            </div>
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-red-400">
              <ImagePlus className="mx-auto text-red-700" size={35} />
              <span className="mt-3 block font-bold text-slate-800">{galleryFiles.length ? `${galleryFiles.length} ${galleryFiles.length === 1 ? "photo" : "photos"} selected` : "Choose ministry photos"}</span>
              <span className="mt-1 block text-xs text-slate-500">JPG, PNG, WEBP or HEIC</span>
              <input className="hidden" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))} />
            </label>
            {uploadingGallery && <UploadProgress progress={progress} />}
            <button disabled={uploadingGallery || galleryFiles.length === 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50">
              {uploadingGallery ? <Loader2 className="animate-spin" size={19} /> : <UploadCloud size={19} />}
              {uploadingGallery ? "Uploading ministry photos" : "Add photos to ministry gallery"}
            </button>

            {gallery.length > 0 && (
              <div className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((photo) => (
                  <article key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img src={photo.image_url} alt={photo.title || "Ministry activity"} className="h-40 w-full object-cover" loading="lazy" />
                    <div className="p-3">
                      <p className="truncate text-sm font-bold text-slate-800">{photo.title || "Ministry activity"}</p>
                      <p className={`mt-1 text-xs font-semibold ${photo.is_published ? "text-green-700" : "text-amber-700"}`}>{photo.is_published ? "Visible on website" : "Hidden from website"}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" disabled={workingPhotoId === photo.id} onClick={() => void togglePhoto(photo)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold text-slate-600">
                          {photo.is_published ? <EyeOff size={14} /> : <Eye size={14} />} {photo.is_published ? "Hide" : "Show"}
                        </button>
                        <button type="button" disabled={workingPhotoId === photo.id} onClick={() => void removePhoto(photo)} className="rounded-lg border border-red-200 p-2 text-red-700" aria-label={`Remove ${photo.title || "ministry photo"}`}>
                          {workingPhotoId === photo.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}

function PublishToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-green-50 px-4 py-3">
      <span>
        <strong className="block text-sm text-green-900">
          Publish immediately
        </strong>
        <span className="text-xs text-green-700">
          Turn this off to save it as a draft.
        </span>
      </span>
      <input
        type="checkbox"
        className="h-5 w-5 accent-green-700"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
        <span>Uploading securely</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Library({
  sermons,
  media,
  leaders,
  events,
  onChanged,
}: {
  sermons: AdminSermon[];
  media: AdminMedia[];
  leaders: AdminLeader[];
  events: AdminEvent[];
  onChanged: () => void;
}) {
  const [workingId, setWorkingId] = useState("");

  async function toggle(table: ContentTable, id: string, value: boolean) {
    if (!supabase) return;
    setWorkingId(id);
    const { error } = await supabase
      .from(table)
      .update({ is_published: !value, updated_at: new Date().toISOString() })
      .eq("id", id);
    setWorkingId("");
    if (error) window.alert(error.message);
    else onChanged();
  }

  async function remove(
    table: ContentTable,
    item: AdminSermon | AdminMedia | AdminLeader | AdminEvent,
  ) {
    if (
      !supabase ||
      !window.confirm(`Delete “${item.title}”? This cannot be undone.`)
    )
      return;
    setWorkingId(item.id);
    const stored = [[item.storage_bucket, item.storage_path]];
    if ("thumbnail_storage_bucket" in item)
      stored.push([item.thumbnail_storage_bucket, item.thumbnail_storage_path]);
    for (const [bucket, path] of stored) {
      if (bucket && path) {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) {
          setWorkingId("");
          window.alert(
            `The stored file could not be deleted: ${error.message}`,
          );
          return;
        }
      }
    }
    const { error } = await supabase.from(table).delete().eq("id", item.id);
    setWorkingId("");
    if (error) window.alert(error.message);
    else onChanged();
  }

  const rows = [
    ...sermons.map((item) => ({
      table: "sermons" as const,
      item,
      kind: "Sermon",
      subtitle: `${item.preacher} · ${item.category}`,
    })),
    ...media.map((item) => ({
      table: "media_items" as const,
      item,
      kind: item.media_type === "video" ? "Video" : "Photo",
      subtitle: item.category,
    })),
    ...leaders.map((item) => ({
      table: "leaders" as const,
      item,
      kind: "Leader",
      subtitle: item.position,
    })),
    ...events.map((item) => ({
      table: "church_events" as const,
      item,
      kind: "Event",
      subtitle: `${item.start_date} · ${item.category}`,
    })),
  ];

  if (rows.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        <UploadCloud className="mx-auto mb-3" size={34} />
        <p className="font-bold">No content yet</p>
        <p className="mt-1 text-sm">
          Your sermons, media, leaders, and events will appear here.
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {rows.map(({ table, item, kind, subtitle }) => (
        <article
          key={`${table}-${item.id}`}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            {kind === "Photo" ? (
              <ImagePlus size={22} />
            ) : kind === "Video" ? (
              <FileVideo size={22} />
            ) : kind === "Leader" ? (
              <UserPlus size={22} />
            ) : kind === "Event" ? (
              <CalendarPlus size={22} />
            ) : (
              <Music2 size={22} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-bold text-slate-900">
                {item.title}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${item.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
              >
                {item.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {kind} · {subtitle}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              disabled={workingId === item.id}
              onClick={() => toggle(table, item.id, item.is_published)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {item.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
              {item.is_published ? "Unpublish" : "Publish"}
            </button>
            <button
              disabled={workingId === item.id}
              onClick={() => remove(table, item)}
              className="rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50"
              aria-label={`Delete ${item.title}`}
            >
              {workingId === item.id ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <Trash2 size={17} />
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useDraftValue<Tab>("active-tab", "upload");
  const [kind, setKind] = useDraftValue<UploadKind>("upload-kind", "gallery");
  const [sermons, setSermons] = useState<AdminSermon[]>([]);
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [leaders, setLeaders] = useState<AdminLeader[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const loadLibrary = useCallback(async () => {
    if (!supabase) return;
    const [sermonResult, mediaResult, leaderResult, eventResult] =
      await Promise.all([
        supabase
          .from("sermons")
          .select(
            "id,title,preacher,sermon_date,category,video_url,audio_url,thumbnail_url,storage_bucket,storage_path,thumbnail_storage_bucket,thumbnail_storage_path,is_published",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("media_items")
          .select(
            "id,title,category,media_type,media_url,storage_bucket,storage_path,is_published",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("leaders")
          .select("id,name,position,storage_bucket,storage_path,is_published")
          .order("display_order", { ascending: true }),
        supabase
          .from("church_events")
          .select(
            "id,title,start_date,category,storage_bucket,storage_path,is_published",
          )
          .order("start_date", { ascending: true }),
      ]);
    const loadError =
      sermonResult.error ??
      mediaResult.error ??
      leaderResult.error ??
      eventResult.error;
    if (loadError) window.alert(loadError.message);
    setSermons((sermonResult.data ?? []) as AdminSermon[]);
    setMedia((mediaResult.data ?? []) as AdminMedia[]);
    setLeaders(
      (leaderResult.data ?? []).map((item) => ({
        ...item,
        title: item.name,
      })) as AdminLeader[],
    );
    setEvents((eventResult.data ?? []) as AdminEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Load the remote library snapshot when the authenticated dashboard opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    let timeoutId = 0;
    let busy = false;

    const expireSession = async () => {
      if (busy) return;
      window.sessionStorage.setItem(ADMIN_TIMEOUT_FLAG, "1");
      await supabase?.auth.signOut({ scope: "local" });
      window.location.reload();
    };

    const resetTimeout = () => {
      window.clearTimeout(timeoutId);
      if (!busy)
        timeoutId = window.setTimeout(
          () => void expireSession(),
          INACTIVITY_TIMEOUT_MS,
        );
    };

    const handleBusy = (event: Event) => {
      busy = (event as CustomEvent<boolean>).detail;
      resetTimeout();
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "input",
      "scroll",
      "touchstart",
    ];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, resetTimeout, { passive: true }),
    );
    window.addEventListener("mcn-admin-busy", handleBusy);
    resetTimeout();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, resetTimeout),
      );
      window.removeEventListener("mcn-admin-busy", handleBusy);
    };
  }, []);

  function handleSaved() {
    setNotice("Your content was saved successfully.");
    setTab("library");
    void loadLibrary();
    window.setTimeout(() => setNotice(""), 5000);
  }

  async function signOut() {
    await supabase?.auth.signOut({ scope: "local" });
    window.location.reload();
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              <Church size={16} /> Content control room
            </div>
            <h1 className="mt-2 text-3xl font-bold">Cathedral Content</h1>
            <p className="mt-2 text-sm text-slate-400">
              Signed in as {user.email}
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
              For security, this session closes after 5 minutes without activity.
              Unfinished form details and selected files are saved in this
              browser and restored after you sign in again.
            </p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
        {notice && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-100 px-5 py-4 font-bold text-green-800">
            <CheckCircle2 size={20} />
            {notice}
          </div>
        )}
        <div className="mb-6 flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${tab === "upload" ? "bg-red-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Add content
          </button>
          <button
            onClick={() => setTab("library")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold ${tab === "library" ? "bg-red-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            Manage content (
            {sermons.length + media.length + leaders.length + events.length})
          </button>
        </div>

        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-8">
          {tab === "upload" ? (
            <>
              <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
                <button
                  onClick={() => setKind("gallery")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${kind === "gallery" ? "border-red-700 bg-red-50" : "border-slate-200"}`}
                >
                  <ImagePlus
                    className={
                      kind === "gallery" ? "text-red-700" : "text-slate-400"
                    }
                  />
                  <strong className="mt-3 block text-slate-900">
                    Gallery media
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Photos and choir/event videos
                  </span>
                </button>
                <button
                  onClick={() => setKind("sermon")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${kind === "sermon" ? "border-red-700 bg-red-50" : "border-slate-200"}`}
                >
                  <Music2
                    className={
                      kind === "sermon" ? "text-red-700" : "text-slate-400"
                    }
                  />
                  <strong className="mt-3 block text-slate-900">Sermon</strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Video, audio, YouTube or Facebook
                  </span>
                </button>
                <button
                  onClick={() => setKind("leader")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${kind === "leader" ? "border-red-700 bg-red-50" : "border-slate-200"}`}
                >
                  <UserPlus
                    className={
                      kind === "leader" ? "text-red-700" : "text-slate-400"
                    }
                  />
                  <strong className="mt-3 block text-slate-900">Leader</strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Portrait and leadership profile
                  </span>
                </button>
                <button
                  onClick={() => setKind("event")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${kind === "event" ? "border-red-700 bg-red-50" : "border-slate-200"}`}
                >
                  <CalendarPlus
                    className={
                      kind === "event" ? "text-red-700" : "text-slate-400"
                    }
                  />
                  <strong className="mt-3 block text-slate-900">
                    Calendar event
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Dates, venue and optional poster
                  </span>
                </button>
                <button
                  onClick={() => setKind("ministry")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${kind === "ministry" ? "border-green-700 bg-green-50" : "border-slate-200"}`}
                >
                  <Church
                    className={
                      kind === "ministry" ? "text-green-700" : "text-slate-400"
                    }
                  />
                  <strong className="mt-3 block text-slate-900">
                    Ministries
                  </strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Leaders and ministry galleries
                  </span>
                </button>
              </div>
              {kind === "gallery" ? (
                <GalleryUpload onSaved={handleSaved} />
              ) : kind === "sermon" ? (
                <SermonUpload onSaved={handleSaved} />
              ) : kind === "leader" ? (
                <LeaderUpload onSaved={handleSaved} />
              ) : kind === "event" ? (
                <EventUpload onSaved={handleSaved} />
              ) : (
                <MinistryManager />
              )}
            </>
          ) : loading ? (
            <div className="flex items-center justify-center gap-3 py-16 font-bold text-slate-500">
              <Loader2 className="animate-spin" /> Loading content…
            </div>
          ) : (
            <Library
              sermons={sermons}
              media={media}
              leaders={leaders}
              events={events}
              onChanged={loadLibrary}
            />
          )}
        </section>
      </div>
    </AdminShell>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "loading" | "anonymous" | "checking" | "denied" | "granted"
  >("loading");

  const checkAccess = useCallback(async (candidate: User) => {
    if (!supabase) return;
    setUser(candidate);
    setStatus("checking");
    const { data, error } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", candidate.id)
      .maybeSingle();
    setStatus(!error && data ? "granted" : "denied");
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) void checkAccess(data.user);
      else setStatus("anonymous");
    });
  }, [checkAccess]);

  if (!isSupabaseConfigured) return <SetupRequired />;
  if (status === "loading" || status === "checking")
    return (
      <AdminShell>
        <div className="flex min-h-[60vh] items-center justify-center gap-3 font-bold text-slate-600">
          <Loader2 className="animate-spin text-red-700" /> Checking
          administrator access…
        </div>
      </AdminShell>
    );
  if (status === "anonymous" || !user)
    return <Login onSignedIn={checkAccess} />;
  if (status === "denied")
    return (
      <AdminShell>
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
          <LockKeyhole className="mx-auto text-red-700" size={40} />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Administrator approval required
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            The account <strong>{user.email}</strong> is signed in, but it is
            not listed as a media administrator.
          </p>
          <button
            onClick={() =>
              supabase?.auth
                .signOut({ scope: "local" })
                .then(() => window.location.reload())
            }
            className="mt-7 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Sign out
          </button>
        </div>
      </AdminShell>
    );
  return <Dashboard user={user} />;
}
