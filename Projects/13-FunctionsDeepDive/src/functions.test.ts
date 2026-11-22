import { test } from "node:test";
import assertNode from "node:assert/strict";
import { assert, debounce, increment, once, parseDate, pipe, SelectBuilder, shout, toArray } from "./functions.js";

test("overloads pick the right signature", () => {
  assertNode.equal(parseDate(2026, 1, 15).toISOString(), "2026-01-15T00:00:00.000Z");
  assertNode.equal(parseDate(0).getTime(), 0);
  assertNode.equal(parseDate("nope"), null);
  // @ts-expect-error no overload accepts two numbers
  parseDate(1, 2);
});

test("toArray normalises", () => {
  assertNode.deepEqual(toArray(1), [1]);
  assertNode.deepEqual(toArray([1, 2]), [1, 2]);
});

test("this parameters and fluent `this` returns", () => {
  const counter = { count: 1, step: 2 };
  assertNode.equal(increment.call(counter), 3);
  // @ts-expect-error `this` would be void here
  assertNode.throws(() => increment());
  assertNode.equal(new SelectBuilder("t").where("x").limit(1).build(), "SELECT * FROM t WHERE x LIMIT 1");
});

test("assertion functions throw or narrow", () => {
  assertNode.equal(shout("hi"), "HI");
  assertNode.throws(() => shout(42), TypeError);
  assertNode.throws(() => assert(false, "nope"), /nope/);
});

test("pipe composes left to right", () => {
  const f = pipe((n: number) => n + 1, (n) => n * 2, (n) => `=${n}`);
  assertNode.equal(f(3), "=8");
});

test("once caches the first result", () => {
  let calls = 0;
  const init = once((x: number) => ++calls + x);
  assertNode.equal(init(10), 11);
  assertNode.equal(init(99), 11);
});

test("debounce runs only the last call", async () => {
  const seen: string[] = [];
  const log = debounce((value: string) => seen.push(value), 10);
  log("a");
  log("b");
  await new Promise((resolve) => setTimeout(resolve, 30));
  assertNode.deepEqual(seen, ["b"]);
});
