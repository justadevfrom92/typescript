// Runs inside the Web Worker. It only imports relative modules, because import maps
// do not apply inside workers.
import { primeSearch } from "./primes.js";
import type { FromWorker, ToWorker } from "./protocol.js";

// The project compiles with the DOM lib, so describe the worker scope we use by hand.
type WorkerScope = {
  postMessage(message: FromWorker): void;
  addEventListener(type: "message", listener: (event: MessageEvent<ToWorker>) => void): void;
};
const scope = globalThis as unknown as WorkerScope;

const cancelled = new Set<number>();

scope.addEventListener("message", ({ data }) => {
  switch (data.type) {
    case "cancel":
      cancelled.add(data.jobId);
      break;
    case "start":
      run(data.jobId, data.limit);
      break;
  }
});

function run(jobId: number, limit: number): void {
  const started = performance.now();
  const search = primeSearch(limit);

  const step = () => {
    if (cancelled.delete(jobId)) {
      scope.postMessage({ type: "cancelled", jobId });
      return;
    }
    try {
      const next = search.next();
      if (next.done) {
        const { found, largest } = next.value;
        scope.postMessage({ type: "done", jobId, found, largest, elapsedMs: Math.round(performance.now() - started) });
      } else {
        scope.postMessage({ type: "progress", jobId, checked: next.value.checked, found: next.value.found });
        setTimeout(step); // Yield so "cancel" messages can arrive between chunks.
      }
    } catch (error) {
      scope.postMessage({ type: "error", jobId, message: error instanceof Error ? error.message : String(error) });
    }
  };
  step();
}
