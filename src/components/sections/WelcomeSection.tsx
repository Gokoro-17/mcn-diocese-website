import { Clock3, MapPin } from "lucide-react";
import {
  contactInfo,
  serviceTimes,
  weeklyActivities,
} from "../../data/churchData";

const weekdayActivities = weeklyActivities.filter(
  (schedule) => schedule.day !== "Sunday",
);
const monthlySundays =
  weeklyActivities
    .find((schedule) => schedule.day === "Sunday")
    ?.activities.filter((activity) => "note" in activity) ?? [];

export default function WelcomeSection() {
  return (
    <section
      id="visit"
      className="site-section visit-section"
      aria-labelledby="visit-title"
    >
      <div className="site-container">
        <div className="section-heading">
          <div>
            <p className="site-eyebrow">You are welcome here</p>
            <h2 id="visit-title">Join us this Sunday.</h2>
          </div>
          <p>
            Come as you are. We look forward to worshipping with you at the
            Cathedral of Favour.
          </p>
        </div>
        <div className="visit-layout">
          <div className="visit-times">
            <h3>
              <Clock3 size={22} />
              Sunday gatherings
            </h3>
            <p className="quiet-label">All times are West Africa Time (WAT)</p>
            <ul>
              {serviceTimes.map((service) => (
                <li key={service.name}>
                  <span>{service.name}</span>
                  <strong>{service.time}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="visit-address">
            <h3>
              <MapPin size={22} />
              Find your way here
            </h3>
            <p>{contactInfo.address}</p>
            <a
              href={contactInfo.maps}
              target="_blank"
              rel="noreferrer"
              className="site-button-secondary"
            >
              Get directions
            </a>
          </div>
        </div>
        <details className="weekly-gatherings">
          <summary>Weekday gatherings & monthly services</summary>
          <div className="weekly-layout">
            {weekdayActivities.map((schedule) => (
              <article key={schedule.day}>
                <h3>{schedule.day}</h3>
                <ul>
                  {schedule.activities.map((activity) => (
                    <li key={activity.name}>
                      <span>{activity.name}</span>
                      <strong>{activity.time}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            {monthlySundays.length > 0 && (
              <article>
                <h3>First Sunday of the month</h3>
                <ul>
                  {monthlySundays.map((activity) => (
                    <li key={activity.name}>
                      <span>{activity.name}</span>
                      <strong>{activity.time}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        </details>
      </div>
    </section>
  );
}
