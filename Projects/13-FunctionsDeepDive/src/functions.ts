// Lesson 13: overloads, `this` parameters, assertion functions, generic function
// composition and how function types are compared.

// --- Overloads: several call signatures, one implementation -----------------
export function parseDate(timestamp: number): Date;
export function parseDate(isoText: string): Date | null;
export function parseDate(year: number, month: number, day: number): Date;
export function parseDate(a: number | string, month?: number, day?: number): Date | null {
  if (typeof a === "string") {
    const date = new Date(a);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (month !== undefined && day !== undefined) return new Date(Date.UTC(a, month - 1, day));
  return new Date(a);
}
// parseDate(1, 2) is a compile error: no overload takes two numbers.

// Overloads can also map input types to output types. Often a conditional type is simpler:
export function toArray<T>(value: T | readonly T[]): T[] {
  return Array.isArray(value) ? [...(value as readonly T[])] : [value as T];
}

// --- `this` parameters: declare what `this` must be (erased at runtime) -----
export type Counter = { count: number; step: number };

export function increment(this: Counter): number {
  this.count += this.step;
  return this.count;
}
// increment() on its own is a compile error; increment.call(counter) is fine.

// Methods that return `this` keep the subclass type when chaining.
export class QueryBuilder {
  protected parts: string[] = [];
  where(condition: string): this {
    this.parts.push(`WHERE ${condition}`);
    return this;
  }
  build(): string {
    return this.parts.join(" ");
  }
}

export class SelectBuilder extends QueryBuilder {
  constructor(table: string) {
    super();
    this.parts.push(`SELECT * FROM ${table}`);
  }
  limit(count: number): this {
    this.parts.push(`LIMIT ${count}`);
    return this;
  }
}

// --- Assertion functions: narrow by throwing ---------------------------------
export function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  if (!condition) throw new Error(message);
}

export function assertIsString(value: unknown, name = "value"): asserts value is string {
  if (typeof value !== "string") throw new TypeError(`${name} must be a string`);
}

export function shout(input: unknown): string {
  assertIsString(input, "input");
  return input.toUpperCase(); // `input` is a string from here on
}

// --- Generic composition -----------------------------------------------------
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function pipe(...fns: Array<(value: unknown) => unknown>): (value: unknown) => unknown {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

// Parameters<> and ReturnType<> read a function's types back out.
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, waitMs: number): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

export function once<F extends (...args: never[]) => unknown>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
  let called = false;
  let result: ReturnType<F>;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<F>;
    }
    return result;
  };
}

// --- Function type compatibility --------------------------------------------
// A function that takes FEWER parameters can be used where more are passed,
// which is why `[1, 2].forEach((n) => ...)` works although forEach passes 3 args.
export type Handler = (event: string, timestamp: number) => void;
export const ignoresTimestamp: Handler = (event) => void event;

// `void` return means "the result is ignored", so returning a value is allowed:
export const pushAll = (source: number[], target: number[]): void => source.forEach((n) => target.push(n));
