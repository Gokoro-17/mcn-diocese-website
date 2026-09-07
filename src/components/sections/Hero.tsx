import { useState, useEffect, useCallback, useMemo } from "react";
import { Cross } from "lucide-react";
import mcnLogo from "../../assets/mcn-logo.jpg";

const heroSlides = [
  {
    id: 1,
    title: "Welcome to the Cathedral of Favour",
    subtitle: "A Place of Worship, Fellowship & Spiritual Growth",
    cta: "Join Us This Sunday",
    bg: "linear-gradient(135deg, #0F1B4A 0%, #1B2A6B 40%, #9B0C23 100%)",
    pattern: "church",
  },
  {
    id: 2,
    title: "Worthy is the Lamb",
    subtitle: "Rooted in Faith · Growing in Grace · Serving with Love",
    cta: "Learn About Us",
    bg: "linear-gradient(135deg, #9B0C23 0%, #C8102E 40%, #1B2A6B 100%)",
    pattern: "cross",
  },
  {
    id: 3,
    title: "Come & Experience God",
    subtitle: "Every Sunday is a New Opportunity to Encounter the Living God",
    cta: "Our Service Times",
    bg: "linear-gradient(135deg, #1B2A6B 0%, #0F1B4A 50%, #B8960C 100%)",
    pattern: "wave",
  },
];

function getNextSunday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const isBeforeTodaysService = dayOfWeek === 0 && now.getHours() < 7;
  const daysUntilSunday = isBeforeTodaysService ? 0 : dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(7, 0, 0, 0);
  return nextSunday;
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const nextSunday = useMemo(() => getNextSunday(), []);
  const countdown = useCountdown(nextSunday);

  const goToSlide = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 500);
  }, [transitioning]);

  useEffect(() => {
    const id = setInterval(() => {
      goToSlide((current + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [current, goToSlide]);

  const slide = heroSlides[current];

  const pad = (n: number) => String(n).padStart(2, "0");

  const handlePrimaryAction = () => {
    if (current === 1) {
      onNavigate("about");
      return;
    }
    document.getElementById("visit")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden md:min-h-[760px]"
      style={{ background: slide.bg, transition: "background 0.8s ease" }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative crosses */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/5 select-none"
            style={{
              top: `${10 + i * 12}%`,
              left: `${(i * 13) % 100}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${40 + (i % 3) * 20}px`,
            }}
          >
            <Cross size={40 + (i % 3) * 20} strokeWidth={1.2} />
          </div>
        ))}
        {/* Subtle radial overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-10 text-center md:pb-36 md:pt-14">
        {/* Logo */}
        <div
          className={`mb-6 transition-all duration-700 ${transitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          <div
            className="w-24 h-24 rounded-full overflow-hidden mx-auto shadow-2xl"
            style={{ border: "3px solid rgba(255,255,255,0.3)" }}
          >
            <img src={mcnLogo} alt="MCN Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Slide text */}
        <div
          className={`transition-all duration-700 ${transitioning ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"}`}
        >
          <div
            className="text-xs uppercase tracking-[0.3em] mb-3 font-semibold"
            style={{ color: "var(--church-gold-light)" }}
          >
            The Methodist Cathedral of Favour · Methodist Church Nigeria
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "Playfair Display, serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrimaryAction}
              className="px-8 py-3.5 text-sm font-bold text-white rounded-full transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: "var(--church-red)" }}
            >
              {slide.cta}
            </button>
            <button
              onClick={() => onNavigate("giving")}
              className="px-8 py-3.5 text-sm font-bold rounded-full transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              Support the Church
            </button>
          </div>
        </div>

        {/* Countdown to Sunday */}
        <div className="mt-12">
          <div className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">
            Next Sunday Service
          </div>
          <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3" aria-label="Time remaining until the next Sunday service">
            {[
              { label: "Days", value: pad(countdown.days) },
              { label: "Hours", value: pad(countdown.hours) },
              { label: "Mins", value: pad(countdown.minutes) },
              { label: "Secs", value: pad(countdown.seconds) },
            ].map((item) => (
              <div key={item.label} className="countdown-box">
                  <div
                    className="text-2xl md:text-3xl font-bold text-white"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.value}
                  </div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-white/50 text-xs mt-3">
            Sunday Service begins at 7:00 AM
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-24">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="transition-all duration-300"
            aria-label={`Show welcome message ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
            style={{
              width: i === current ? "32px" : "10px",
              height: "10px",
              borderRadius: "5px",
              background: i === current ? "var(--church-red)" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
            fill="var(--church-cream)"
          />
        </svg>
      </div>
    </section>
  );
}
