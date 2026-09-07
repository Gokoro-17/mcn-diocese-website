import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { bibleVerses, contactInfo } from "../../data/churchData";

export function BibleVerseSection() {
  const [verseIndex, setVerseIndex] = useState(() => new Date().getDay() % bibleVerses.length);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(true);

  const verse = bibleVerses[verseIndex];

  const changeVerse = (dir: number) => {
    setFade(false);
    setTimeout(() => {
      setVerseIndex((i) => (i + dir + bibleVerses.length) % bibleVerses.length);
      setFade(true);
    }, 300);
  };

  const handleCopy = () => {
    const text = `"${verse.verse}" (${verse.reference}, ${verse.version})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={17} />,
      url: `https://wa.me/?text=${encodeURIComponent(`"${verse.verse}" (${verse.reference})`)}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebookF size={15} />,
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(verse.verse)}`,
    },
  ];

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--church-navy) 0%, var(--church-navy-dark) 100%)",
      }}
    >
      {/* Big decorative quote mark */}
      <div
        className="absolute top-0 left-4 text-white/5 select-none pointer-events-none"
        style={{ fontSize: "300px", lineHeight: 1, fontFamily: "Playfair Display, serif" }}
      >
        "
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "var(--church-gold-light)" }}
          >
            Word for Today
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Daily Bible Verse
          </h2>
        </div>

        {/* Verse Card */}
        <div
          className="rounded-3xl p-10 md:p-14 text-center relative"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            transition: "opacity 0.3s ease",
            opacity: fade ? 1 : 0,
          }}
        >
          {/* Verse number indicator */}
          <div className="flex justify-center gap-1.5 mb-8">
            {bibleVerses.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setVerseIndex(i); setFade(true); }, 300); }}
                className="w-2 h-2 rounded-full transition-all"
                aria-label={`Show Bible verse ${i + 1}`}
                aria-current={i === verseIndex ? "true" : undefined}
                style={{
                  background: i === verseIndex ? "var(--church-gold-light)" : "rgba(255,255,255,0.25)",
                  transform: i === verseIndex ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <p
            className="text-xl md:text-2xl lg:text-3xl text-white leading-relaxed font-medium italic mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            "{verse.verse}"
          </p>

          <div
            className="text-base font-bold tracking-wide mb-8"
            style={{ color: "var(--church-gold-light)" }}
          >
            {verse.reference} ({verse.version})
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => changeVerse(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              aria-label="Previous Bible verse"
            >
              <ChevronLeft size={19} />
            </button>
            <span className="text-white/40 text-sm">
              {verseIndex + 1} / {bibleVerses.length}
            </span>
            <button
              onClick={() => changeVerse(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              aria-label="Next Bible verse"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{
                background: copied ? "var(--church-green)" : "rgba(255,255,255,0.15)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Verse</>}
            </button>

            {shareLinks.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "General enquiry", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = [
      "Hello, I am contacting The Methodist Cathedral of Favour through the website.",
      `Name: ${form.name}`,
      `Reason: ${form.reason}`,
      form.email ? `Email: ${form.email}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      "",
      form.message,
    ].filter(Boolean).join("\n");
    const destination = new URL(contactInfo.whatsapp);
    destination.searchParams.set("text", message);
    window.open(destination.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-20 md:py-28" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
            style={{ color: "var(--church-red)" }}
          >
            We'd Love to Hear From You
          </div>
          <h2
            className="text-3xl md:text-5xl font-bold section-title centered"
            style={{ color: "var(--church-navy)" }}
          >
            Get in Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <p className="text-gray-600 leading-relaxed mb-8 text-sm">
              Whether you have questions about our services, need prayer, want to join a ministry,
              or are visiting for the first time, our doors and our hearts are open.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={20} />, label: "Email Us", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
                { icon: <Phone size={20} />, label: "Call Us", value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
                { icon: <MapPin size={20} />, label: "Find Us", value: contactInfo.address, href: contactInfo.maps },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.label === "Find Us" ? "_blank" : undefined}
                  rel={c.label === "Find Us" ? "noreferrer" : undefined}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "rgba(200,16,46,0.1)" }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{c.label}</div>
                    <div className="text-sm font-medium text-gray-800 mt-0.5 group-hover:text-red-700 transition-colors">
                      {c.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8 flex gap-4">
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: "#1877F2" }}
              >
                <FaFacebookF size={17} /> Join Facebook Group
              </a>
              <a
                href={contactInfo.whatsappGroup}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: "#25D366" }}
              >
                <FaWhatsapp size={19} /> Join WhatsApp Group
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "var(--church-cream)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="space-y-5">
                <h3
                  className="text-xl font-bold mb-6"
                  style={{ fontFamily: "Playfair Display, serif", color: "var(--church-navy)" }}
                >
                  Send Us a Message
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+234..."
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="contact-reason">
                    How can we help? *
                  </label>
                  <select id="contact-reason" name="reason" value={form.reason} onChange={handleChange} className="form-input" required>
                    <option>General enquiry</option>
                    <option>Plan a visit</option>
                    <option>Prayer request</option>
                    <option>Join a ministry</option>
                    <option>Speak with a minister</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: "var(--church-red)" }}
                >
                  <span className="inline-flex items-center justify-center gap-2">Continue on WhatsApp <Send size={17} /></span>
                </button>
                <p className="text-center text-xs leading-5 text-gray-500">Your message will open in WhatsApp for you to review before sending.</p>
              </div>
          </form>
        </div>
      </div>
    </section>
  );
}
