import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import CommunityIntro from "../community/CommunityIntro";
import { fetchPublishedLeaders } from "../../lib/media";
import type { LeaderItem } from "../../types/content";

function LeaderPhoto({ leader }: { leader: LeaderItem }) {
  return leader.imageUrl ? (
    <img
      src={leader.imageUrl}
      alt={leader.name}
      className="block h-auto w-full object-contain"
      loading="lazy"
    />
  ) : (
    <div className="flex min-h-64 items-center justify-center bg-slate-100 text-slate-400">
      <UserRound size={64} strokeWidth={1.3} />
    </div>
  );
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
    return () => {
      active = false;
    };
  }, []);
  const [leadPastor, ...otherLeaders] = leaders;

  return (
    <>
      <CommunityIntro eyebrow="Faith and service" title="Our leadership">
        <p>Meet the ministers and leaders who serve our church community.</p>
      </CommunityIntro>
      <section className="site-section" aria-label="Church leaders">
        <div className="site-container">
          {loading ? (
            <div
              className="h-96 animate-pulse rounded-2xl bg-slate-100"
              role="status"
            >
              <span className="sr-only">Loading leadership profiles</span>
            </div>
          ) : leadPastor ? (
            <>
              <article className="featured-leader overflow-hidden rounded-2xl md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="self-start bg-slate-100">
                  <LeaderPhoto leader={leadPastor} />
                </div>
                <div className="self-center p-7 md:p-12 lg:p-16">
                  <p className="site-eyebrow">{leadPastor.position}</p>
                  <h2 className="section-heading mb-6">{leadPastor.name}</h2>
                  <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                    {leadPastor.description}
                  </p>
                </div>
              </article>
              {otherLeaders.length > 0 && (
                <div className="mt-12 grid items-start gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                  {otherLeaders.map((leader) => (
                    <article
                      key={leader.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <LeaderPhoto leader={leader} />
                      <div className="p-6 md:p-7">
                        <p className="mb-3 text-sm font-semibold text-church-red">
                          {leader.position}
                        </p>
                        <h2 className="mb-4 text-2xl font-semibold text-church-navy">
                          {leader.name}
                        </h2>
                        {leader.description && (
                          <details className="profile-description">
                            <summary className="cursor-pointer text-base font-semibold text-church-navy">
                              Read biography
                            </summary>
                            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                              {leader.description}
                            </p>
                          </details>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-600">
              Leadership profiles will appear here once they are published.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
