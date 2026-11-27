import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Home,
  Images,
  Info,
  Menu,
  Radio,
  UsersRound,
  X,
} from "lucide-react";
import { FaHandsPraying } from "react-icons/fa6";
import mcnLogo from "../../assets/mcn-logo.jpg";
import { CHURCH_NAME } from "../../data/churchData";
import type { SitePage } from "../../lib/navigation";
import SiteLink from "../navigation/SiteLink";

const primaryLinks = [
  { page: "home", label: "Home", Icon: Home },
  { page: "about", label: "About", Icon: Info },
  { page: "leadership", label: "Leadership", Icon: UsersRound },
  { page: "gallery", label: "Gallery", Icon: Images },
  { page: "hymns", label: "Hymnbook", Icon: BookOpen },
  { page: "giving", label: "Giving", Icon: HeartHandshake },
] satisfies { page: SitePage; label: string; Icon: typeof Home }[];
const onlineLinks = [
  { page: "live", label: "Watch live", Icon: Radio },
  { page: "prayer", label: "Prayer requests", Icon: FaHandsPraying },
  { page: "members", label: "Members", Icon: UsersRound },
] as const;

export default function Navbar({
  currentPage,
  onNavigate,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = menuDialog.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    else if (!menuOpen && dialog.open) dialog.close();
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnResize);
    };
  }, [menuOpen]);
  function navigate(page: string) {
    setMenuOpen(false);
    onNavigate(page);
  }
  return (
    <>
      <header className="site-header">
        <div className="site-container header-inner">
          <SiteLink
            page="home"
            onNavigate={navigate}
            className="site-brand"
            aria-label={`${CHURCH_NAME} — home`}
          >
            <img src={mcnLogo} alt="" width={56} height={56} />
          </SiteLink>
          <nav className="desktop-navigation" aria-label="Main navigation">
            {primaryLinks.map(({ page, label, Icon }) => (
              <SiteLink
                key={page}
                page={page}
                onNavigate={navigate}
                aria-current={currentPage === page ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </SiteLink>
            ))}
            <a href="/#visit" className="site-button">
              <CalendarDays size={17} aria-hidden="true" />
              Plan a visit
            </a>
          </nav>
          <button
            className="mobile-menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            aria-label="Open navigation menu"
          >
            <Menu size={27} />
          </button>
        </div>
      </header>
      <dialog
        ref={menuDialog}
        id="site-mobile-menu"
        className="mobile-navigation-dialog"
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-navigation-content">
          <div className="mobile-menu-top">
            <h2 id="mobile-menu-title">Explore our church</h2>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <X size={25} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <div className="mobile-nav-group">
              <p>Our church</p>
              {primaryLinks
                .filter(({ page }) => page !== "hymns")
                .map(({ page, label, Icon }) => (
                  <SiteLink
                    key={page}
                    page={page}
                    onNavigate={navigate}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {label}
                  </SiteLink>
                ))}
              <a href="/#ministries" onClick={() => setMenuOpen(false)}>
                <UsersRound size={20} aria-hidden="true" />
                Ministries
              </a>
            </div>
            <div className="mobile-nav-group">
              <p>Worship &amp; care</p>
              <SiteLink
                page="hymns"
                onNavigate={navigate}
                aria-current={currentPage === "hymns" ? "page" : undefined}
              >
                <BookOpen size={20} aria-hidden="true" />
                Methodist Hymns
              </SiteLink>
              {onlineLinks.map(({ page, label, Icon }) => (
                <SiteLink
                  key={page}
                  page={page}
                  onNavigate={navigate}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </SiteLink>
              ))}
            </div>
            <a
              href="/#visit"
              className="site-button"
              onClick={() => setMenuOpen(false)}
            >
              <CalendarDays size={18} aria-hidden="true" />
              Plan your visit
            </a>
          </nav>
        </div>
      </dialog>
    </>
  );
}
