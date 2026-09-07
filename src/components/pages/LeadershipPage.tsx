import { useEffect, useState } from "react";
import { Download, UserRound } from "lucide-react";
import { fetchPublishedLeaders, mediaDownloadUrl } from "../../lib/media";
import type { LeaderItem } from "../../types/content";

const rankColors = ["var(--church-gold)", "var(--church-red)", "var(--church-navy)", "var(--church-green)"];

function LeaderPhoto({ leader, featured = false }: { leader: LeaderItem; featured?: boolean }) {
  if (leader.imageUrl) {
    return <img src={leader.imageUrl} alt={leader.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />;
  }
  return <div className="flex h-full w-full items-center justify-center text-white/80"><UserRound size={featured ? 92 : 64} strokeWidth={1.35} /></div>;
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublishedLeaders().then((items) => {
      if (active) {
        setLeaders(items);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const leadPastor = leaders[0];
  const otherLeaders = leaders.slice(1);

  return (
    <div>
      <section className="relative overflow-hidden py-24 text-white md:py-32" style={{ background: "linear-gradient(160deg, var(--church-navy-dark) 0%, var(--church-navy) 100%)" }}>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-gold-light)" }}>Servants of God&apos;s People</div>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl" style={{ fontFamily: "Playfair Display, serif" }}>Our Leadership</h1>
          <p className="mx-auto max-w-xl leading-relaxed text-white/70">God has entrusted faithful servants to shepherd the Methodist Cathedral of Favour. We honour and pray for them as they lead us in faith and service.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 60L720 0L1440 60H0Z" fill="var(--church-cream)" /></svg></div>
      </section>

      <section className="py-20 md:py-24" style={{ background: "var(--church-cream)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
          ) : leadPastor ? (
            <article className="overflow-hidden rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, var(--church-navy) 0%, var(--church-navy-dark) 100%)" }}>
              <div className="flex flex-col md:flex-row">
                <div className="relative h-96 w-full shrink-0 overflow-hidden bg-red-800 md:h-auto md:w-[390px]">
                  <LeaderPhoto leader={leadPastor} featured />
                  {leadPastor.imageUrl && <a href={mediaDownloadUrl(leadPastor.imageUrl)} download className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75" aria-label={`Download photo of ${leadPastor.name}`} title="Download photo"><Download size={18} /></a>}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-6 pt-20 text-xs font-bold uppercase tracking-[0.2em] text-white">Lead Minister</div>
                </div>
                <div className="flex-1 p-9 text-white md:p-14">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--church-gold-light)" }}>Cathedral Leadership</div>
                  <h2 className="mb-3 text-3xl font-bold md:text-4xl" style={{ fontFamily: "Playfair Display, serif" }}>{leadPastor.name}</h2>
                  <div className="mb-6 text-sm font-semibold" style={{ color: "var(--church-gold-light)" }}>{leadPastor.position}</div>
                  <p className="text-sm leading-7 text-white/75">{leadPastor.description}</p>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">Leadership profiles will appear here once they are published.</div>
          )}
        </div>
      </section>

      {otherLeaders.length > 0 && (
        <section className="pb-24" style={{ background: "var(--church-cream)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="section-title mb-12 text-2xl font-bold md:text-3xl" style={{ color: "var(--church-navy)" }}>Cathedral Leadership Team</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherLeaders.map((leader, index) => {
                const color = rankColors[index % rankColors.length];
                return (
                  <article key={leader.id} className="leader-card overflow-hidden">
                    <div className="relative h-60 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` }}>
                      <LeaderPhoto leader={leader} />
                      {leader.imageUrl && <a href={mediaDownloadUrl(leader.imageUrl)} download className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75" aria-label={`Download photo of ${leader.name}`} title="Download photo"><Download size={16} /></a>}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 text-center text-xs font-bold text-white backdrop-blur-sm">{leader.position}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 text-sm font-bold" style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}>{leader.name}</h3>
                      <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">{leader.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-16 rounded-2xl p-10 text-center text-white" style={{ background: "linear-gradient(135deg, var(--church-red) 0%, var(--church-red-dark) 100%)" }}>
              <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Pray for Our Leaders</h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-white/80">Join us in praying for wisdom, strength, and divine guidance for all who shepherd the Methodist Cathedral of Favour.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
