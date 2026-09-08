import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";

export interface FullscreenMediaItem {
  id: string | number;
  title: string;
  category?: string;
  description?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  thumbnailUrl?: string | null;
}

interface FullscreenMediaViewerProps {
  items: FullscreenMediaItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const INFO_VISIBLE_MS = 4000;
const SWIPE_DISTANCE = 48;

export default function FullscreenMediaViewer({
  items,
  activeIndex,
  onIndexChange,
  onClose,
}: FullscreenMediaViewerProps) {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const hideDetailsTimer = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const ignoredClickAfterSwipe = useRef(false);
  const item = items[activeIndex];
  const hasMultipleItems = items.length > 1;

  const scheduleDetailsHide = useCallback(() => {
    if (hideDetailsTimer.current !== null) {
      window.clearTimeout(hideDetailsTimer.current);
    }
    hideDetailsTimer.current = window.setTimeout(() => {
      setDetailsVisible(false);
    }, INFO_VISIBLE_MS);
  }, []);

  const showDetails = useCallback(() => {
    setDetailsVisible(true);
    scheduleDetailsHide();
  }, [scheduleDetailsHide]);

  const move = useCallback((direction: number) => {
    if (!hasMultipleItems) return;
    onIndexChange((activeIndex + direction + items.length) % items.length);
    showDetails();
  }, [activeIndex, hasMultipleItems, items.length, onIndexChange, showDetails]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scheduleDetailsHide();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (hideDetailsTimer.current !== null) {
        window.clearTimeout(hideDetailsTimer.current);
      }
    };
  }, [move, onClose, scheduleDetailsHide]);

  if (!item) return null;

  const handleViewerClick = () => {
    if (ignoredClickAfterSwipe.current) {
      ignoredClickAfterSwipe.current = false;
      return;
    }

    if (detailsVisible) {
      setDetailsVisible(false);
      if (hideDetailsTimer.current !== null) {
        window.clearTimeout(hideDetailsTimer.current);
      }
    } else {
      showDetails();
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const horizontalDistance = touch.clientX - touchStart.current.x;
    const verticalDistance = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (
      Math.abs(horizontalDistance) >= SWIPE_DISTANCE
      && Math.abs(horizontalDistance) > Math.abs(verticalDistance)
    ) {
      ignoredClickAfterSwipe.current = true;
      move(horizontalDistance < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] h-[100dvh] w-screen touch-pan-y select-none overflow-hidden bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "Full screen media viewer"}
      onClick={handleViewerClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-full w-full items-center justify-center">
        {item.mediaUrl ? (
          item.mediaType === "video" ? (
            <video
              key={String(item.id)}
              src={item.mediaUrl}
              poster={item.thumbnailUrl ?? undefined}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              key={String(item.id)}
              src={item.mediaUrl}
              alt={item.title}
              className="h-full w-full object-contain"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <ImageIcon size={90} />
          </div>
        )}
      </div>

      <button
        type="button"
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition hover:bg-black/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close full screen viewer"
      >
        <X size={24} />
      </button>

      {hasMultipleItems && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5 sm:h-12 sm:w-12"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="View previous item"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:h-12 sm:w-12"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="View next item"
          >
            <ChevronRight size={28} />
          </button>
          <div className="pointer-events-none absolute left-1/2 top-[max(1.25rem,env(safe-area-inset-top))] z-20 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold tracking-wide text-white/85 backdrop-blur-sm">
            {activeIndex + 1} of {items.length}
          </div>
        </>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 transition-all duration-300 sm:px-8 md:px-12 ${
          detailsVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        aria-hidden={!detailsVisible}
      >
        <div className="mx-auto max-w-5xl">
          {item.category && (
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              {item.category}
            </div>
          )}
          {item.title && (
            <h2 className="mt-1 text-xl font-bold sm:text-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
              {item.title}
            </h2>
          )}
          {item.description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75 sm:text-base">
              {item.description}
            </p>
          )}
          <p className="mt-3 text-xs text-white/45">
            Tap to show or hide details{hasMultipleItems ? ". Swipe to view the next item." : "."}
          </p>
        </div>
      </div>
    </div>
  );
}
