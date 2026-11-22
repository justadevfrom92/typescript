import { test } from "node:test";
import assert from "node:assert/strict";
import { isPrime, primeSearch } from "./primes.js";
import { validateLimit } from "./protocol.js";

test("isPrime", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 9, 17, 25, 97].filter(isPrime), [2, 3, 17, 97]);
});

test("primeSearch yields progress per chunk and returns the total", () => {
  const search = primeSearch(100, 30);
  const progress = [];
  let step = search.next();
  while (!step.done) {
    progress.push(step.value.checked);
    step = search.next();
  }
  assert.deepEqual(progress, [31, 61, 91]);
  assert.deepEqual(step.value, { checked: 100, found: 25, largest: 97 });
});

test("validateLimit", () => {
  assert.deepEqual(validateLimit("1,000"), { ok: true, limit: 1000 });
  assert.equal(validateLimit("1").ok, false);
  assert.equal(validateLimit("abc").ok, false);
  assert.equal(validateLimit("99999999999").ok, false);
});
