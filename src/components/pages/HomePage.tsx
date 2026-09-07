import Hero from "../sections/Hero";
import WelcomeSection from "../sections/WelcomeSection";
import SermonsSection from "../sections/SermonsSection";
import EventsSection from "../sections/EventsSection";
import MinistriesSection from "../sections/MinistriesSection";
import { BibleVerseSection, ContactSection } from "../sections/InteractiveSections";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenMinistry: (slug: string) => void;
}

export default function HomePage({ onNavigate, onOpenMinistry }: HomePageProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <WelcomeSection />
      <SermonsSection />
      <EventsSection />
      <MinistriesSection onOpenMinistry={onOpenMinistry} />
      <BibleVerseSection />
      <ContactSection />
    </div>
  );
}
