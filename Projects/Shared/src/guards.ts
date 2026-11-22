// Small runtime type guards. JSON from the network is `unknown` until proven otherwise.

export type Guard<T> = (value: unknown) => value is T;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isArrayOf<T>(guard: Guard<T>): Guard<T[]> {
  return (value: unknown): value is T[] => Array.isArray(value) && value.every(guard);
}

/** Builds a guard from a map of property guards: hasShape({ id: isNumber }) */
export function hasShape<T extends Record<string, unknown>>(shape: { [K in keyof T]: Guard<T[K]> }): Guard<T> {
  return (value: unknown): value is T =>
    isRecord(value) && Object.entries(shape).every(([key, guard]) => (guard as Guard<unknown>)(value[key]));
}
