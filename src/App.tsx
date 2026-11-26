import { useState, useEffect, useLayoutEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import LeadershipPage from "./components/pages/LeadershipPage";
import GalleryPage from "./components/pages/GalleryPage";
import GivingPage from "./components/pages/GivingPage";
import MinistryPage from "./components/pages/MinistryPage";
import AdminPage from "./components/admin/AdminPage";
import LivePage from "./components/pages/LivePage";
import PrayerPage from "./components/pages/PrayerPage";
import MembersPage from "./components/pages/MembersPage";
import HymnsPage from "./components/pages/HymnsPage";
import { sitePaths, type SitePage } from "./lib/navigation";
import { ministries } from "./data/churchData";
import "./index.css";

type StaticPage = SitePage;
type Page = SitePage | "ministry";
const pathByPage = sitePaths;

const pageMeta: Record<Page, { title: string; description: string }> = {
  hymns: {
    title: "Methodist Hymns | The Methodist Cathedral of Favour",
    description:
      "Read our English and Efik Methodist hymnbooks online and find the Methodist Hymns app for iPhone and Android.",
  },
  live: {
    title: "Watch Live | The Methodist Cathedral of Favour",
    description:
      "Join our online worship and find upcoming broadcasts from the Cathedral of Favour.",
  },
  prayer: {
    title: "Prayer Requests | The Methodist Cathedral of Favour",
    description: "Share a private prayer request with the church.",
  },
  members: {
    title: "Members Portal | The Methodist Cathedral of Favour",
    description:
      "Your personal church profile, prayer history, worship services, and events.",
  },
  home: {
    title: "The Methodist Cathedral of Favour | Calabar",
    description:
      "Worship, fellowship, sermons, events, and community at The Methodist Cathedral of Favour in Calabar, Nigeria.",
  },
  about: {
    title: "About Us | The Methodist Cathedral of Favour",
    description:
      "Explore the local story, documented milestones, beliefs, and church life of the Cathedral of Favour at 79 Atamunu Street, Calabar.",
  },
  leadership: {
    title: "Church Leadership | The Methodist Cathedral of Favour",
    description:
      "Meet the ministers and leaders serving The Methodist Cathedral of Favour.",
  },
  gallery: {
    title: "Gallery | The Methodist Cathedral of Favour",
    description:
      "View worship services, choir ministrations, events, and community moments from our church.",
  },
  giving: {
    title: "Giving | The Methodist Cathedral of Favour",
    description:
      "Learn how to support the worship, outreach, missions, and community work of our church.",
  },
  ministry: {
    title: "Church Ministry | The Methodist Cathedral of Favour",
    description:
      "Explore a ministry of The Methodist Cathedral of Favour and find out how to get involved.",
  },
  admin: {
    title: "Content Administration | The Methodist Cathedral of Favour",
    description:
      "Secure content administration for approved church administrators.",
  },
};

function pageFromPath(): Page {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (
    path.startsWith("/ministries/") &&
    ministries.some((ministry) => `/ministries/${ministry.slug}` === path)
  )
    return "ministry";
  const match = (Object.entries(pathByPage) as Array<[Page, string]>).find(
    ([, value]) => value === path,
  );
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
  const activeMinistry =
    currentPage === "ministry" ? ministryFromPath(routePath) : undefined;

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (routePath === "/" && window.location.hash) {
      const section = document.getElementById(window.location.hash.slice(1));
      if (section) {
        section.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
    }
    // Reset after the new page renders, before it is painted, overriding smooth scrolling.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [routePath]);

  const navigateTo = (nextPage: Page, path: string) => {
    if (nextPage === currentPage && window.location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    setPageVisible(false);
    setTimeout(() => {
      setCurrentPage(nextPage);
      window.history.pushState({}, "", path);
      setRoutePath(path);
      setPageVisible(true);
    }, 200);
  };

  const handleNavigate = (page: string) => {
    if (!Object.hasOwn(pathByPage, page)) return;
    const nextPage = page as StaticPage;
    navigateTo(nextPage, pathByPage[nextPage]);
  };

  const handleOpenMinistry = (slug: string) => {
    if (!ministries.some((ministry) => ministry.slug === slug)) return;
    navigateTo("ministry", `/ministries/${slug}`);
  };

  const handleBackToMinistries = () => {
    handleNavigate("home");
    window.setTimeout(
      () =>
        document
          .getElementById("ministries")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      260,
    );
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pageFromPath());
      setRoutePath(window.location.pathname);
      setPageVisible(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const meta = activeMinistry
      ? {
          title: `${activeMinistry.name} | The Methodist Cathedral of Favour`,
          description: activeMinistry.description,
        }
      : pageMeta[currentPage];
    document.title = meta.title;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    description?.setAttribute("content", meta.description);
  }, [activeMinistry, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenMinistry={handleOpenMinistry}
          />
        );
      case "about":
        return <AboutPage />;
      case "leadership":
        return <LeadershipPage />;
      case "gallery":
        return <GalleryPage />;
      case "giving":
        return <GivingPage />;
      case "ministry": {
        return activeMinistry ? (
          <MinistryPage
            ministry={activeMinistry}
            onBack={handleBackToMinistries}
            onOpenMinistry={handleOpenMinistry}
          />
        ) : (
          <HomePage
            onNavigate={handleNavigate}
            onOpenMinistry={handleOpenMinistry}
          />
        );
      }
      case "admin":
        return <AdminPage />;
      case "live":
        return <LivePage onNavigate={handleNavigate} />;
      case "prayer":
        return <PrayerPage onNavigate={handleNavigate} />;
      case "members":
        return <MembersPage onNavigate={handleNavigate} />;
      case "hymns":
        return <HymnsPage />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenMinistry={handleOpenMinistry}
          />
        );
    }
  };

  if (currentPage === "admin") return <AdminPage />;

  return (
    <div
      className="site-public min-h-screen flex flex-col"
      style={{ background: "var(--church-cream)" }}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
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
