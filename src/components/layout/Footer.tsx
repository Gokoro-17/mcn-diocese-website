import { FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  CHURCH_NAME,
  DENOMINATION_NAME,
  contactInfo,
} from "../../data/churchData";
import SiteLink from "../navigation/SiteLink";

export default function Footer({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-layout">
          <div className="footer-introduction">
            <p className="footer-church-name">{CHURCH_NAME}</p>
            <p>
              {DENOMINATION_NAME}
              <br />
              Atamunu, Calabar · Cross River State
            </p>
            <div className="footer-socials">
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Join our Facebook group"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href={contactInfo.whatsappGroup}
                target="_blank"
                rel="noreferrer"
                aria-label="Join our WhatsApp group"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
          <nav aria-label="Footer church links">
            <h2>Our church</h2>
            <SiteLink page="about" onNavigate={onNavigate}>
              About us
            </SiteLink>
            <SiteLink page="leadership" onNavigate={onNavigate}>
              Leadership
            </SiteLink>
            <SiteLink page="giving" onNavigate={onNavigate}>
              Giving
            </SiteLink>
          </nav>
          <nav aria-label="Footer worship links">
            <h2>Stay connected</h2>
            <SiteLink page="live" onNavigate={onNavigate}>
              Watch live
            </SiteLink>
            <SiteLink page="hymns" onNavigate={onNavigate}>
              Methodist Hymns
            </SiteLink>
            <SiteLink page="prayer" onNavigate={onNavigate}>
              Request prayer
            </SiteLink>
            <SiteLink page="members" onNavigate={onNavigate}>
              Members portal
            </SiteLink>
          </nav>
          <div className="footer-contact">
            <h2>Get in touch</h2>
            <a href={`mailto:${contactInfo.email}`}>
              <Mail size={17} aria-hidden="true" />
              {contactInfo.email}
            </a>
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
              <Phone size={17} aria-hidden="true" />
              {contactInfo.phone}
            </a>
            <a href={contactInfo.maps} target="_blank" rel="noreferrer">
              <MapPin size={17} aria-hidden="true" />
              Directions to the church
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {CHURCH_NAME}
          </p>
          <SiteLink page="admin" onNavigate={onNavigate}>
            Content Admin
          </SiteLink>
        </div>
      </div>
    </footer>
  );
}
