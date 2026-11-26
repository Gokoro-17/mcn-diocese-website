import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Download, MapPin } from "lucide-react";
import { fetchUpcomingEvents, mediaDownloadUrl } from "../../lib/media";
import type { ChurchEventItem } from "../../types/content";

const fullDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

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
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, hours, minutes));
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
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="events" className="events-section site-section">
      <div className="site-container">
        <div className="mb-12 max-w-2xl">
          <h2 className="section-heading">What's coming up</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Make time for worship, fellowship and the life of our church.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            {events.map((event) => {
              return (
                <article
                  key={event.id}
                  className="event-card overflow-hidden rounded-2xl border"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={`${event.title} poster`}
                      className="block h-auto w-full"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6 md:p-8">
                    <div className="mb-6">
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-church-red">
                          {event.category}
                        </span>
                        <h3 className="mt-3 text-2xl font-semibold leading-snug text-church-navy">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-3 text-base text-slate-600">
                      <div className="flex items-start gap-2">
                        <CalendarDays size={15} className="mt-0.5 shrink-0" />
                        <span>{eventDate(event)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 size={15} className="shrink-0" />
                        <span>{eventTime(event.startTime)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-start gap-2">
                          <MapPin size={15} className="mt-0.5 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-600">
                        {event.description}
                      </p>
                    )}
                    {event.imageUrl && (
                      <a
                        href={mediaDownloadUrl(event.imageUrl)}
                        download
                        className="site-text-link mt-6 inline-flex items-center gap-2"
                      >
                        <Download size={17} /> Download poster
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-600">
            <CalendarDays className="mx-auto mb-3" size={38} />
            <p className="font-semibold text-church-navy">
              No upcoming events have been published yet.
            </p>
            <p className="mt-1 text-base">
              Please check back soon for the next church programme.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
