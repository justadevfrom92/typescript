import { useEffect, useRef, useState } from "#shared/dom.js";
import { validateLimit, type FromWorker, type ToWorker, type TypedWorker } from "./protocol.js";

type Job =
  | { status: "idle" }
  | { status: "running"; jobId: number; limit: number; checked: number; found: number }
  | { status: "done"; limit: number; found: number; largest: number | null; elapsedMs: number }
  | { status: "cancelled" }
  | { status: "error"; message: string };

function createWorker(): TypedWorker<ToWorker, FromWorker> | null {
  if (typeof Worker === "undefined") return null;
  try {
    return new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  } catch {
    return null;
  }
}

export function App(): Node {
  const [input, setInput] = useState("5,000,000");
  const [inputError, setInputError] = useState<string | null>(null);
  const [job, setJob] = useState<Job>({ status: "idle" });
  const [ticks, setTicks] = useState(0);
  const worker = useRef<TypedWorker<ToWorker, FromWorker> | null>(null);
  const nextJobId = useRef(1);

  // A ticking counter proves the page stays responsive while the worker computes.
  useEffect(() => {
    const timer = setInterval(() => setTicks((n) => n + 1), 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const created = createWorker();
    worker.current = created;
    if (!created) {
      setJob({ status: "error", message: "Web Workers are not available in this browser." });
      return;
    }
    created.addEventListener("message", ({ data }) => {
      setJob((current) => {
        if (current.status !== "running" || current.jobId !== data.jobId) return current; // stale message
        switch (data.type) {
          case "progress":
            return { ...current, checked: data.checked, found: data.found };
          case "done":
            return { status: "done", limit: current.limit, found: data.found, largest: data.largest, elapsedMs: data.elapsedMs };
          case "cancelled":
            return { status: "cancelled" };
          case "error":
            return { status: "error", message: data.message };
        }
      });
    });
    created.addEventListener("error", (event) => {
      event.preventDefault();
      setJob({ status: "error", message: event.message || "The worker failed to load." });
    });
    return () => created.terminate();
  }, []);

  const start = (event: SubmitEvent) => {
    event.preventDefault();
    const result = validateLimit(input);
    if (!result.ok) {
      setInputError(result.error);
      return;
    }
    if (!worker.current) return;
    const jobId = nextJobId.current++;
    setInputError(null);
    setJob({ status: "running", jobId, limit: result.limit, checked: 0, found: 0 });
    worker.current.postMessage({ type: "start", jobId, limit: result.limit });
  };

  const cancel = () => {
    if (job.status === "running") worker.current?.postMessage({ type: "cancel", jobId: job.jobId });
  };

  const format = (n: number) => n.toLocaleString("en-US");

  return (
    <div>
      <header className="header">
        <h1>Typed Workers</h1>
        <p className="muted">Counting primes in a Web Worker, with a message protocol typed as discriminated unions.</p>
      </header>

      <form className="card stack" onSubmit={start} noValidate>
        <div>
          <label htmlFor="limit">Count primes up to</label>
          <input id="limit" inputMode="numeric" value={input} onInput={(event) => event.currentTarget instanceof HTMLInputElement && setInput(event.currentTarget.value)} />
          {inputError && <p className="field-error">{inputError}</p>}
        </div>
        <div className="row">
          <button type="submit" className="primary" disabled={job.status === "running"}>Start</button>
          <button type="button" disabled={job.status !== "running"} onClick={cancel}>Cancel</button>
          <span className="muted" aria-label="Responsiveness counter">UI heartbeat: {ticks}</span>
        </div>
      </form>

      <section className="card" style={{ marginTop: "16px" }} aria-live="polite">
        {job.status === "idle" && <p className="muted">Pick a limit and press Start.</p>}
        {job.status === "running" && (
          <div className="stack">
            <progress max={String(job.limit)} value={String(job.checked)} style={{ width: "100%" }} />
            <p>
              Checked {format(job.checked)} of {format(job.limit)} · {format(job.found)} primes so far
            </p>
          </div>
        )}
        {job.status === "done" && (
          <p>
            Found <strong>{format(job.found)}</strong> primes up to {format(job.limit)}
            {job.largest !== null && <span> (largest {format(job.largest)})</span>} in {format(job.elapsedMs)} ms.
          </p>
        )}
        {job.status === "cancelled" && <p className="muted">Cancelled.</p>}
        {job.status === "error" && <p className="notice">{job.message}</p>}
      </section>
    </div>
  );
}
