import type { MouseEvent } from "react";
import { ArrowRight, UsersRound } from "lucide-react";
import { ministries } from "../../data/churchData";

export default function MinistriesSection({
  onOpenMinistry,
}: {
  onOpenMinistry: (slug: string) => void;
}) {
  function open(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (
      event.button ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    onOpenMinistry(slug);
  }
  return (
    <section
      id="ministries"
      className="site-section ministries-section"
      aria-labelledby="ministries-title"
    >
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="site-eyebrow">Find your place</p>
            <h2 id="ministries-title">A church family for every season.</h2>
          </div>
          <p>
            Explore a ministry, meet its people, and find a way to take part.
          </p>
        </div>
        <div className="ministry-directory">
          {ministries.map((ministry) => (
            <a
              key={ministry.id}
              className="ministry-directory-card"
              href={`/ministries/${ministry.slug}`}
              onClick={(event) => open(event, ministry.slug)}
            >
              <div className="ministry-mark">
                {ministry.logo ? (
                  <img src={ministry.logo} alt="" loading="lazy" />
                ) : (
                  <UsersRound size={32} aria-hidden="true" />
                )}
              </div>
              <div>
                <h3>{ministry.name}</h3>
                <p>{ministry.ageGroup}</p>
              </div>
              <span className="ministry-open">
                Explore ministry
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
