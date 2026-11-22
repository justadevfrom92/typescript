// Plain JSX: no type annotations, but JSDoc comments + "checkJs" still give type safety.
import { useEffect, useState } from "#shared/dom.js";
import { fetchJson } from "#shared/http.js";
import { aspectRatio, imageUrl, isPhotoList, listUrl, wrapIndex } from "./photos.js";

/** @typedef {import("./photos.js").Photo} Photo */
/** @typedef {{ status: "loading" } | { status: "error", error: string } | { status: "ready", photos: Photo[] }} State */

export function App() {
  const [page, setPage] = useState(1);
  const [state, setState] = useState(/** @type {State} */ ({ status: "loading" }));
  const [openIndex, setOpenIndex] = useState(/** @type {number | null} */ (null));
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    setOpenIndex(null);
    fetchJson(listUrl(page), isPhotoList, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setState(result.ok ? { status: "ready", photos: result.data } : { status: "error", error: result.error });
    });
    return () => controller.abort();
  }, [page, retry]);

  const photos = state.status === "ready" ? state.photos : [];

  // Keyboard navigation for the lightbox.
  useEffect(() => {
    if (openIndex === null) return;
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") setOpenIndex((i) => wrapIndex((i ?? 0) + 1, photos.length));
      if (event.key === "ArrowLeft") setOpenIndex((i) => wrapIndex((i ?? 0) - 1, photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, photos.length]);

  const open = openIndex === null ? undefined : photos[openIndex];

  return (
    <div>
      <header className="header">
        <h1>Photo Gallery</h1>
        <p className="muted">Plain JSX + JSDoc, type-checked by tsc. Images from picsum.photos.</p>
      </header>

      <div className="row" style={{ marginBottom: "16px" }}>
        <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
        <span className="muted">Page {page}</span>
        <button type="button" disabled={state.status !== "ready" || photos.length === 0} onClick={() => setPage((p) => p + 1)}>Next →</button>
      </div>

      {state.status === "loading" && <p className="muted" role="status">Loading photos…</p>}
      {state.status === "error" && (
        <p className="notice" role="alert">
          {state.error}
          <button type="button" onClick={() => setRetry((n) => n + 1)}>Retry</button>
        </p>
      )}
      {state.status === "ready" && photos.length === 0 && <p className="muted">No more photos.</p>}

      <div className="grid">
        {photos.map((photo, index) => (
          <Thumbnail key={photo.id} photo={photo} onOpen={() => setOpenIndex(index)} />
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-label={`Photo by ${open.author}`}
          style={{ position: "fixed", inset: "0", background: "rgba(0,0,0,0.85)", display: "grid", placeItems: "center", padding: "16px" }}
          onClick={() => setOpenIndex(null)}
        >
          <figure style={{ margin: "0", maxWidth: "900px", width: "100%", color: "white" }}>
            <img src={imageUrl(open, 900)} alt={`Photo by ${open.author}`} style={{ aspectRatio: aspectRatio(open), width: "100%", objectFit: "cover" }} />
            <figcaption className="row" style={{ justifyContent: "space-between", marginTop: "8px" }}>
              <span>{open.author} · {open.width}×{open.height}</span>
              <span>← → to browse · Esc to close</span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

/** @param {{ photo: Photo, onOpen: () => void }} props */
function Thumbnail({ photo, onOpen }) {
  const [failed, setFailed] = useState(false);
  return (
    <button type="button" className="card" style={{ padding: "0", overflow: "hidden", textAlign: "left" }} onClick={onOpen}>
      {failed ? (
        <div style={{ aspectRatio: "3 / 2", display: "grid", placeItems: "center" }} className="muted">Image unavailable</div>
      ) : (
        <img src={imageUrl(photo, 300)} alt={`Photo by ${photo.author}`} loading="lazy" style={{ aspectRatio: "3 / 2", objectFit: "cover", width: "100%" }} onError={() => setFailed(true)} />
      )}
      <span style={{ display: "block", padding: "8px 12px" }}>{photo.author}</span>
    </button>
  );
}
