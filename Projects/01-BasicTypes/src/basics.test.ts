import { test } from "node:test";
import assert from "node:assert/strict";
import { average, describeSize, fail, formatPrice, greet, isSize, splitName, toNumber } from "./basics.js";

test("greet uses defaults and optional params", () => {
  assert.equal(greet("Ada"), "Hello, Ada!");
  assert.equal(greet("Ada", "Hi", "?"), "Hi, Ada?");
});

test("formatPrice formats cents", () => {
  assert.equal(formatPrice(1999), "$19.99");
  assert.equal(formatPrice(500, "EUR"), "€5.00");
});

test("splitName returns a tuple", () => {
  assert.deepEqual(splitName("  Grace Brewster Hopper "), ["Grace", "Brewster Hopper"]);
  assert.deepEqual(splitName("Cher"), ["Cher", ""]);
});

test("average handles empty arrays", () => {
  assert.equal(average([]), 0);
  assert.equal(average([2, 4]), 3);
});

test("isSize narrows strings", () => {
  assert.equal(isSize("small"), true);
  assert.equal(isSize("huge"), false);
});

test("describeSize defaults quantity", () => {
  assert.equal(describeSize({ name: "Cap", size: "small" }), "1 x Cap (small)");
});

test("toNumber safely converts unknown", () => {
  assert.equal(toNumber(7), 7);
  assert.equal(toNumber(" 3.5 "), 3.5);
  assert.equal(toNumber("abc"), null);
  assert.equal(toNumber(Infinity), null);
  assert.equal(toNumber(null), null);
});

test("fail throws", () => {
  assert.throws(() => fail("boom"), /boom/);
});
