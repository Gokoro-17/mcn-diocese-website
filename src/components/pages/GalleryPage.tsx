import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Play } from "lucide-react";
import CommunityIntro from "../community/CommunityIntro";
import FullscreenMediaViewer from "../media/FullscreenMediaViewer";
import { fetchPublishedGallery } from "../../lib/media";
import type { GalleryMediaItem } from "../../types/content";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetchPublishedGallery().then((result) => {
      if (active) {
        setItems(result.filter((item) => item.mediaUrl));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        items
          .map((item) => item.category)
          .filter((category) => category && category !== "All"),
      ),
    ],
    [items],
  );
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <CommunityIntro eyebrow="Life in our church" title="Gallery">
        <p>Worship, celebrations and everyday moments from our community.</p>
      </CommunityIntro>
      <section
        className="site-section"
        aria-label="Church photographs and videos"
      >
        <div className="site-container">
          {categories.length > 1 && (
            <div
              className="mb-10 flex flex-wrap gap-3"
              aria-label="Filter gallery"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`rounded-full border px-5 py-2.5 text-base font-semibold transition-colors ${activeCategory === category ? "border-church-navy bg-church-navy text-white" : "border-slate-200 bg-white text-slate-600 hover:border-church-navy"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          {loading ? (
            <div
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              role="status"
            >
              <span className="sr-only">Loading gallery</span>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
              {filtered.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`${item.mediaType === "video" ? "Play" : "View"} ${item.title} in full screen`}
                  className="mb-8 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-colors hover:border-slate-400"
                >
                  <div className="relative bg-slate-100">
                    {item.mediaType === "image" ? (
                      <img
                        src={item.mediaUrl!}
                        alt={item.title}
                        className="block h-auto w-full"
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <video
                          src={item.mediaUrl!}
                          poster={item.thumbnailUrl ?? undefined}
                          preload="metadata"
                          muted
                          className="block h-auto w-full"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-church-navy shadow-sm">
                            <Play size={21} fill="currentColor" />
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-sm font-semibold text-church-red">
                      {item.category}
                    </p>
                    <h2 className="text-xl font-semibold text-church-navy">
                      {item.title}
                    </h2>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-600">
              <ImageIcon className="mx-auto mb-4 text-slate-400" size={36} />
              <p>No published media in this collection yet.</p>
            </div>
          )}
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
    </>
  );
}
