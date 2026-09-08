import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Play } from "lucide-react";
import FullscreenMediaViewer from "../media/FullscreenMediaViewer";
import { galleryCategories } from "../../data/churchData";
import { fetchPublishedGallery } from "../../lib/media";
import type { GalleryMediaItem } from "../../types/content";

const galleryColors = [
  "var(--church-red)", "var(--church-navy)", "var(--church-green)",
  "var(--church-gold)", "var(--church-red-dark)", "var(--church-navy-light)",
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublishedGallery().then((result) => {
      if (active) {
        setItems(result);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => {
    const uploadedCategories = items.map((item) => item.category);
    return Array.from(new Set([...galleryCategories, ...uploadedCategories]));
  }, [items]);
  const filtered = activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);
  const videoCount = items.filter((item) => item.mediaType === "video").length;

  return (
    <div>
      <section className="relative overflow-hidden py-24 text-white md:py-32" style={{ background: "linear-gradient(160deg, var(--church-green) 0%, var(--church-navy) 100%)" }}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">{[...Array(8)].map((_, index) => <ImageIcon key={index} className="absolute text-white/5" size={72} style={{ top: `${10 + index * 10}%`, left: `${index * 13}%`, transform: `rotate(${index * 20}deg)` }} />)}</div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-gold-light)" }}>Moments of Faith</div>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl" style={{ fontFamily: "Playfair Display, serif" }}>Gallery</h1>
          <p className="mx-auto max-w-xl leading-relaxed text-white/70">A glimpse into worship and community at the Methodist Cathedral of Favour, captured in moments that speak of God&apos;s faithfulness.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 60L720 0L1440 60H0Z" fill="var(--church-cream)" /></svg></div>
      </section>

      <section className="py-20 md:py-24" style={{ background: "var(--church-cream)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105" style={{ background: activeCategory === category ? "var(--church-navy)" : "white", color: activeCategory === category ? "white" : "var(--church-navy)", border: "1.5px solid var(--church-navy)", boxShadow: activeCategory === category ? "0 4px 16px rgba(27,42,107,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" }}>{category}</button>
            ))}
          </div>

          {loading ? (
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">{[...Array(12)].map((_, index) => <div key={index} className="mb-4 h-48 animate-pulse break-inside-avoid rounded-xl bg-white" />)}</div>
          ) : filtered.length > 0 ? (
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">
              {filtered.map((item, index) => {
                const color = galleryColors[index % galleryColors.length];
                const isLarge = index % 7 === 0;
                return (
                  <button key={item.id} type="button" aria-label={`${item.mediaType === "video" ? "Play" : "View"} ${item.title} in full screen`} className="gallery-item group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl text-left" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`, height: isLarge ? "260px" : "180px" }} onClick={() => setLightboxIndex(index)}>
                    {item.mediaUrl && item.mediaType === "image" && <img src={item.mediaUrl} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                    {item.mediaUrl && item.mediaType === "video" && <video src={item.mediaUrl} poster={item.thumbnailUrl ?? undefined} preload="metadata" muted className="absolute inset-0 h-full w-full object-cover" />}
                    {!item.mediaUrl && <div className="absolute inset-0 flex items-center justify-center text-white/40"><ImageIcon size={52} /></div>}
                    {item.mediaType === "video" && <span className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-red-700 shadow-lg"><Play size={21} fill="currentColor" /></span>}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-4 opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                      <div className="mb-0.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--church-gold-light)" }}>{item.category}</div>
                      <div className="text-sm font-bold leading-tight text-white">{item.title}</div>
                      <div className="mt-2 text-xs text-white/70">Click to {item.mediaType === "video" ? "play" : "view"}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-gray-500"><ImageIcon className="mx-auto mb-3 text-gray-400" size={38} /><p className="font-bold">No published media in this category yet.</p></div>
          )}

          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl p-8 text-center text-white md:grid-cols-4" style={{ background: "linear-gradient(135deg, var(--church-navy) 0%, var(--church-navy-dark) 100%)" }}>
            {[{ number: String(items.length), label: "Published Moments" }, { number: String(videoCount), label: "Videos" }, { number: String(items.length - videoCount), label: "Photos" }, { number: String(new Set(items.map((item) => item.category)).size), label: "Collections" }].map((stat) => <div key={stat.label}><div className="text-3xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "var(--church-gold-light)" }}>{stat.number}</div><div className="mt-1 text-sm text-white/60">{stat.label}</div></div>)}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <FullscreenMediaViewer
          items={filtered}
          activeIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
