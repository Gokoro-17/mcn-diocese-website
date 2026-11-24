import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Radio,
  RefreshCw,
} from "lucide-react";
import CommunityIntro from "../community/CommunityIntro";
import {
  communityError,
  fetchLiveStream,
  type LiveStream,
} from "../../lib/community";
import { parseStreamUrl } from "../../lib/livestream";
import { serviceTimes } from "../../data/churchData";

export default function LivePage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    const load = () =>
      fetchLiveStream()
        .then((value) => {
          if (active) {
            setStream(value);
            setError("");
            setLoading(false);
          }
        })
        .catch((loadError) => {
          if (active) {
            setError(communityError(loadError));
            setLoading(false);
          }
        });
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [refresh]);
  const source = parseStreamUrl(stream?.watch_url ?? "");
  const isLive = !error && stream?.status === "live" && Boolean(source);
  const isScheduled =
    !error && stream?.status === "scheduled" && Boolean(source);
  const scheduledAt = stream?.scheduled_at
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Africa/Lagos",
      }).format(new Date(stream.scheduled_at))
    : "";

  return (
    <>
      <CommunityIntro
        eyebrow="Worship online"
        title="One faith. Wherever you are."
      >
        <p>
          Join the Cathedral of Favour in worship, from home or wherever life
          takes you.
        </p>
      </CommunityIntro>
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 lg:py-16">
        <section
          className="community-panel min-w-0 !p-0 overflow-hidden"
          aria-label="Church live stream"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] ${isLive ? "text-red-700" : "text-slate-500"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isLive ? "animate-pulse bg-red-600" : "bg-slate-400"}`}
              />
              {loading
                ? "Checking stream"
                : isLive
                  ? "Live now"
                  : isScheduled
                    ? "Upcoming broadcast"
                    : "Between broadcasts"}
            </span>
            <button
              type="button"
              onClick={() => setRefresh((value) => value + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-church-navy"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
          {loading ? (
            <div
              className="aspect-video animate-pulse bg-slate-100"
              aria-label="Loading live stream"
            />
          ) : isLive && source?.embedUrl ? (
            <iframe
              title={stream?.title || "Church live stream"}
              src={source.embedUrl}
              className="aspect-video w-full border-0 bg-black"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center bg-church-navy-dark px-6 py-12 text-center text-white sm:aspect-video">
              <Radio
                size={40}
                strokeWidth={1.25}
                className="mb-5 text-amber-200"
              />
              <h2 className="text-3xl font-semibold">
                {isLive
                  ? "Join our live service"
                  : isScheduled
                    ? "We'll worship together soon."
                    : "See you at the next service."}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                {isLive
                  ? `Use the ${source?.provider} link below to join the broadcast.`
                  : isScheduled && scheduledAt
                    ? `${scheduledAt} (WAT)`
                    : "The next broadcast link will appear here when it is published. You can still join us in person or catch up on recent sermons."}
              </p>
            </div>
          )}
          <div className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-church-navy-dark">
              {stream?.title || "Worship with us"}
            </h2>
            {stream?.description && (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {stream.description}
              </p>
            )}
            {source && (isLive || isScheduled) && (
              <a
                href={source.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="community-button"
              >
                {isLive ? "Watch" : "View broadcast"} on {source.provider}
                <ExternalLink size={16} />
              </a>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <p className="text-xs leading-6 text-slate-500">
              If a broadcast is unavailable here, try its original platform.
              Broadcast times are confirmed by the church.
            </p>
          </div>
        </section>
        <aside className="space-y-6">
          <div className="community-panel">
            <span className="community-icon">
              <CalendarDays size={23} />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-church-navy-dark">
              Join us on Sunday
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Service times · West Africa Time
            </p>
            <ul className="mt-5 divide-y divide-slate-100">
              {serviceTimes.map((service) => (
                <li
                  key={service.name}
                  className="flex justify-between gap-3 py-3 text-sm"
                >
                  <span className="text-slate-600">{service.name}</span>
                  <strong className="whitespace-nowrap text-church-navy-dark">
                    {service.time}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="community-panel !bg-[#f0ece2]">
            <h2 className="text-2xl font-semibold text-church-navy-dark">
              Let us pray with you.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              There is room for what is on your heart.
            </p>
            <button
              onClick={() => onNavigate("prayer")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-church-navy"
            >
              Request prayer
              <ArrowRight size={16} />
            </button>
          </div>
          <a
            className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-church-navy"
            href="/#sermons"
          >
            Explore recent sermons
            <ArrowRight size={16} />
          </a>
        </aside>
      </div>
    </>
  );
}
