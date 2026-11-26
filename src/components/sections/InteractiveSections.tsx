import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  Phone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { bibleVerses, contactInfo } from "../../data/churchData";
import SiteLink from "../navigation/SiteLink";

export function BibleVerseSection() {
  const [verseIndex, setVerseIndex] = useState(
    () => new Date().getDay() % bibleVerses.length,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const verse = bibleVerses[verseIndex];
  function changeVerse(direction: number) {
    setVerseIndex(
      (index) => (index + direction + bibleVerses.length) % bibleVerses.length,
    );
    setCopied(false);
    setCopyError("");
  }
  async function copyVerse() {
    try {
      await navigator.clipboard.writeText(
        `${verse.verse} (${verse.reference}, ${verse.version})`,
      );
      setCopied(true);
      setCopyError("");
    } catch {
      setCopyError("Please select the verse text to copy it.");
    }
  }
  return (
    <section
      className="daily-verse site-section"
      aria-labelledby="daily-verse-title"
    >
      <div className="site-container verse-layout">
        <div>
          <h2 id="daily-verse-title">Daily Bible Verse</h2>
          <p>A quiet moment in God's Word.</p>
        </div>
        <div>
          <div aria-live="polite">
            <blockquote>{verse.verse}</blockquote>
            <p className="verse-reference">
              {verse.reference} · {verse.version}
            </p>
          </div>
          <div className="verse-controls">
            <div className="verse-pagination">
              <button
                onClick={() => changeVerse(-1)}
                aria-label="Previous Bible verse"
              >
                <ChevronLeft size={21} />
              </button>
              <span>
                {verseIndex + 1} / {bibleVerses.length}
              </span>
              <button
                onClick={() => changeVerse(1)}
                aria-label="Next Bible verse"
              >
                <ChevronRight size={21} />
              </button>
            </div>
            <button onClick={() => void copyVerse()} className="verse-action">
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : "Copy verse"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${verse.verse} (${verse.reference})`)}`}
              target="_blank"
              rel="noreferrer"
              className="verse-action"
            >
              <FaWhatsapp size={18} />
              Share
            </a>
          </div>
          {copyError && <p role="status">{copyError}</p>}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "General enquiry",
    message: "",
  });
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) =>
    setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello, I am contacting The Methodist Cathedral of Favour through the website.",
      `Name: ${form.name}`,
      `Reason: ${form.reason}`,
      form.email ? `Email: ${form.email}` : "",
      form.phone ? `Phone: ${form.phone}` : "",
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    const destination = new URL(contactInfo.whatsapp);
    destination.searchParams.set("text", message);
    window.open(destination.toString(), "_blank", "noopener,noreferrer");
  }
  return (
    <section
      id="contact"
      className="site-section contact-section"
      aria-labelledby="contact-title"
    >
      <div className="site-container contact-layout">
        <div>
          <p className="site-eyebrow">Let's talk</p>
          <h2 id="contact-title">
            We'd love to hear
            <br />
            from you.
          </h2>
          <p className="reading-copy">
            Planning a visit or looking to get involved? Get in touch and we'll
            help you find your place.
          </p>
          <div className="contact-methods">
            <a href={`mailto:${contactInfo.email}`}>
              <Mail size={22} />
              <span>
                <small>Email the church</small>
                <strong>{contactInfo.email}</strong>
              </span>
            </a>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
              <Phone size={22} />
              <span>
                <small>Call us</small>
                <strong>{contactInfo.phone}</strong>
              </span>
            </a>
          </div>
          <div className="prayer-contact">
            <h3>How can we pray with you?</h3>
            <p>
              Share a private prayer request through our dedicated prayer page.
            </p>
            <SiteLink
              page="prayer"
              onNavigate={onNavigate}
              className="site-text-link"
            >
              Request prayer
            </SiteLink>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <h3>Send a message</h3>
          <div className="contact-form-fields">
            <label htmlFor="contact-name">
              Full name
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                autoComplete="name"
                required
              />
            </label>
            <div className="contact-field-row">
              <label htmlFor="contact-email">
                Email <span>(optional)</span>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                />
              </label>
              <label htmlFor="contact-phone">
                Phone <span>(optional)</span>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="tel"
                />
              </label>
            </div>
            <label htmlFor="contact-reason">
              How can we help?
              <select
                id="contact-reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="form-input"
              >
                <option>General enquiry</option>
                <option>Plan a visit</option>
                <option>Join a ministry</option>
                <option>Speak with a minister</option>
              </select>
            </label>
            <label htmlFor="contact-message">
              Message
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="form-input"
                required
              />
            </label>
            <button type="submit" className="site-button">
              Continue on WhatsApp
            </button>
            <p className="form-note">
              WhatsApp will open with your message so you can review it before
              sending.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
