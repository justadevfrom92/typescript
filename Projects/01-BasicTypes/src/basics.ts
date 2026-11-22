// Lesson 01: primitive types, arrays, tuples, literal types, functions and `unknown`.

// Primitive annotations. Usually inference is enough; annotate function boundaries.
export const appName: string = "TypeScript Mastery";
export const lessonNumber: number = 1;
export const isPublished: boolean = true;

// Literal types + `as const` give you an "enum" made of plain values.
export const Sizes = ["small", "medium", "large"] as const;
export type Size = (typeof Sizes)[number]; // "small" | "medium" | "large"

export function isSize(value: string): value is Size {
  return (Sizes as readonly string[]).includes(value);
}

// Optional and default parameters.
export function greet(name: string, greeting = "Hello", punctuation?: string): string {
  return `${greeting}, ${name}${punctuation ?? "!"}`;
}

// Money is stored as integer cents to avoid floating point surprises.
export function formatPrice(cents: number, currency: "USD" | "EUR" | "GBP" = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

// Tuples: fixed-length arrays where each position has its own type.
export type FullName = [first: string, last: string];

export function splitName(fullName: string): FullName {
  const [first = "", ...rest] = fullName.trim().split(/\s+/);
  return [first, rest.join(" ")];
}

// Readonly arrays prevent accidental mutation of inputs.
export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Object types written inline.
export function describeSize(item: { name: string; size: Size; quantity?: number }): string {
  const quantity = item.quantity ?? 1;
  return `${quantity} x ${item.name} (${item.size})`;
}

// `unknown` is the safe version of `any`: you must check before you use it.
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

// Function types can be named and reused.
export type Formatter = (value: number) => string;

export const formatters: Record<"percent" | "fixed", Formatter> = {
  percent: (value) => `${Math.round(value * 100)}%`,
  fixed: (value) => value.toFixed(2),
};

// `never` marks code that should be unreachable.
export function fail(message: string): never {
  throw new Error(message);
}
