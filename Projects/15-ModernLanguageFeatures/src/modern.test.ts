import { test } from "node:test";
import assert from "node:assert/strict";
import { calls, Volume } from "./decorators.js";
import { collect, fibonacci, mapIterable, paginate, Range, runningTotal, take } from "./iterators.js";
import { log, query, writeTwoFiles } from "./resources.js";
import { createVault, publicView, secret, Temperature } from "./symbols.js";

test("iterables and generators", () => {
  assert.deepEqual([...new Range(1, 4)], [1, 2, 3]);
  assert.deepEqual([...take(fibonacci(), 6)], [0, 1, 1, 2, 3, 5]);
  assert.deepEqual([...mapIterable(new Range(0, 3), (n) => n * n)], [0, 1, 4]);
  assert.throws(() => new Range(0, 1, 0), RangeError);
});

test("generators receive values through next()", () => {
  const total = runningTotal();
  total.next();
  total.next(5);
  assert.deepEqual(total.next(10), { value: 15, done: false });
  assert.deepEqual(total.next(), { value: 15, done: true });
});

test("async generators paginate until an empty page", async () => {
  const pages = [[1, 2], [3], []];
  const items = await collect(paginate(async (page) => pages[page - 1] ?? []));
  assert.deepEqual(items, [1, 2, 3]);
});

test("symbols hide keys and customise conversion", () => {
  const vault = createVault("main", "s3cret");
  assert.equal(vault[secret], "s3cret");
  assert.equal(publicView(vault), '{"label":"main"}');
  assert.equal(`${new Temperature(5)}`, "5°C");
  assert.equal(Object.prototype.toString.call(new Temperature(5)), "[object Temperature]");
});

test("using disposes in reverse order even on errors", async () => {
  log.length = 0;
  assert.throws(() => writeTwoFiles(true), /disk full/);
  assert.deepEqual(log, ["open a.txt", "open b.txt", "write a.txt: hello", "close b.txt", "close a.txt"]);
  log.length = 0;
  assert.equal(await query(), "rows");
  assert.deepEqual(log, ["connect 1", "query on 1", "disconnect 1"]);
});

test("decorators log, bind and clamp", () => {
  calls.length = 0;
  const volume = new Volume();
  assert.equal(volume.level, 10);
  const louder = volume.louder;
  assert.equal(louder(), 10);
  assert.equal(volume.set(3), 3);
  assert.deepEqual(calls, ["set(11)", "set(3)"]);
});
