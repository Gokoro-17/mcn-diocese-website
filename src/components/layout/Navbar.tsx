import { useState, useEffect } from "react";
import { HeartHandshake, Menu, Radio, UsersRound, X } from "lucide-react";
import mcnLogo from "../../assets/mcn-logo.jpg";
import { CHURCH_NAME, DENOMINATION_NAME } from "../../data/churchData";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Leadership", page: "leadership" },
  { label: "Gallery", page: "gallery" },
  { label: "Giving", page: "giving" },
];
const onlineLinks = [
  { label: "Watch live", page: "live", Icon: Radio },
  { label: "Prayer requests", page: "prayer", Icon: HeartHandshake },
  { label: "Members", page: "members", Icon: UsersRound },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  const handleVisit = () => {
    setMenuOpen(false);
    if (currentPage !== "home") onNavigate("home");
    window.setTimeout(() => {
      document.getElementById("visit")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, currentPage === "home" ? 0 : 260);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        aria-label="Primary navigation"
        className={`sticky top-0 z-50 transition-all duration-400 ${
          scrolled
            ? "shadow-2xl"
            : "shadow-md"
        }`}
        style={{
          background: scrolled
            ? "rgba(15, 27, 74, 0.98)"
            : "var(--church-navy)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleNav("home")}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-yellow-400 transition-colors shadow-lg">
                  <img
                    src={mcnLogo}
                    alt="Methodist Church Nigeria Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="max-w-[190px] text-left sm:max-w-none">
                <div
                  className="text-xs font-bold leading-tight text-white sm:text-sm"
                  style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.03em" }}
                >
                  {CHURCH_NAME}
                </div>
                <div
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: "var(--church-gold-light)" }}
                >
                  {DENOMINATION_NAME}
                </div>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`nav-link px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    currentPage === link.page
                      ? "text-white bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } ${currentPage === link.page ? "active" : ""}`}
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-current={currentPage === link.page ? "page" : undefined}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={handleVisit}
                className="ml-3 px-5 py-2.5 text-sm font-bold rounded-full text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{
                  background: "var(--church-red)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Plan a Visit
              </button>
            </div>

            {/* Hamburger */}
            <button
              className="flex p-2 text-white xl:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="xl:hidden mobile-menu-enter border-t border-white/10"
            style={{ background: "var(--church-navy-dark)" }}
          >
            <div className="px-4 py-4 space-y-1">
              {[...navLinks, ...onlineLinks].map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    currentPage === link.page
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-current={currentPage === link.page ? "page" : undefined}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => handleNav("giving")}
                  className="w-full py-3 text-sm font-bold rounded-full text-white transition-all"
                  style={{ background: "var(--church-red)" }}
                >
                  Give Online
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="border-t border-white/10 bg-black/10">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-3 sm:justify-between sm:px-6 lg:px-8">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 sm:block">Worship · Prayer · Fellowship</span>
            <div className="flex items-center gap-1 sm:gap-3">{onlineLinks.map(({ page, label, Icon }) => <button key={page} onClick={() => handleNav(page)} aria-current={currentPage === page ? "page" : undefined} className={`flex min-h-11 items-center gap-2 rounded px-2.5 text-[11px] font-semibold transition sm:text-xs ${currentPage === page ? "text-amber-200" : "text-white/75 hover:text-white"}`}><Icon size={14} />{label}</button>)}</div>
          </div>
        </div>
      </nav>
    </>
  );
}
