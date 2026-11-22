// fetchJson wraps native fetch with the checks every live API call needs:
// network/CORS failures, timeouts, non-2xx status, rate limits, empty bodies,
// malformed JSON and unexpected shapes. It never throws; it returns a Result.

import type { Guard } from "./guards.js";
import { err, ok, type Result } from "./result.js";

export type FetchOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function fetchJson<T>(url: string, guard: Guard<T>, options: FetchOptions = {}): Promise<Result<T>> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const signals = [AbortSignal.timeout(timeoutMs)];
  if (options.signal) signals.push(options.signal);

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.any(signals), headers: { Accept: "application/json" } });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") return err("The request timed out.");
    if (error instanceof DOMException && error.name === "AbortError") return err("The request was cancelled.");
    return err("Network error: you may be offline or the request was blocked (CORS).");
  }

  if (response.status === 429) return err("Rate limited by the API. Please wait and try again.");
  if (!response.ok) return err(`The API answered with HTTP ${response.status}.`);

  const text = await response.text().catch(() => "");
  if (text.trim() === "") return err("The API returned an empty response.");

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return err("The API returned malformed JSON.");
  }

  return guard(json) ? ok(json) : err("The API returned data in an unexpected shape.");
}
