import { test } from "node:test";
import assert from "node:assert/strict";
import { authorIds, filterPosts, isPostList, parseAuthor, type Post } from "./posts.js";

const posts: Post[] = [
  { userId: 1, id: 1, title: "Hello TypeScript", body: "..." },
  { userId: 2, id: 2, title: "Generics in practice", body: "..." },
  { userId: 1, id: 3, title: "Narrowing unions", body: "..." },
];

test("filters by author and search", () => {
  assert.equal(filterPosts(posts, { author: 1, search: "" }).length, 2);
  assert.equal(filterPosts(posts, { author: "all", search: "GENERICS" }).length, 1);
  assert.equal(filterPosts(posts, { author: 2, search: "union" }).length, 0);
});

test("authorIds are unique and sorted", () => {
  assert.deepEqual(authorIds(posts), [1, 2]);
});

test("parseAuthor falls back to all", () => {
  assert.equal(parseAuthor("3"), 3);
  assert.equal(parseAuthor("all"), "all");
  assert.equal(parseAuthor("abc"), "all");
});

test("guards reject malformed API data", () => {
  assert.equal(isPostList(posts), true);
  assert.equal(isPostList([{ id: 1 }]), false);
  assert.equal(isPostList({}), false);
});
