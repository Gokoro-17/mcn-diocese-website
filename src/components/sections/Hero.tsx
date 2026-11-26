import { CalendarDays, Cross, HeartHandshake } from "lucide-react";
import { CHURCH_NAME, DENOMINATION_NAME } from "../../data/churchData";
import SiteLink from "../navigation/SiteLink";
import ServiceCountdown from "./ServiceCountdown";

export default function Hero({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-crosses" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Cross
            key={index}
            size={40 + (index % 3) * 16}
            strokeWidth={1.2}
            style={{ top: `${12 + index * 14}%`, left: `${4 + index * 17}%` }}
          />
        ))}
      </div>
      <div className="site-container hero-content">
        <p className="hero-church-name">
          {CHURCH_NAME} · {DENOMINATION_NAME}
        </p>
        <h1 id="home-title">
          Welcome to the
          <br className="hidden sm:block" /> Cathedral of Favour
        </h1>
        <p className="hero-subtitle">
          A Place of Worship, Fellowship &amp; Spiritual Growth
        </p>
        <div className="hero-actions">
          <a href="/#visit" className="hero-primary">
            <CalendarDays size={19} aria-hidden="true" />
            Join Us This Sunday
          </a>
          <SiteLink
            page="giving"
            onNavigate={onNavigate}
            className="hero-secondary"
          >
            <HeartHandshake size={19} aria-hidden="true" />
            Support the Church
          </SiteLink>
        </div>
        <ServiceCountdown />
      </div>
      <svg
        className="hero-wave"
        viewBox="0 0 1440 60"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
          fill="var(--church-cream)"
        />
      </svg>
    </section>
  );
}
