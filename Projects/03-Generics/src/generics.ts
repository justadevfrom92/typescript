// Lesson 03: generic functions, constraints, keyof and generic classes.

// A type parameter links input and output types.
export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

// Constraints: K must be a key of T.
export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// Partial<...>: only keys that actually occur get an array, so lookups may be undefined.
export function groupBy<T, K extends PropertyKey>(items: readonly T[], getKey: (item: T) => K): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

export function uniqueBy<T>(items: readonly T[], getKey: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Generic constraint with an interface shape.
export function sortBy<T extends Record<K, string | number>, K extends keyof T>(items: readonly T[], key: K): T[] {
  return [...items].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
}

// Generic higher-order function: the returned function has the same signature.
export function memoize<A extends string | number, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new Map<A, R>();
  return (arg) => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg) as R;
  };
}

// Generic class with a default type parameter.
export class Queue<T = string> {
  #items: T[] = [];

  enqueue(item: T): this {
    this.#items.push(item);
    return this;
  }

  dequeue(): T | undefined {
    return this.#items.shift();
  }

  get size(): number {
    return this.#items.length;
  }
}

// Generic cache that expires entries after `ttlMs` milliseconds.
export class TtlCache<V> {
  #entries = new Map<string, { value: V; expires: number }>();

  constructor(
    private readonly ttlMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  set(key: string, value: V): void {
    this.#entries.set(key, { value, expires: this.now() + this.ttlMs });
  }

  get(key: string): V | undefined {
    const entry = this.#entries.get(key);
    if (!entry) return undefined;
    if (entry.expires <= this.now()) {
      this.#entries.delete(key);
      return undefined;
    }
    return entry.value;
  }
}
