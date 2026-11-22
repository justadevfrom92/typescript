# 18 · Typed Workers

Moves heavy computation off the main thread so the page stays responsive. A UI heartbeat counter keeps ticking while the worker counts primes.

- `src/protocol.ts` defines the messages in each direction as discriminated unions (`ToWorker`, `FromWorker`) and a `TypedWorker<In, Out>` interface, so `postMessage` only accepts valid messages.
- `src/primes.ts` is a chunked generator (from lesson 15) that the worker steps through, yielding between chunks so a **Cancel** message can arrive.
- `src/worker.ts` is the worker. It types its own global scope by hand and imports only relative modules, because import maps don't apply inside workers.
- Each job has an id, so messages from an old job are ignored. A worker that fails to load, or a browser without workers, shows an error message instead of crashing.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/18-TypedWorkers/
```
