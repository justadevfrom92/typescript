import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { fetchJson } from "./http.js";
import { hasShape, isArrayOf, isNumber, isString } from "./guards.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function fakeFetch(body: string, status = 200): void {
  globalThis.fetch = async () => new Response(body, { status });
}

const isUser = hasShape<{ id: number; name: string }>({ id: isNumber, name: isString });

test("returns data when JSON matches the guard", async () => {
  fakeFetch('{"id":1,"name":"Ada"}');
  const result = await fetchJson("https://example.test", isUser);
  assert.deepEqual(result, { ok: true, data: { id: 1, name: "Ada" } });
});

test("reports HTTP errors", async () => {
  fakeFetch("{}", 500);
  const result = await fetchJson("https://example.test", isUser);
  assert.equal(result.ok, false);
});

test("reports rate limiting", async () => {
  fakeFetch("{}", 429);
  const result = await fetchJson("https://example.test", isUser);
  assert.deepEqual(result, { ok: false, error: "Rate limited by the API. Please wait and try again." });
});

test("reports empty and malformed bodies", async () => {
  fakeFetch("");
  const empty = await fetchJson("https://example.test", isUser);
  assert.ok(!empty.ok && empty.error.includes("empty"));
  fakeFetch("{not json");
  const result = await fetchJson("https://example.test", isUser);
  assert.ok(!result.ok && result.error.includes("malformed"));
});

test("reports unexpected shapes", async () => {
  fakeFetch('{"id":"one"}');
  const result = await fetchJson("https://example.test", isUser);
  assert.ok(!result.ok && result.error.includes("unexpected shape"));
});

test("reports network failures without throwing", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  const result = await fetchJson("https://example.test", isUser);
  assert.ok(!result.ok && result.error.startsWith("Network error"));
});

test("isArrayOf checks every item", () => {
  assert.equal(isArrayOf(isNumber)([1, 2, 3]), true);
  assert.equal(isArrayOf(isNumber)([1, "2"]), false);
});
