import Hero from "../sections/Hero";
import WelcomeSection from "../sections/WelcomeSection";
import SermonsSection from "../sections/SermonsSection";
import EventsSection from "../sections/EventsSection";
import MinistriesSection from "../sections/MinistriesSection";
import HymnsSection from "../sections/HymnsSection";
import {
  BibleVerseSection,
  ContactSection,
} from "../sections/InteractiveSections";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenMinistry: (slug: string) => void;
}

export default function HomePage({
  onNavigate,
  onOpenMinistry,
}: HomePageProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <WelcomeSection />
      <SermonsSection />
      <EventsSection />
      <MinistriesSection onOpenMinistry={onOpenMinistry} />
      <HymnsSection onNavigate={onNavigate} />
      <BibleVerseSection />
      <ContactSection onNavigate={onNavigate} />
    </div>
  );
}
