// Lesson 14: advanced type techniques that show up in real code.
import type { Equal, Expect } from "#shared/typeTests.js";

// --- keyof typeof: derive types from values ---------------------------------
export const statusColors = { active: "green", paused: "orange", archived: "gray" } as const;
export type Status = keyof typeof statusColors; // "active" | "paused" | "archived"
export type Color = (typeof statusColors)[Status]; // "green" | "orange" | "gray"

// --- Extract / Exclude on unions --------------------------------------------
export type Event =
  | { type: "click"; x: number; y: number }
  | { type: "key"; key: string }
  | { type: "scroll"; offset: number };
export type PointerEvent = Extract<Event, { type: "click" | "scroll" }>;
export type NonKeyEvent = Exclude<Event, { type: "key" }>;
export type EventOf<T extends Event["type"]> = Extract<Event, { type: T }>;

export function on<T extends Event["type"]>(type: T, handler: (event: EventOf<T>) => void) {
  return (event: Event) => {
    if (event.type === type) handler(event as EventOf<T>);
  };
}

// --- Branded types: same runtime value, different compile-time identity ------
declare const brand: unique symbol;
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;
export type Cents = Brand<number, "Cents">;

export function userId(value: string): UserId {
  if (!/^u_\w+$/.test(value)) throw new Error(`Invalid user id: ${value}`);
  return value as UserId;
}
export function cents(value: number): Cents {
  if (!Number.isInteger(value)) throw new Error("Cents must be an integer");
  return value as Cents;
}
export function addCents(a: Cents, b: Cents): Cents {
  return (a + b) as Cents;
}

// --- Index signatures and Record --------------------------------------------
export type Dictionary<T> = { [key: string]: T | undefined };
export function countWords(text: string): Dictionary<number> {
  const counts: Dictionary<number> = {};
  for (const word of text.toLowerCase().match(/[a-z']+/g) ?? []) counts[word] = (counts[word] ?? 0) + 1;
  return counts;
}

// --- Recursive types --------------------------------------------------------
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export function isJson(value: unknown): value is Json {
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJson);
  return isPlainObject(value) && Object.values(value).every(isJson);
}

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function deepMerge<T extends object>(base: T, patch: DeepPartial<T>): T {
  return mergeObjects(base as Record<string, unknown>, patch as Record<string, unknown>) as T;
}

function mergeObjects(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value) ? mergeObjects(current, value) : value;
  }
  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// "a.b.c" paths into a nested object, built with recursive template literal types.
export type Path<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K }[keyof T & string]
  : never;

export type PathValue<T, P extends string> = P extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? PathValue<T[Head], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export function getPath<T, P extends Path<T>>(object: T, path: P): PathValue<T, P> {
  return path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown>)?.[key], object) as PathValue<T, P>;
}

// --- Variadic tuple types ---------------------------------------------------
export function concat<A extends unknown[], B extends unknown[]>(a: [...A], b: [...B]): [...A, ...B] {
  return [...a, ...b];
}

export type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : [];

export function partial<First, Rest extends unknown[], R>(fn: (first: First, ...rest: Rest) => R, first: First) {
  return (...rest: Rest): R => fn(first, ...rest);
}

// --- const type parameters: infer literal types without `as const` ----------
export function routes<const T extends readonly string[]>(paths: T): T {
  return paths;
}

// --- NoInfer: stop a parameter from widening the inferred type ---------------
export function pickDefault<T extends string>(options: readonly T[], fallback: NoInfer<T>): T {
  return options[0] ?? fallback;
}

// --- Compile-time checks (no runtime cost) -----------------------------------
export type Checks = [
  Expect<Equal<Status, "active" | "paused" | "archived">>,
  Expect<Equal<PointerEvent["type"], "click" | "scroll">>,
  Expect<Equal<NonKeyEvent, PointerEvent>>,
  Expect<Equal<Tail<[1, 2, 3]>, [2, 3]>>,
  Expect<Equal<Path<{ a: { b: { c: 1 } }; d: 2 }>, "a" | "a.b" | "a.b.c" | "d">>,
  Expect<Equal<PathValue<{ a: { b: number } }, "a.b">, number>>,
];
