import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Minus,
  Plus,
} from "lucide-react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type RenderTask,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import { hymnbook } from "../../data/hymnbook";

GlobalWorkerOptions.workerSrc = workerUrl;

export default function EnglishHymnReader({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(700);
  const [error, setError] = useState("");
  const [renderedPage, setRenderedPage] = useState(0);
  const [pageText, setPageText] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const task = getDocument({
      url: hymnbook.englishPdfUrl,
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      useWasm: false,
    });
    let active = true;
    task.promise
      .then((pdf) => {
        if (active) setDocument(pdf);
      })
      .catch(() => {
        if (active)
          setError(
            "The book could not be loaded. You can still open the original PDF below.",
          );
      });
    return () => {
      active = false;
      void task.destroy();
    };
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!document) return;
    let active = true;
    let renderTask: RenderTask | undefined;
    document
      .getPage(page)
      .then(async (pdfPage) => {
        if (!active || !canvas.current) return;
        const element = canvas.current;
        const context = element.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");
        const base = pdfPage.getViewport({ scale: 1 });
        const scaled = pdfPage.getViewport({
          scale: (width / base.width) * zoom,
        });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        element.width = Math.floor(scaled.width * outputScale);
        element.height = Math.floor(scaled.height * outputScale);
        element.style.width = `${scaled.width}px`;
        element.style.height = `${scaled.height}px`;
        renderTask = pdfPage.render({
          canvas: element,
          canvasContext: context,
          viewport: scaled,
          transform:
            outputScale === 1
              ? undefined
              : [outputScale, 0, 0, outputScale, 0, 0],
        });
        await renderTask.promise;
        const content = await pdfPage.getTextContent();
        if (active) {
          setRenderedPage(page);
          setPageText(
            content.items
              .map((item) =>
                "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "",
              )
              .join(""),
          );
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (
          active &&
          !(
            reason instanceof Error &&
            reason.name === "RenderingCancelledException"
          )
        )
          setError(
            "This page could not be displayed. Please open the original PDF below.",
          );
      });
    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [document, page, width, zoom]);

  const pages = document?.numPages ?? 379;
  return (
    <div className="english-reader">
      <div className="pdf-controls" aria-label="PDF reader controls">
        <div>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous PDF page"
          >
            <ChevronLeft size={20} />
          </button>
          <label htmlFor="hymn-pdf-page" className="sr-only">
            PDF page
          </label>
          <select
            id="hymn-pdf-page"
            value={page}
            onChange={(event) => onPageChange(Number(event.target.value))}
          >
            {Array.from({ length: pages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} / {pages}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            aria-label="Next PDF page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setZoom(Math.max(1, zoom - 0.25))}
            disabled={zoom <= 1}
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
          <output aria-label="PDF zoom level">{Math.round(zoom * 100)}%</output>
          <button
            type="button"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            aria-label="Zoom in"
          >
            <Plus size={18} />
          </button>
          <button type="button" onClick={() => setZoom(1)} className="pdf-fit">
            Fit
          </button>
        </div>
      </div>
      <p className="pdf-help">
        Use + to enlarge the page, then scroll across to read either column.
      </p>
      {error && (
        <p role="alert" className="reader-message">
          {error}
        </p>
      )}
      {!document && !error && (
        <p role="status" className="reader-message">
          Opening the English hymnbook…
        </p>
      )}
      {document && renderedPage !== page && !error && (
        <p role="status" className="reader-message">
          Loading page {page}…
        </p>
      )}
      <div
        ref={viewport}
        className="pdf-viewport"
        tabIndex={0}
        role="region"
        aria-label={`English hymnbook, PDF page ${page}. Scroll to read enlarged pages.`}
        aria-busy={Boolean(document && renderedPage !== page)}
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label={`English Methodist hymnbook, page ${page}. A text version follows the page.`}
          hidden={!document || Boolean(error)}
        />
      </div>
      {renderedPage === page && (
        <details className="pdf-page-text">
          <summary>Read page as text</summary>
          <p className="whitespace-pre-line">{pageText}</p>
        </details>
      )}
      <a
        className="site-text-link mt-5 inline-flex items-center gap-2"
        href={`${hymnbook.englishPdfUrl}#page=${page}`}
        target="_blank"
        rel="noreferrer"
      >
        Open original PDF
        <ExternalLink size={16} />
      </a>
    </div>
  );
}
