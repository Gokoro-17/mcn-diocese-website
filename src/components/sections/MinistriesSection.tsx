import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ministries } from "../../data/churchData";

interface MinistriesSectionProps {
  onOpenMinistry: (slug: string) => void;
}

export default function MinistriesSection({ onOpenMinistry }: MinistriesSectionProps) {
  const [activeMinistry, setActiveMinistry] = useState(0);
  const ministry = ministries[activeMinistry];

  return (
    <section id="ministries" className="scroll-mt-24 py-20 md:py-28" style={{ background: "var(--church-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "var(--church-red)" }}
          >
            Serving Together
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold section-title centered"
            style={{ color: "var(--church-navy)" }}
          >
            Our Ministries
          </h2>
          <p className="mt-5 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            The Methodist Cathedral of Favour is alive with ministry. There is a place for every person, every gift,
            and every season of life in our church family.
          </p>
        </div>

        {/* Ministry Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ministries.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveMinistry(i)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: activeMinistry === i ? m.color : "white",
                color: activeMinistry === i ? "white" : m.color,
                border: `2px solid ${m.color}`,
                boxShadow: activeMinistry === i ? `0 4px 16px ${m.color}40` : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {m.logo && <img src={m.logo} alt="" className="h-7 w-7 rounded-full bg-white object-contain" />}
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        {/* Ministry Detail Card */}
        <div
          key={activeMinistry}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "white",
            animation: "scaleIn 0.4s ease forwards",
          }}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Left: Content */}
            <div className="flex-1 p-8 md:p-12">
              {/* Ministry header */}
              <div className="flex items-center gap-4 mb-6">
                {ministry.logo && <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-md"><img src={ministry.logo} alt={`${ministry.name} logo`} className="h-full w-full object-contain" /></div>}
                <div>
                  <h3
                    className="text-2xl md:text-3xl font-bold"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
                  >
                    {ministry.name}
                  </h3>
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mt-1"
                    style={{ color: ministry.color }}
                  >
                    {ministry.ageGroup}
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div
                className="text-lg font-semibold italic mb-5"
                style={{ fontFamily: "Playfair Display, serif", color: ministry.color }}
              >
                "{ministry.tagline}"
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                {ministry.description}
              </p>

              {/* Sub-groups (for worship ministry) */}
              {ministry.subGroups && (
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-700 mb-3">Ministry Sections:</div>
                  <div className="flex flex-wrap gap-2">
                    {ministry.subGroups.map((sg) => (
                      <span
                        key={sg}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          background: `${ministry.color}15`,
                          color: ministry.color,
                          border: `1px solid ${ministry.color}30`,
                        }}
                      >
                        {sg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => onOpenMinistry(ministry.slug)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{ background: ministry.color }}
              >
                View Ministry
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Official fellowship logo; intentionally blank until a logo is supplied. */}
            <div className="flex min-h-72 shrink-0 items-center justify-center bg-white p-8 lg:w-[28rem]">
              {ministry.logo && <img src={ministry.logo} alt={`${ministry.name} official logo`} className="max-h-80 w-full object-contain" />}
            </div>
          </div>
        </div>

        {/* All Ministries mini cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ministries.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveMinistry(i)}
              className="p-4 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-md"
              style={{
                background: activeMinistry === i ? `${m.color}15` : "white",
                border: `1.5px solid ${activeMinistry === i ? m.color : "transparent"}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              {m.logo && <div className="mb-3 flex h-16 justify-center"><img src={m.logo} alt="" className="h-16 w-16 object-contain" /></div>}
              <div
                className="text-xs font-bold leading-tight"
                style={{ color: activeMinistry === i ? m.color : "var(--church-navy)" }}
              >
                {m.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">{m.ageGroup}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
