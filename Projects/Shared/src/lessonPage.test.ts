import { test } from "node:test";
import assert from "node:assert/strict";
import { formatValue } from "./lessonPage.js";

test("formatValue shows values the way a console would", () => {
  assert.equal(formatValue("hi"), '"hi"');
  assert.equal(formatValue(undefined), "undefined");
  assert.equal(formatValue([1, { a: undefined }]), '[1,{"a":"undefined"}]');
  assert.equal(formatValue(new Map([["k", 1]])), 'Map {"k":1}');
  assert.equal(formatValue(new Set([1, 2])), "Set [1,2]");
  assert.equal(formatValue(new RangeError("bad")), "RangeError: bad");
  assert.equal(formatValue(function named() {}), "ƒ named()");
});
