import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  MessageCircle,
  Phone,
  UsersRound,
  UserRound,
} from "lucide-react";
import { CHURCH_NAME, ministries, type Ministry } from "../../data/churchData";
import { fetchMinistryContent, type MinistryContent } from "../../lib/media";
import { whatsappContactLink } from "../../lib/whatsapp";
import FullscreenMediaViewer from "../media/FullscreenMediaViewer";

interface MinistryPageProps {
  ministry: Ministry;
  onBack: () => void;
  onOpenMinistry: (slug: string) => void;
}

export default function MinistryPage({
  ministry,
  onBack,
  onOpenMinistry,
}: MinistryPageProps) {
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
    .map((image, index) => ({
      id: `${ministry.slug}-${index}`,
      title: "",
      imageUrl: image,
    }));
  const currentRemoteContent =
    remoteContent?.ministrySlug === ministry.slug
      ? remoteContent.content
      : null;
  const photos = currentRemoteContent
    ? currentRemoteContent.photos
    : fallbackPhotos;
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
        photo:
          currentRemoteContent.president.photo ||
          ministry.president?.photo ||
          null,
      }
    : ministry.president;
  const leaderTitle = president?.title ?? "President";
  const whatsappUrl = president?.whatsapp
    ? whatsappContactLink(
        president.whatsapp,
        `Hello, I would like to know more about joining the ${ministry.name} at ${CHURCH_NAME}.`,
      )
    : "";
  const relatedMinistries = ministries
    .filter((item) => item.id !== ministry.id)
    .slice(0, 3);

  return (
    <div style={{ background: "var(--church-cream)" }}>
      <section className="ministry-intro site-section">
        <div className="site-container">
          <button
            type="button"
            onClick={onBack}
            className="site-text-link mb-10 inline-flex items-center gap-2"
          >
            <ArrowLeft size={17} /> All ministries
          </button>
          <div className="flex max-w-4xl flex-col gap-7 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 md:h-28 md:w-28">
              {ministry.logo ? (
                <img
                  src={ministry.logo}
                  alt={`${ministry.name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <UsersRound size={56} style={{ color: ministry.color }} />
              )}
            </div>
            <div>
              <div className="site-eyebrow">{ministry.ageGroup}</div>
              <h1 className="page-heading">{ministry.name}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {ministry.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container grid items-start gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div className="space-y-14">
          <article>
            <h2 className="text-3xl font-semibold text-church-navy">
              About this ministry
            </h2>
            <p className="mt-6 text-base leading-8 text-gray-600">
              {ministry.description}
            </p>

            {ministry.subGroups && ministry.subGroups.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-7">
                <h3 className="mb-4 text-base font-bold text-gray-800">
                  Ministry sections
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ministry.subGroups.map((group) => (
                    <span
                      key={group}
                      className="rounded-full px-3 py-1.5 text-sm font-bold"
                      style={{
                        background: `${ministry.color}12`,
                        color: ministry.color,
                        border: `1px solid ${ministry.color}25`,
                      }}
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <article>
            <h2 className="text-3xl font-semibold text-church-navy">
              Life in our fellowship
            </h2>
            {photos.length > 0 ? (
              <div className="mt-7 grid items-start gap-4 sm:grid-cols-2">
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
                      alt={
                        photo.title || `${ministry.name} activity ${index + 1}`
                      }
                      className="block h-auto w-full object-contain"
                      loading="lazy"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-left text-base font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                      View full screen
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                <ImageIcon size={40} className="text-gray-300" />
                <p className="mt-4 font-bold text-gray-600">
                  Activity photos coming soon
                </p>
                <p className="mt-1 max-w-sm text-base leading-6 text-gray-400">
                  Photographs from this ministry will be displayed here once
                  they are supplied.
                </p>
              </div>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-semibold text-church-navy">
              Meet our {leaderTitle.toLowerCase()}
            </h2>
            {president ? (
              <>
                <div
                  className={`overflow-hidden rounded-2xl bg-gray-100 ${president.photo ? "" : "flex h-52 items-center justify-center"}`}
                >
                  {president.photo ? (
                    <img
                      src={president.photo}
                      alt={president.name}
                      className="block h-auto w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <UserRound size={62} className="text-gray-300" />
                  )}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-church-navy">
                  {president.name}
                </h3>
                <p className="mt-1 text-base text-gray-500">
                  {leaderTitle}, {ministry.name}
                </p>
                <div className="mt-6 space-y-3">
                  {president.phone && (
                    <a
                      href={`tel:${president.phone.replace(/[^+\d]/g, "")}`}
                      className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-base font-bold transition hover:bg-gray-50"
                      style={{
                        borderColor: `${ministry.color}40`,
                        color: ministry.color,
                      }}
                    >
                      <Phone size={17} /> Call {leaderTitle.toLowerCase()}
                    </a>
                  )}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle size={18} /> WhatsApp{" "}
                      {leaderTitle.toLowerCase()}
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-gray-50 px-5 py-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                  <UserRound size={36} className="text-gray-300" />
                </div>
                <p className="mt-5 font-bold text-gray-700">
                  President profile coming soon
                </p>
                <p className="mt-2 text-base leading-6 text-gray-500">
                  The approved name, photograph and contact information will
                  appear here once supplied.
                </p>
              </div>
            )}
          </article>
        </aside>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{
              color: "var(--church-navy)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Explore other ministries
          </h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMinistries.map((item) => (
              <a
                key={item.id}
                href={`/ministries/${item.slug}`}
                onClick={(event) => {
                  if (
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.shiftKey &&
                    !event.altKey &&
                    event.button === 0
                  ) {
                    event.preventDefault();
                    onOpenMinistry(item.slug);
                  }
                }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-6 text-left transition-colors hover:border-slate-400"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-1">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <UsersRound size={28} style={{ color: item.color }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="font-bold"
                    style={{ color: "var(--church-navy)" }}
                  >
                    {item.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {item.ageGroup}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-300 transition group-hover:translate-x-1"
                />
              </a>
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
