import { test } from "node:test";
import assert from "node:assert/strict";
import { addCents, cents, concat, countWords, deepMerge, getPath, isJson, on, partial, pickDefault, routes, userId, type OrderId, type UserId } from "./advanced.js";

test("branded types validate at the boundary", () => {
  assert.equal(userId("u_1"), "u_1");
  assert.throws(() => userId("1"));
  assert.equal(addCents(cents(1), cents(2)), 3);
  const id = userId("u_2");
  // @ts-expect-error a UserId is not an OrderId even though both are strings
  const order: OrderId = id;
  // @ts-expect-error a plain string is not a UserId
  const plain: UserId = "u_3";
  assert.ok(order && plain);
});

test("on() narrows the handler's event type", () => {
  const xs: number[] = [];
  const handle = on("click", (event) => xs.push(event.x));
  handle({ type: "click", x: 4, y: 0 });
  handle({ type: "key", key: "a" });
  assert.deepEqual(xs, [4]);
});

test("index signatures", () => {
  const counts = countWords("To be or not to be");
  assert.equal(counts["to"], 2);
  assert.equal(counts["missing"], undefined);
});

test("recursive types: deepMerge and getPath", () => {
  const merged = deepMerge({ a: { b: 1, c: 2 }, d: [1] }, { a: { c: 3 } });
  assert.deepEqual(merged, { a: { b: 1, c: 3 }, d: [1] });
  assert.equal(isJson({ a: [1, "x", null, { b: true }] }), true);
  assert.equal(isJson({ a: () => 1 }), false);
  const port: number = getPath({ server: { port: 80 } }, "server.port");
  assert.equal(port, 80);
  // @ts-expect-error "server.nope" is not a valid path
  getPath({ server: { port: 80 } }, "server.nope");
});

test("variadic tuples and partial application", () => {
  const tuple: [number, string, boolean] = concat([1, "a"], [true]);
  assert.deepEqual(tuple, [1, "a", true]);
  const greet = partial((greeting: string, name: string) => `${greeting} ${name}`, "Hi");
  assert.equal(greet("Ada"), "Hi Ada");
});

test("const type parameters and NoInfer", () => {
  const paths: readonly ["/", "/about"] = routes(["/", "/about"]);
  assert.equal(paths.length, 2);
  assert.equal(pickDefault(["small", "large"], "small"), "small");
  // @ts-expect-error "medium" is not one of the options and NoInfer stops it widening T
  pickDefault(["small", "large"], "medium");
});
