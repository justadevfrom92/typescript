import { test } from "node:test";
import assert from "node:assert/strict";
import { first, groupBy, memoize, pluck, Queue, sortBy, TtlCache, uniqueBy } from "./generics.js";

const people = [
  { name: "Ada", age: 36 },
  { name: "Alan", age: 41 },
  { name: "Ada", age: 20 },
];

test("first and pluck", () => {
  assert.equal(first([]), undefined);
  assert.deepEqual(pluck(people, "age"), [36, 41, 20]);
});

test("groupBy and uniqueBy", () => {
  assert.equal(groupBy(people, (person) => person.name)["Ada"]?.length, 2);
  assert.equal(uniqueBy(people, (person) => person.name).length, 2);
});

test("sortBy does not mutate", () => {
  const sorted = sortBy(people, "age");
  assert.deepEqual(pluck(sorted, "age"), [20, 36, 41]);
  assert.equal(people[0]?.age, 36);
});

test("memoize calls the function once per argument", () => {
  let calls = 0;
  const square = memoize((n: number) => {
    calls++;
    return n * n;
  });
  square(3);
  square(3);
  assert.equal(square(3), 9);
  assert.equal(calls, 1);
});

test("Queue is first in, first out", () => {
  const queue = new Queue().enqueue("a").enqueue("b");
  assert.equal(queue.dequeue(), "a");
  assert.equal(queue.size, 1);
});

test("TtlCache expires entries", () => {
  let time = 0;
  const cache = new TtlCache<string>(100, () => time);
  cache.set("k", "v");
  assert.equal(cache.get("k"), "v");
  time = 150;
  assert.equal(cache.get("k"), undefined);
});
