import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import mcnLogo from "../../assets/mcn-logo.jpg";
import { CHURCH_NAME, DENOMINATION_NAME, TAGLINE, contactInfo, serviceTimes } from "../../data/churchData";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  const scrollAndNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "var(--church-navy-dark)", color: "rgba(255,255,255,0.85)" }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                <img src={mcnLogo} alt="MCN Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-white text-sm" style={{ fontFamily: "Playfair Display, serif" }}>
                  {CHURCH_NAME}
                </div>
                <div className="text-xs" style={{ color: "var(--church-gold-light)" }}>{DENOMINATION_NAME}</div>
              </div>
            </div>
            <div
              className="text-sm font-semibold italic"
              style={{ color: "var(--church-gold-light)" }}
            >
              "{TAGLINE}"
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-5">
              <a href={contactInfo.facebook} target="_blank" rel="noreferrer" aria-label="Join our Facebook group" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-all hover:scale-110"><FaFacebookF size={17} /></a>
              <a href={contactInfo.whatsappGroup} target="_blank" rel="noreferrer" aria-label="Join our WhatsApp group" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-all hover:scale-110"><FaWhatsapp size={19} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-base font-bold text-white mb-5 pb-2"
              style={{
                fontFamily: "Playfair Display, serif",
                borderBottom: "2px solid var(--church-red)",
                display: "inline-block",
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", page: "home" },
                { label: "About Us", page: "about" },
                { label: "Leadership", page: "leadership" },
                { label: "Gallery", page: "gallery" },
                { label: "Giving", page: "giving" },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => scrollAndNav(link.page)}
                    className="text-sm text-white/70 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <ChevronRight size={14} style={{ color: "var(--church-red)" }} />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4
              className="text-base font-bold text-white mb-5 pb-2"
              style={{
                fontFamily: "Playfair Display, serif",
                borderBottom: "2px solid var(--church-red)",
                display: "inline-block",
              }}
            >
              Service Times
            </h4>
            <ul className="space-y-3.5">
              {serviceTimes.map((s, i) => (
                <li key={i} className="text-sm">
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-white/60 text-xs mt-0.5">{s.day} · {s.time}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="text-base font-bold text-white mb-5 pb-2"
              style={{
                fontFamily: "Playfair Display, serif",
                borderBottom: "2px solid var(--church-red)",
                display: "inline-block",
              }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} style={{ color: "var(--church-gold-light)" }} className="mt-0.5 shrink-0" />
                <span className="text-white/70 text-xs leading-relaxed">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} style={{ color: "var(--church-gold-light)" }} className="shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="text-white/70 hover:text-white transition-colors text-xs">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} style={{ color: "var(--church-gold-light)" }} className="shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="text-white/70 hover:text-white transition-colors text-xs">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
              <iframe title="Street View of the Methodist Cathedral of Favour" src={contactInfo.mapEmbed} className="h-40 w-full border-0" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
              <a href={contactInfo.maps} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white/75 transition hover:bg-white/10 hover:text-white"><MapPin size={15} /> Open in Google Maps</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="py-5 text-center text-xs text-white/50"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {year} {CHURCH_NAME} · {DENOMINATION_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => scrollAndNav("admin")} className="text-white/30 transition-colors hover:text-white/70">Content Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
