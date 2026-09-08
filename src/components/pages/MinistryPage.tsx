import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon, Mail, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { CHURCH_NAME, contactInfo, ministries, type Ministry } from "../../data/churchData";
import { fetchMinistryContent, type MinistryContent } from "../../lib/media";
import FullscreenMediaViewer from "../media/FullscreenMediaViewer";

interface MinistryPageProps {
  ministry: Ministry;
  onBack: () => void;
  onOpenMinistry: (slug: string) => void;
}

function whatsappContactLink(value: string, ministryName: string) {
  const message = `Hello, I would like to know more about joining the ${ministryName} at ${CHURCH_NAME}.`;
  try {
    const destination = value.startsWith("http") ? new URL(value) : new URL(`https://wa.me/${value.replace(/\D/g, "")}`);
    destination.searchParams.set("text", message);
    return destination.toString();
  } catch {
    return "";
  }
}

export default function MinistryPage({ ministry, onBack, onOpenMinistry }: MinistryPageProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [remoteContent, setRemoteContent] = useState<{
    ministrySlug: string;
    content: MinistryContent;
  } | null>(null);

  useEffect(() => {
    let active = true;
    void fetchMinistryContent(ministry.slug).then((content) => {
      if (active && content) {
        setRemoteContent({ ministrySlug: ministry.slug, content });
      }
    });
    return () => {
      active = false;
    };
  }, [ministry.slug]);

  const fallbackPhotos = ministry.images
    .filter((image): image is string => Boolean(image))
    .map((image, index) => ({ id: `${ministry.slug}-${index}`, title: "", imageUrl: image }));
  const currentRemoteContent = remoteContent?.ministrySlug === ministry.slug
    ? remoteContent.content
    : null;
  const photos = currentRemoteContent ? currentRemoteContent.photos : fallbackPhotos;
  const viewerPhotos = photos.map((photo, index) => ({
    id: photo.id,
    title: photo.title || `${ministry.name} activity ${index + 1}`,
    category: "Ministry Gallery",
    mediaType: "image" as const,
    mediaUrl: photo.imageUrl,
  }));
  const president = currentRemoteContent?.president
    ? {
        ...ministry.president,
        ...currentRemoteContent.president,
        photo: currentRemoteContent.president.photo || ministry.president?.photo || null,
      }
    : ministry.president;
  const leaderTitle = president?.title ?? "President";
  const whatsappUrl = president?.whatsapp ? whatsappContactLink(president.whatsapp, ministry.name) : "";
  const officeEmailUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Joining the ${ministry.name}`)}`;
  const relatedMinistries = ministries.filter((item) => item.id !== ministry.id).slice(0, 3);

  return (
    <div style={{ background: "var(--church-cream)" }}>
      <section className="relative overflow-hidden px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8" style={{ background: `linear-gradient(135deg, ${ministry.color} 0%, var(--church-navy-dark) 100%)` }}>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-7xl">
          <button type="button" onClick={onBack} className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
            <ArrowLeft size={17} /> All ministries
          </button>
          <div className="flex max-w-4xl flex-col gap-7 md:flex-row md:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white p-3 shadow-2xl md:h-36 md:w-36">
              {ministry.logo ? <img src={ministry.logo} alt={`${ministry.name} logo`} className="h-full w-full object-contain" /> : <ShieldCheck size={56} style={{ color: ministry.color }} />}
            </div>
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/65">{ministry.ageGroup}</div>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl" style={{ fontFamily: "Playfair Display, serif" }}>{ministry.name}</h1>
              <p className="mt-4 text-lg font-semibold italic text-white/80 md:text-xl">“{ministry.tagline}”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div className="space-y-8">
          <article className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.24em]" style={{ color: ministry.color }}>About the Ministry</div>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--church-navy)", fontFamily: "Playfair Display, serif" }}>Faith, fellowship and service</h2>
            <p className="mt-6 text-base leading-8 text-gray-600">{ministry.description}</p>

            {ministry.subGroups && ministry.subGroups.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-7">
                <h3 className="mb-4 text-sm font-bold text-gray-800">Ministry sections</h3>
                <div className="flex flex-wrap gap-2">
                  {ministry.subGroups.map((group) => <span key={group} className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: `${ministry.color}12`, color: ministry.color, border: `1px solid ${ministry.color}25` }}>{group}</span>)}
                </div>
              </div>
            )}
          </article>

          <article className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.24em]" style={{ color: ministry.color }}>Ministry Gallery</div>
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--church-navy)", fontFamily: "Playfair Display, serif" }}>Life in our fellowship</h2>
            {photos.length > 0 ? (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={`group relative overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${index === 0 && photos.length > 2 ? "sm:col-span-2" : ""}`}
                    style={{ outlineColor: ministry.color }}
                    onClick={() => setActivePhotoIndex(index)}
                    aria-label={`View ${photo.title || `${ministry.name} activity ${index + 1}`} in full screen`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title || `${ministry.name} activity ${index + 1}`}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-left text-sm font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      View full screen
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                <ImageIcon size={40} className="text-gray-300" />
                <p className="mt-4 font-bold text-gray-600">Activity photos coming soon</p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-gray-400">Photographs from this ministry will be displayed here once they are supplied.</p>
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: ministry.color }}>Ministry {leaderTitle}</div>
            {president ? (
              <>
                <div className="flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                  {president.photo ? <img src={president.photo} alt={president.name} className="h-full w-full object-cover" loading="lazy" /> : <UserRound size={62} className="text-gray-300" />}
                </div>
                <h2 className="mt-5 text-xl font-bold" style={{ color: "var(--church-navy)", fontFamily: "Playfair Display, serif" }}>{president.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{leaderTitle}, {ministry.name}</p>
                <div className="mt-6 space-y-3">
                  {president.phone && <a href={`tel:${president.phone.replace(/[^+\d]/g, "")}`} className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition hover:bg-gray-50" style={{ borderColor: `${ministry.color}40`, color: ministry.color }}><Phone size={17} /> Call {leaderTitle.toLowerCase()}</a>}
                  {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"><MessageCircle size={18} /> WhatsApp {leaderTitle.toLowerCase()}</a>}
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-gray-50 px-5 py-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm"><UserRound size={36} className="text-gray-300" /></div>
                <p className="mt-5 font-bold text-gray-700">President profile coming soon</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">The approved name, photograph and contact information will appear here once supplied.</p>
              </div>
            )}
          </article>

          <article className="rounded-3xl p-6 text-white shadow-xl" style={{ background: ministry.color }}>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Interested in joining?</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">Reach out and the church will help connect you with the right ministry leader.</p>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold" style={{ color: ministry.color }}><MessageCircle size={18} /> Join this ministry</a>
            ) : (
              <a href={officeEmailUrl} className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold" style={{ color: ministry.color }}><Mail size={18} /> Contact church office</a>
            )}
          </article>
        </aside>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--church-navy)", fontFamily: "Playfair Display, serif" }}>Explore other ministries</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMinistries.map((item) => (
              <button key={item.id} type="button" onClick={() => onOpenMinistry(item.slug)} className="group flex items-center gap-4 rounded-2xl border border-gray-100 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-1">{item.logo ? <img src={item.logo} alt="" className="h-full w-full object-contain" /> : <ShieldCheck size={28} style={{ color: item.color }} />}</div>
                <div className="min-w-0 flex-1"><div className="font-bold" style={{ color: "var(--church-navy)" }}>{item.name}</div><div className="mt-1 text-xs text-gray-400">{item.ageGroup}</div></div>
                <ArrowRight size={18} className="shrink-0 text-gray-300 transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {activePhotoIndex !== null && (
        <FullscreenMediaViewer
          items={viewerPhotos}
          activeIndex={activePhotoIndex}
          onIndexChange={setActivePhotoIndex}
          onClose={() => setActivePhotoIndex(null)}
        />
      )}
    </div>
  );
}
