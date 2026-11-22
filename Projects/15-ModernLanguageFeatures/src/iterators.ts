// Iterables, generators and async generators, all fully typed.

// Any object with [Symbol.iterator] works with for...of, spread and Array.from.
export class Range implements Iterable<number> {
  constructor(
    readonly start: number,
    readonly end: number,
    readonly step = 1,
  ) {
    if (step <= 0) throw new RangeError("step must be positive");
  }

  *[Symbol.iterator](): Generator<number, void, undefined> {
    for (let value = this.start; value < this.end; value += this.step) yield value;
  }
}

// Generators are lazy: they produce values only when asked, so infinite sequences are fine.
export function* fibonacci(): Generator<number, never, undefined> {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

export function* take<T>(source: Iterable<T>, count: number): Generator<T, void, undefined> {
  if (count <= 0) return;
  let taken = 0;
  for (const item of source) {
    yield item;
    if (++taken >= count) return;
  }
}

export function* mapIterable<T, U>(source: Iterable<T>, fn: (item: T) => U): Generator<U, void, undefined> {
  for (const item of source) yield fn(item);
}

// Generator<Yield, Return, Next>: the third parameter types values sent in with next(value).
export function* runningTotal(): Generator<number, number, number | undefined> {
  let total = 0;
  while (true) {
    const next = yield total;
    if (next === undefined) return total;
    total += next;
  }
}

// Async generators: for await...of over data that arrives over time (pages, streams, events).
export async function* paginate<T>(fetchPage: (page: number) => Promise<T[]>): AsyncGenerator<T, void, undefined> {
  for (let page = 1; ; page++) {
    const items = await fetchPage(page);
    if (items.length === 0) return;
    yield* items;
  }
}

export async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of source) items.push(item);
  return items;
}
