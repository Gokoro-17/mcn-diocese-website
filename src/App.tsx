import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import LeadershipPage from "./components/pages/LeadershipPage";
import GalleryPage from "./components/pages/GalleryPage";
import GivingPage from "./components/pages/GivingPage";
import MinistryPage from "./components/pages/MinistryPage";
import AdminPage from "./components/admin/AdminPage";
import { ministries } from "./data/churchData";
import "./index.css";

type Page = "home" | "about" | "leadership" | "gallery" | "giving" | "ministry" | "admin";
type StaticPage = Exclude<Page, "ministry">;

const pathByPage: Record<StaticPage, string> = {
  home: "/",
  about: "/about",
  leadership: "/leadership",
  gallery: "/gallery",
  giving: "/giving",
  admin: "/admin",
};

const pageMeta: Record<Page, { title: string; description: string }> = {
  home: {
    title: "The Methodist Cathedral of Favour | Calabar",
    description: "Worship, fellowship, sermons, events, and community at The Methodist Cathedral of Favour in Calabar, Nigeria.",
  },
  about: {
    title: "About Us | The Methodist Cathedral of Favour",
    description: "Discover our Methodist heritage, beliefs, mission, and ministry in Calabar.",
  },
  leadership: {
    title: "Church Leadership | The Methodist Cathedral of Favour",
    description: "Meet the ministers and leaders serving The Methodist Cathedral of Favour.",
  },
  gallery: {
    title: "Gallery | The Methodist Cathedral of Favour",
    description: "View worship services, choir ministrations, events, and community moments from our church.",
  },
  giving: {
    title: "Giving | The Methodist Cathedral of Favour",
    description: "Learn how to support the worship, outreach, missions, and community work of our church.",
  },
  ministry: {
    title: "Church Ministry | The Methodist Cathedral of Favour",
    description: "Explore a ministry of The Methodist Cathedral of Favour and find out how to get involved.",
  },
  admin: {
    title: "Content Administration | The Methodist Cathedral of Favour",
    description: "Secure content administration for approved church administrators.",
  },
};

function pageFromPath(): Page {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path.startsWith("/ministries/") && ministries.some((ministry) => `/ministries/${ministry.slug}` === path)) return "ministry";
  const match = (Object.entries(pathByPage) as Array<[Page, string]>).find(([, value]) => value === path);
  return match?.[0] ?? "home";
}

function ministryFromPath(pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, "");
  return ministries.find((ministry) => `/ministries/${ministry.slug}` === path);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(pageFromPath);
  const [pageVisible, setPageVisible] = useState(true);
  const [routePath, setRoutePath] = useState(window.location.pathname);
  const activeMinistry = currentPage === "ministry" ? ministryFromPath(routePath) : undefined;

  const navigateTo = (nextPage: Page, path: string) => {
    if (nextPage === currentPage && window.location.pathname === path) return;
    setPageVisible(false);
    setTimeout(() => {
      setCurrentPage(nextPage);
      window.history.pushState({}, "", path);
      setRoutePath(path);
      setPageVisible(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  const handleNavigate = (page: string) => {
    if (!(page in pathByPage)) return;
    const nextPage = page as StaticPage;
    navigateTo(nextPage, pathByPage[nextPage]);
  };

  const handleOpenMinistry = (slug: string) => {
    if (!ministries.some((ministry) => ministry.slug === slug)) return;
    navigateTo("ministry", `/ministries/${slug}`);
  };

  const handleBackToMinistries = () => {
    handleNavigate("home");
    window.setTimeout(() => document.getElementById("ministries")?.scrollIntoView({ behavior: "smooth", block: "start" }), 260);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pageFromPath());
      setRoutePath(window.location.pathname);
      setPageVisible(true);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const meta = activeMinistry ? {
      title: `${activeMinistry.name} | The Methodist Cathedral of Favour`,
      description: activeMinistry.description,
    } : pageMeta[currentPage];
    document.title = meta.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute("content", meta.description);
  }, [activeMinistry, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":      return <HomePage onNavigate={handleNavigate} onOpenMinistry={handleOpenMinistry} />;
      case "about":     return <AboutPage />;
      case "leadership":return <LeadershipPage />;
      case "gallery":   return <GalleryPage />;
      case "giving":    return <GivingPage />;
      case "ministry": {
        return activeMinistry ? <MinistryPage ministry={activeMinistry} onBack={handleBackToMinistries} onOpenMinistry={handleOpenMinistry} /> : <HomePage onNavigate={handleNavigate} onOpenMinistry={handleOpenMinistry} />;
      }
      case "admin":     return <AdminPage />;
      default:          return <HomePage onNavigate={handleNavigate} onOpenMinistry={handleOpenMinistry} />;
    }
  };

  if (currentPage === "admin") return <AdminPage />;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--church-cream)" }}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 transition-opacity duration-200"
        style={{ opacity: pageVisible ? 1 : 0 }}
      >
        {renderPage()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
