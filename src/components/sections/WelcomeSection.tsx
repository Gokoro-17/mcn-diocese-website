import { ArrowRight, CalendarDays, Clock3, MapPin, Target, Telescope } from "lucide-react";
import { contactInfo, serviceTimes, weeklyActivities } from "../../data/churchData";

const welcomeCards = [
  {
    icon: <Target size={27} />,
    title: "Our Mission",
    content:
      "TO CONSISTENTLY WIN MORE SOULS FOR CHRIST, DEVELOP SPIRITUALLY FULFILLED MEMBERS AND REMAIN VERY ACTIVE IN SERVING HUMANITY.",
    color: "var(--church-red)",
  },
  {
    icon: <Telescope size={27} />,
    title: "Our Vision",
    content:
      "TO BE ONE OF THE LARGEST AND SPIRITUALLY VIBRANT CHURCHES IN NIGERIA.",
    color: "var(--church-navy)",
  },
  {
    icon: <Clock3 size={27} />,
    title: "Service Times",
    content: null,
    serviceTimes: true,
    color: "var(--church-green)",
  },
  {
    icon: <MapPin size={27} />,
    title: "Find Us",
    content:
      `${contactInfo.address} We are easy to find and always ready to welcome you.`,
    hasLink: true,
    color: "var(--church-gold)",
  },
];

export default function WelcomeSection() {
  return (
    <section id="visit" className="scroll-mt-24 py-20 md:py-28" style={{ background: "var(--church-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "var(--church-red)" }}
          >
            God's House of Grace
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold section-title centered"
            style={{ color: "var(--church-navy)" }}
          >
            Welcome to Our Church
          </h2>
          <p className="mt-6 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The Methodist Cathedral of Favour is a beacon of hope, love, and transforming faith
            to the people of this region. We are glad you found us.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {welcomeCards.map((card, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-7 relative overflow-hidden"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: card.color }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 mt-2"
                style={{ background: `${card.color}15` }}
              >
                {card.icon}
              </div>

              <h3
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
              >
                {card.title}
              </h3>

              {card.serviceTimes ? (
                <ul className="space-y-2">
                  {serviceTimes.map((s, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: card.color }}
                      />
                      <div>
                        <span className="font-semibold text-gray-800">{s.day}</span>
                        <span className="text-gray-500 ml-1">at {s.time}</span>
                        <div className="text-xs text-gray-400">{s.name}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{card.content}</p>
              )}

              {card.hasLink && (
                <a
                  href={contactInfo.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold transition-colors hover:underline"
                  style={{ color: card.color }}
                >
                  Get Directions <ArrowRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Activities */}
        <div className="mt-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-red)" }}>
                Join Us This Week
              </div>
              <h3 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}>
                Weekly Activities
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-500">
              There is a place for worship, prayer, study, service and fellowship throughout the week.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {weeklyActivities.map((schedule) => (
              <article key={schedule.day} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: "var(--church-navy)" }}>
                  <CalendarDays size={19} style={{ color: "var(--church-gold-light)" }} />
                  <h4 className="font-bold">{schedule.day}</h4>
                </div>
                <ul className="divide-y divide-gray-100 px-5">
                  {schedule.activities.map((activity) => (
                    <li key={`${activity.name}-${activity.time}`} className="flex gap-4 py-4">
                      <div className="w-24 shrink-0 text-xs font-bold" style={{ color: "var(--church-red)" }}>{activity.time}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold leading-5 text-gray-800">{activity.name}</div>
                        {activity.note && <div className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">{activity.note}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Scripture Banner */}
        <div
          className="mt-16 rounded-2xl p-8 text-center text-white"
          style={{
            background: "linear-gradient(135deg, var(--church-navy) 0%, var(--church-navy-dark) 100%)",
          }}
        >
          <p
            className="text-xl md:text-2xl font-medium italic mb-3 leading-relaxed"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            "Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting
            one another: and so much the more, as ye see the day approaching."
          </p>
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--church-gold-light)" }}
          >
            Hebrews 10:25 (KJV)
          </span>
        </div>
      </div>
    </section>
  );
}
