import { test } from "node:test";
import assert from "node:assert/strict";
import { describeOptions, doubleTyped, errorMessage, firstUpper, FixedChild, missing, nameLength, readEnv, signFixed, total } from "./strictness.js";

test("the fixed versions behave correctly", () => {
  assert.equal(nameLength(null), 0);
  assert.equal(nameLength("Ada"), 3);
  assert.equal(doubleTyped(4), 8);
  assert.equal(errorMessage(() => { throw new Error("bad"); }), "bad");
  assert.equal(errorMessage(() => { throw "plain"; }), "plain");
  assert.equal(firstUpper([]), "");
  assert.equal(firstUpper(["ts"]), "TS");
  assert.equal(describeOptions(missing), "default color");
  assert.equal(describeOptions({ color: "red" }), "color=red");
  assert.equal(readEnv({ HOME: "/home/ada" }), "/home/ada");
  assert.equal(signFixed(0), "0");
  assert.equal(new FixedChild().render(), "fixed child");
  assert.equal(total([1, 2], "USD"), 3);
});
