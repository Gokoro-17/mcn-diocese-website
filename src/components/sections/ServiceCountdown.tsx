import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { sundayCountdown } from "../../lib/serviceCountdown";

export default function ServiceCountdown() {
  const [remaining, setRemaining] = useState(() => sundayCountdown());
  useEffect(() => {
    const update = () => setRemaining(sundayCountdown());
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Mins", value: remaining.minutes },
    { label: "Secs", value: remaining.seconds },
  ];
  return (
    <div
      className="service-countdown"
      role="timer"
      aria-live="off"
      aria-label="Time until the next Sunday service at 7 AM West Africa Time"
    >
      <p className="countdown-heading">
        <Clock3 size={16} aria-hidden="true" />
        Next Sunday service
      </p>
      <dl className="countdown-units">
        {units.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{String(value).padStart(2, "0")}</dd>
          </div>
        ))}
      </dl>
      <p className="countdown-service-time">Sunday · 7:00 AM WAT</p>
    </div>
  );
}
