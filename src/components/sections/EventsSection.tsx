import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Download, MapPin } from "lucide-react";
import { fetchUpcomingEvents, mediaDownloadUrl } from "../../lib/media";
import type { ChurchEventItem } from "../../types/content";

const dayFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short" });
const fullDateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function asLocalDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function eventDate(event: ChurchEventItem) {
  const start = fullDateFormatter.format(asLocalDate(event.startDate));
  if (!event.endDate || event.endDate === event.startDate) return start;
  return `${start} to ${fullDateFormatter.format(asLocalDate(event.endDate))}`;
}

function eventTime(value: string | null) {
  if (!value) return "Time to be announced";
  const [hours, minutes] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, hours, minutes));
}

export default function EventsSection() {
  const [events, setEvents] = useState<ChurchEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchUpcomingEvents().then((items) => {
      if (active) {
        setEvents(items);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(160deg, var(--church-navy-dark) 0%, var(--church-navy) 60%, var(--church-navy-dark) 100%)" }}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-gold-light)" }}>Mark Your Calendar</div>
          <h2 className="section-title centered text-3xl font-bold text-white md:text-5xl" style={{ fontFamily: "Playfair Display, serif" }}>Upcoming Events</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60">Plan ahead for worship, fellowship, celebrations, and special programmes at the Methodist Cathedral of Favour.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{[...Array(3)].map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-white/10" />)}</div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const start = asLocalDate(event.startDate);
              return (
                <article key={event.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl backdrop-blur-sm">
                  {event.imageUrl && <div className="relative h-40 overflow-hidden"><img src={event.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" /></div>}
                  <div className="relative p-6">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-lg" style={{ background: event.color }}>
                        <span className="text-xs font-bold uppercase tracking-wider">{monthFormatter.format(start)}</span>
                        <span className="text-xl font-black" style={{ fontFamily: "Playfair Display, serif" }}>{dayFormatter.format(start)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: event.color }}>{event.category}</span>
                        <h3 className="mt-1 text-lg font-bold leading-tight text-white" style={{ fontFamily: "Playfair Display, serif" }}>{event.title}</h3>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-white/65">
                      <div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0" /><span>{eventDate(event)}</span></div>
                      <div className="flex items-center gap-2"><Clock3 size={15} className="shrink-0" /><span>{eventTime(event.startTime)}</span></div>
                      {event.location && <div className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /><span>{event.location}</span></div>}
                    </div>
                    {event.description && <p className="mt-5 line-clamp-3 text-xs leading-relaxed text-white/55">{event.description}</p>}
                    {event.imageUrl && <a href={mediaDownloadUrl(event.imageUrl)} download className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-white/80 transition hover:bg-white/10 hover:text-white"><Download size={14} /> Download poster</a>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: event.color }} />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-12 text-center text-white/60">
            <CalendarDays className="mx-auto mb-3" size={38} />
            <p className="font-bold text-white">No upcoming events have been published yet.</p>
            <p className="mt-1 text-sm">Please check back soon for the next church programme.</p>
          </div>
        )}
      </div>
    </section>
  );
}
