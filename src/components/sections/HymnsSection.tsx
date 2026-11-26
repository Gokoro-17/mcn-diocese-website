import { BookOpen } from "lucide-react";
import SiteLink from "../navigation/SiteLink";

export default function HymnsSection({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <section
      className="hymn-feature site-section"
      aria-labelledby="hymn-feature-title"
    >
      <div className="site-container hymn-feature-inner">
        <div>
          <p className="site-eyebrow">Sing with us</p>
          <h2 id="hymn-feature-title">
            The hymns we carry
            <br />
            through the week.
          </h2>
          <p className="reading-copy">
            Read our English and Efik hymnbooks online, or find the offline app
            for your phone.
          </p>
          <SiteLink
            page="hymns"
            onNavigate={onNavigate}
            className="site-button"
          >
            <BookOpen size={19} />
            Open Methodist Hymns
          </SiteLink>
        </div>
        <div className="hymn-book-icon" aria-hidden="true">
          <BookOpen />
        </div>
      </div>
    </section>
  );
}
