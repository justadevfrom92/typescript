import { test } from "node:test";
import assert from "node:assert/strict";
import { area, assertNever } from "./shapes.js";
import { describeCount, emailsOnly, move, padLeft, renderStatus, toMessage } from "./narrowing.js";

test("area handles every shape", () => {
  assert.equal(area({ kind: "rectangle", width: 2, height: 3 }), 6);
  assert.equal(area({ kind: "triangle", base: 4, height: 5 }), 10);
  assert.equal(Math.round(area({ kind: "circle", radius: 2 })), 13);
});

test("assertNever throws at runtime if reached", () => {
  assert.throws(() => assertNever("oops" as never));
});

test("typeof, equality, in and instanceof narrowing", () => {
  assert.equal(padLeft("x", 2), "  x");
  assert.equal(padLeft("x", "> "), "> x");
  assert.equal(describeCount(undefined), "unknown");
  assert.equal(describeCount(0), "none");
  assert.equal(describeCount(5), "many");
  assert.equal(move({ fly: () => "flap" }), "flap");
  assert.equal(toMessage(new Error("e")), "e");
  assert.equal(toMessage(42), "Unknown error");
});

test("type predicates filter unions", () => {
  assert.deepEqual(
    emailsOnly([
      { type: "email", address: "a@example.com" },
      { type: "phone", number: "123" },
    ]),
    ["a@example.com"],
  );
});

test("remote data states", () => {
  assert.equal(renderStatus({ status: "idle" }), "Press load to start.");
  assert.equal(renderStatus({ status: "error", error: "offline" }), "Failed: offline");
});
