import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Minus, Plus, Search, X } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import CommunityIntro from "../community/CommunityIntro";
import { hymnbook } from "../../data/hymnbook";
import {
  searchHymns,
  type HymnCollection,
  type HymnEdition,
  type HymnEntry,
} from "../../lib/hymns";

const EnglishHymnReader = lazy(() => import("../hymns/EnglishHymnReader"));

function HymnReader({ edition }: { edition: HymnEdition }) {
  const [collection, setCollection] = useState<HymnCollection | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(12);
  const [selected, setSelected] = useState<HymnEntry | null>(null);
  const [page, setPage] = useState(3);
  const [textSize, setTextSize] = useState(20);
  const readingHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(edition === "english" ? hymnbook.englishIndexUrl : hymnbook.efikUrl, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Book could not load");
        const result = await response.json();
        if (controller.signal.aborted) return;
        const book: HymnCollection =
          edition === "efik" ? { hymns: result } : result;
        setCollection(book);
        setSelected(book.hymns[0] ?? null);
        setError("");
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("The hymn list could not be loaded. Please try again.");
      });
    return () => controller.abort();
  }, [edition, attempt]);
  const matches = useMemo(
    () => searchHymns(collection?.hymns ?? [], query),
    [collection, query],
  );
  function selectHymn(hymn: HymnEntry) {
    setSelected(hymn);
    if (hymn.page) setPage(hymn.page);
    window.requestAnimationFrame(() => {
      readingHeading.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
      readingHeading.current?.focus({ preventScroll: true });
    });
  }
  return (
    <div className="hymn-reader-layout">
      <aside className="hymn-finder" aria-label="Find a hymn">
        <label htmlFor="hymn-search">Find a hymn</label>
        <div className="hymn-search-field">
          <Search size={19} />
          <input
            id="hymn-search"
            type="search"
            placeholder="Number or first words"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(12);
            }}
          />
        </div>
        <p className="hymn-search-help">
          {edition === "english"
            ? "Search a hymn number or its opening words."
            : "Search a number, opening words or a phrase in the hymn."}
        </p>
        {error ? (
          <div role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setAttempt(attempt + 1)}
              className="site-text-link mt-3"
            >
              Try again
            </button>
          </div>
        ) : !collection ? (
          <p role="status">Loading hymns…</p>
        ) : (
          <>
            <p className="hymn-result-count" aria-live="polite">
              {query
                ? `${matches.length} ${matches.length === 1 ? "hymn" : "hymns"} found`
                : "Browse the hymnbook"}
            </p>
            <div className="hymn-results">
              {matches.slice(0, limit).map((hymn) => (
                <button
                  type="button"
                  key={hymn.id}
                  onClick={() => selectHymn(hymn)}
                  aria-pressed={selected?.id === hymn.id}
                >
                  <span>{hymn.number}</span>
                  <strong>{hymn.title}</strong>
                  {hymn.page && <small>PDF page {hymn.page}</small>}
                </button>
              ))}
              {!matches.length && (
                <p className="py-4 text-base text-slate-600">
                  No matching hymn. Try a different number or a few words.
                </p>
              )}
              {matches.length > limit && (
                <button
                  type="button"
                  className="hymn-show-more"
                  onClick={() => setLimit(limit + 24)}
                >
                  Show more hymns
                </button>
              )}
            </div>
          </>
        )}
        <p className="hymn-numbering-note">
          Numbering follows the supplied books. Some source labels are missing
          or repeated; try the opening words if a number cannot be found.
        </p>
      </aside>
      <div className="hymn-reading-pane">
        <h3 ref={readingHeading} tabIndex={-1} className="hymn-reading-title">
          {selected
            ? `Hymn ${selected.number} · ${selected.title}`
            : edition === "english"
              ? "English Methodist Hymn Book"
              : "Efik Hymn Book"}
        </h3>
        {edition === "english" ? (
          <Suspense
            fallback={
              <p role="status" className="reader-message">
                Opening the English reader…
              </p>
            }
          >
            <EnglishHymnReader
              page={page}
              onPageChange={(next) => {
                setPage(next);
                setSelected(null);
              }}
            />
          </Suspense>
        ) : selected ? (
          <>
            <div className="efik-text-controls" aria-label="Efik text size">
              <span>Text size</span>
              <button
                type="button"
                disabled={textSize <= 18}
                onClick={() => setTextSize(textSize - 2)}
                aria-label="Decrease hymn text size"
              >
                <Minus size={18} />
              </button>
              <output aria-label="Hymn text size">{textSize}</output>
              <button
                type="button"
                disabled={textSize >= 30}
                onClick={() => setTextSize(textSize + 2)}
                aria-label="Increase hymn text size"
              >
                <Plus size={18} />
              </button>
            </div>
            <article
              lang="efi"
              className="efik-hymn-text"
              style={{ fontSize: `${textSize}px` }}
            >
              {selected.text?.split(/\n\s*\n/).map((stanza, i) => (
                <p key={i}>{stanza}</p>
              ))}
            </article>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function HymnsPage() {
  const [edition, setEdition] = useState<HymnEdition | null>(null);
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const englishOpener = useRef<HTMLButtonElement>(null);
  const efikOpener = useRef<HTMLButtonElement>(null);
  function openReader(next: HymnEdition) {
    setEdition(next);
    window.requestAnimationFrame(() => {
      readerHeading.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
      readerHeading.current?.focus({ preventScroll: true });
    });
  }
  function closeReader() {
    const opener = edition === "efik" ? efikOpener : englishOpener;
    setEdition(null);
    opener.current?.focus();
  }
  return (
    <>
      <CommunityIntro eyebrow="Worship resources" title="Methodist Hymns">
        <p>
          Our hymnbooks in English and Efik, ready to read wherever you are.
        </p>
      </CommunityIntro>
      <div className="site-container hymn-page">
        <section className="hymn-opening" aria-labelledby="hymnbook-title">
          <div>
            <h2 id="hymnbook-title">One faith. Two languages.</h2>
            <p className="reading-copy">
              Choose a hymnbook, find a hymn by number or opening words, and
              sing along with our church family.
            </p>
            <div className="hymn-edition-actions">
              <button
                ref={englishOpener}
                className="site-button"
                onClick={() => openReader("english")}
              >
                <BookOpen size={19} />
                Read in English
              </button>
              <button
                ref={efikOpener}
                className="site-button-secondary"
                onClick={() => openReader("efik")}
              >
                <BookOpen size={19} />
                Read in Efik
              </button>
            </div>
            <p className="reader-access-note">
              Both editions are available here without a sign-in. The English
              reader preserves the original PDF pages; the Efik edition has
              adjustable text.
            </p>
          </div>
          <aside className="hymn-app-panel" aria-labelledby="hymn-app-title">
            <p className="site-eyebrow">Keep it with you</p>
            <h2 id="hymn-app-title">Hymns on your phone.</h2>
            <p>Get {hymnbook.appName} for reading and listening offline.</p>
            <div className="app-store-links">
              <a
                href={hymnbook.appleUrl}
                target="_blank"
                rel="noreferrer"
                className="store-link"
                aria-label="Download Methodist Hymns Offline on the App Store"
              >
                <FaApple size={26} />
                <span>
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
              </a>
              <a
                href={hymnbook.androidUrl}
                target="_blank"
                rel="noreferrer"
                className="store-link"
                aria-label="Get Methodist Hymns Offline on Google Play"
              >
                <FaGooglePlay size={23} />
                <span>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </span>
              </a>
            </div>
            <p className="app-note">
              Published by {hymnbook.developer}. This separate app may use a
              different edition or hymn numbering.
            </p>
          </aside>
        </section>
        {edition && (
          <section className="hymn-reader" aria-labelledby="hymn-reader-title">
            <div className="reader-toolbar">
              <div>
                <h2 id="hymn-reader-title" ref={readerHeading} tabIndex={-1}>
                  {edition === "english"
                    ? "English Methodist Hymn Book"
                    : "Efik Hymn Book"}
                </h2>
              </div>
              <div className="reader-tools">
                <button
                  type="button"
                  onClick={closeReader}
                  aria-label="Close hymnbook reader"
                >
                  <X size={21} />
                </button>
              </div>
            </div>
            <div className="hymn-edition-switch" aria-label="Hymnbook language">
              <button
                type="button"
                aria-pressed={edition === "english"}
                onClick={() => setEdition("english")}
              >
                English
              </button>
              <button
                type="button"
                aria-pressed={edition === "efik"}
                onClick={() => setEdition("efik")}
              >
                Efik
              </button>
            </div>
            <HymnReader key={edition} edition={edition} />
          </section>
        )}
      </div>
    </>
  );
}
