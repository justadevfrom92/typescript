import { test } from "node:test";
import assert from "node:assert/strict";
import type { Equal, Expect } from "#shared/typeTests.js";
import { describeError, isRetryable, type PathParams } from "./apiTypes.js";
import { buildUrl, type Fetcher } from "./client.js";
import { createJsonPlaceholderClient } from "./jsonPlaceholder.js";

type _Checks = [
  Expect<Equal<PathParams<"/users/:userId/posts/:postId">, { userId: string | number; postId: string | number }>>,
  Expect<Equal<PathParams<"/posts">, {}>>,
];

function fakeFetch(status: number, body: unknown, calls: Array<{ url: string; init: RequestInit }> = []): Fetcher {
  return async (url, init) => {
    calls.push({ url, init });
    return new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
  };
}

const post = { userId: 1, id: 7, title: "t", body: "b" };

test("buildUrl fills params and skips undefined query values", () => {
  assert.equal(buildUrl("https://x", "/users/:id/todos", { id: 3 }, { completed: "true", page: undefined }), "https://x/users/3/todos?completed=true");
  assert.throws(() => buildUrl("https://x", "/posts/:postId"), /postId/);
});

test("GET with params and query", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const api = createJsonPlaceholderClient(fakeFetch(200, post, calls));
  const result = await api("GET /posts/:postId", { params: { postId: 7 } });
  assert.deepEqual(result, { ok: true, data: post });
  assert.equal(calls[0]?.url, "https://jsonplaceholder.typicode.com/posts/7");
  assert.equal(calls[0]?.init.method, "GET");
});

test("POST sends a JSON body", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const api = createJsonPlaceholderClient(fakeFetch(201, { ...post, id: 101 }, calls));
  const result = await api("POST /posts", { body: { userId: 1, title: "t", body: "b" } });
  assert.ok(result.ok && result.data.id === 101);
  assert.equal(calls[0]?.init.method, "POST");
  assert.equal(calls[0]?.init.body, '{"userId":1,"title":"t","body":"b"}');
});

test("typed error kinds", async () => {
  const api = (status: number, body: unknown) => createJsonPlaceholderClient(fakeFetch(status, body));
  assert.deepEqual((await api(404, {})("GET /posts/:postId", { params: { postId: 1 } })).ok, false);
  const notFound = await api(404, {})("GET /posts/:postId", { params: { postId: 1 } });
  assert.ok(!notFound.ok && notFound.error.kind === "http" && notFound.error.status === 404);
  const limited = await api(429, {})("GET /posts", {});
  assert.ok(!limited.ok && limited.error.kind === "rateLimited");
  const malformed = await api(200, "{oops")("GET /posts", {});
  assert.ok(!malformed.ok && malformed.error.kind === "parse");
  const wrongShape = await api(200, [{ id: "x" }])("GET /posts", {});
  assert.ok(!wrongShape.ok && wrongShape.error.kind === "shape");
  const offline = await createJsonPlaceholderClient(async () => { throw new TypeError("Failed to fetch"); })("GET /posts", {});
  assert.ok(!offline.ok && offline.error.kind === "network");
});

test("error helpers", () => {
  assert.equal(describeError({ kind: "http", status: 404 }), "Not found.");
  assert.equal(isRetryable({ kind: "http", status: 503 }), true);
  assert.equal(isRetryable({ kind: "shape" }), false);
});

test("the compiler rejects invalid calls", () => {
  const api = createJsonPlaceholderClient(fakeFetch(200, []));
  // Never called: these lines exist only to be type-checked.
  const invalidCalls = () => {
    // @ts-expect-error unknown route
    void api("GET /comments", {});
    // @ts-expect-error missing required path param
    void api("GET /posts/:postId", {});
    // @ts-expect-error POST needs a body
    void api("POST /posts", {});
    // @ts-expect-error wrong query field
    void api("GET /posts", { query: { user: 1 } });
  };
  assert.equal(typeof invalidCalls, "function");
});
