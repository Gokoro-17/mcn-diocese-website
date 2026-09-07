import { useEffect, useRef, useState } from "react";
import { Cross, Download, Maximize2, Minimize2, Play, X } from "lucide-react";
import { facebookEmbedUrl, fetchPublishedSermons, mediaDownloadUrl, youtubeEmbedUrl, youtubeThumbnailUrl } from "../../lib/media";
import type { SermonItem } from "../../types/content";

interface SermonCardProps {
  sermon: SermonItem;
  index: number;
}

function SermonCard({ sermon, index }: SermonCardProps) {
  const [playing, setPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const colors = ["var(--church-red)", "var(--church-navy)", "var(--church-green)", "var(--church-gold)"];
  const color = colors[index % colors.length];
  const youtubeUrl = sermon.videoProvider === "youtube" ? youtubeEmbedUrl(sermon.videoUrl) : "";
  const facebookUrl = sermon.videoProvider === "facebook" ? facebookEmbedUrl(sermon.videoUrl) : "";
  const embedUrl = youtubeUrl || facebookUrl;
  const thumbnailUrl = sermon.thumbnail || (youtubeUrl ? youtubeThumbnailUrl(sermon.videoUrl) : "");
  const hasPlayableVideo = Boolean(sermon.videoUrl && (sermon.videoProvider === "upload" || embedUrl));

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    if (!playerRef.current) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await playerRef.current.requestFullscreen();
    } catch {
      // The embedded and native video controls still provide their own fullscreen button.
    }
  }

  function closePlayer() {
    if (document.fullscreenElement === playerRef.current) void document.exitFullscreen();
    setPlaying(false);
  }

  return (
    <article className="sermon-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div ref={playerRef} className="sermon-player relative flex h-48 items-center justify-center overflow-hidden bg-black" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` }}>
        {playing && hasPlayableVideo ? (
          embedUrl ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={youtubeUrl ? `${youtubeUrl}?autoplay=1&rel=0` : facebookEmbedUrl(sermon.videoUrl, true)}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <video className="absolute inset-0 h-full w-full bg-black object-contain" src={sermon.videoUrl} controls autoPlay playsInline />
          )
        ) : thumbnailUrl ? (
          <><img className="absolute inset-0 h-full w-full object-cover" src={thumbnailUrl} alt={`${sermon.title} video thumbnail`} loading="lazy" /><div className="absolute inset-0 bg-black/25" /></>
        ) : facebookUrl ? (
          <><iframe className="pointer-events-none absolute inset-0 h-full w-full" src={facebookUrl} title={`${sermon.title} Facebook video preview`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" /><div className="absolute inset-0 bg-black/20" /></>
        ) : null}

        {!playing && <div className="absolute left-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">{sermon.category}</div>}
        {!playing && sermon.duration && <div className="absolute right-3 top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">{sermon.duration}</div>}

        {(!playing || !hasPlayableVideo) && (
          <button onClick={() => hasPlayableVideo && setPlaying(true)} className="group relative z-10 text-white" aria-label={hasPlayableVideo ? `Play ${sermon.title}` : `${sermon.title} video coming soon`}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/50 bg-white/20 transition-all group-hover:scale-110 group-hover:bg-white/30">
              <Play className="ml-1" size={25} fill="currentColor" />
            </div>
          </button>
        )}
        {playing && hasPlayableVideo && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-2">
            <button onClick={closePlayer} className="rounded-lg bg-black/70 p-2 text-white backdrop-blur-sm hover:bg-black/90" title="Close video" aria-label={`Close ${sermon.title} video`}><X size={18} /></button>
            <button onClick={() => void toggleFullscreen()} className="rounded-lg bg-black/70 p-2 text-white backdrop-blur-sm hover:bg-black/90" title={isFullscreen ? "Minimize video" : "View video full screen"} aria-label={isFullscreen ? `Minimize ${sermon.title} video` : `View ${sermon.title} full screen`}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
          </div>
        )}
        {!playing && <Cross className="absolute bottom-3 right-3 text-white/20" size={34} strokeWidth={1.4} />}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /><span className="text-xs font-medium text-gray-400">{sermon.date}</span></div>
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold leading-tight" style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}>{sermon.title}</h3>
        <div className="mb-2 text-xs font-semibold" style={{ color }}>{sermon.preacher}</div>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">{sermon.description}</p>

        <div className="flex items-center gap-2">
          <button onClick={() => hasPlayableVideo && (playing ? closePlayer() : setPlaying(true))} className="flex-1 rounded-lg py-2 text-xs font-bold text-white transition-all hover:opacity-90" style={{ background: color }}>
            {!hasPlayableVideo ? "Coming soon" : playing ? "Close player" : <span className="inline-flex items-center gap-1.5"><Play size={14} fill="currentColor" /> Watch</span>}
          </button>
          {sermon.audioUrl && <button onClick={() => setAudioMode(!audioMode)} className="rounded-lg border px-3 py-2 text-xs font-bold" style={{ borderColor: color, color }}>Listen</button>}
          {(sermon.audioUrl || (sermon.videoUrl && !embedUrl)) && <a href={mediaDownloadUrl(sermon.audioUrl || sermon.videoUrl)} download className="rounded-lg border px-3 py-2 text-xs font-bold" style={{ borderColor: "var(--church-navy)", color: "var(--church-navy)" }} title="Download for offline viewing" aria-label={`Download ${sermon.title} for offline viewing`}><Download size={15} /></a>}
        </div>
        {audioMode && sermon.audioUrl && <div className="mt-3 rounded-lg p-3" style={{ background: `${color}12` }}><audio className="w-full" src={sermon.audioUrl} controls autoPlay /></div>}
      </div>
    </article>
  );
}

export default function SermonsSection() {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublishedSermons().then((items) => {
      if (active) {
        setSermons(items);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="py-20 md:py-28" style={{ background: "linear-gradient(180deg, white 0%, var(--church-cream) 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-red)" }}>Words of Life</div><h2 className="section-title text-3xl font-bold md:text-5xl" style={{ color: "var(--church-navy)" }}>Latest Sermons</h2></div>
          <p className="max-w-sm text-sm text-gray-500 md:text-right">Be fed by the Word. Watch, listen, and download our recent sermons anytime, anywhere.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{[...Array(5)].map((_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />)}</div>
        ) : sermons.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{sermons.slice(0, 5).map((sermon, index) => <SermonCard key={sermon.id} sermon={sermon} index={index} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">New sermons will appear here as soon as they are published.</div>
        )}
      </div>
    </section>
  );
}
