// localStorage can be missing or throw (private mode, blocked cookies, full quota).
// These helpers fall back silently so the app still works without persistence.

import type { Guard } from "./guards.js";

export function loadJson<T>(key: string, guard: Guard<T>, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (raw == null) return fallback;
    const value: unknown = JSON.parse(raw);
    return guard(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore: persistence is a convenience, not a requirement.
  }
}
