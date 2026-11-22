// Pure, chunked prime counting. A generator yields after each chunk so the caller
// can report progress and check for cancellation between chunks (see lesson 15).

export type Progress = { checked: number; found: number; largest: number | null };

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) if (n % divisor === 0) return false;
  return true;
}

export function* primeSearch(limit: number, chunkSize = 100_000): Generator<Progress, Progress, undefined> {
  let found = 0;
  let largest: number | null = null;
  for (let start = 2; start <= limit; start += chunkSize) {
    const end = Math.min(limit, start + chunkSize - 1);
    for (let n = start; n <= end; n++) {
      if (isPrime(n)) {
        found++;
        largest = n;
      }
    }
    if (end < limit) yield { checked: end, found, largest };
  }
  return { checked: limit, found, largest };
}
