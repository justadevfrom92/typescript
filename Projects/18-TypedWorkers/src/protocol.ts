// The message protocol between the page and the worker, as two discriminated unions.
// Both sides import these types, so a renamed field breaks the build instead of failing silently.

export type ToWorker = { type: "start"; jobId: number; limit: number } | { type: "cancel"; jobId: number };

export type FromWorker =
  | { type: "progress"; jobId: number; checked: number; found: number }
  | { type: "done"; jobId: number; found: number; largest: number | null; elapsedMs: number }
  | { type: "cancelled"; jobId: number }
  | { type: "error"; jobId: number; message: string };

/** A Worker whose postMessage/onmessage only accept the protocol types. */
export interface TypedWorker<In, Out> {
  postMessage(message: In): void;
  addEventListener(type: "message", listener: (event: MessageEvent<Out>) => void): void;
  addEventListener(type: "error", listener: (event: ErrorEvent) => void): void;
  terminate(): void;
}

export const MAX_LIMIT = 50_000_000;

export function validateLimit(text: string): { ok: true; limit: number } | { ok: false; error: string } {
  const limit = Number(text.replaceAll(/[_,\s]/g, ""));
  if (!Number.isInteger(limit) || limit < 2) return { ok: false, error: "Enter a whole number of at least 2." };
  if (limit > MAX_LIMIT) return { ok: false, error: `Keep it at or below ${MAX_LIMIT.toLocaleString("en-US")}.` };
  return { ok: true, limit };
}
