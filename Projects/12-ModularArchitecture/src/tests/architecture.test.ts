import { test } from "node:test";
import assert from "node:assert/strict";
import { completionRate, initials, searchUsers, sortUsers } from "../domain/rules.js";
import { href, parseHash } from "../router/routes.js";
import { createDirectory } from "../services/directory.js";
import { isUser } from "../services/HttpUserRepository.js";
import { InMemoryUserRepository, sampleTodos, sampleUsers } from "../services/InMemoryUserRepository.js";
import { createStore } from "../state/store.js";
import type { UserRepository } from "../services/UserRepository.js";

test("domain rules", () => {
  assert.equal(completionRate(sampleTodos.filter((todo) => todo.userId === 3)), 50);
  assert.equal(completionRate([]), 0);
  assert.deepEqual(sortUsers(sampleUsers, "city").map((user) => user.address.city), ["Arlington", "London", "Manchester"]);
  assert.equal(searchUsers(sampleUsers, "bletchley").length, 1);
  assert.equal(initials("Grace Brewster Hopper"), "GB");
});

test("router parses and builds hashes", () => {
  assert.deepEqual(parseHash(""), { name: "users" });
  assert.deepEqual(parseHash("#/users/7"), { name: "user", id: 7 });
  assert.deepEqual(parseHash("#/nope"), { name: "notFound", path: "/nope" });
  assert.equal(href({ name: "user", id: 7 }), "#/users/7");
});

test("store notifies subscribers and can unsubscribe", () => {
  const store = createStore({ count: 0 });
  const seen: number[] = [];
  const stop = store.subscribe((state) => seen.push(state.count));
  store.set((state) => ({ count: state.count + 1 }));
  store.set((state) => state); // unchanged: no notification
  stop();
  store.set((state) => ({ count: state.count + 1 }));
  assert.deepEqual(seen, [1]);
});

test("directory loads users and todos through any repository", async () => {
  const directory = createDirectory(new InMemoryUserRepository());
  await directory.loadUsers();
  await directory.loadTodos(1);
  const state = directory.store.get();
  assert.ok(state.users.status === "ready" && state.users.data.length === 3);
  assert.ok(state.todos[1]?.status === "ready" && state.todos[1].data.length === 2);
  await directory.loadTodos(99);
  assert.equal(directory.store.get().todos[99]?.status, "error");
});

test("directory surfaces repository failures", async () => {
  const failing: UserRepository = {
    label: "failing",
    listUsers: async () => ({ ok: false, error: "offline" }),
    listTodos: async () => ({ ok: false, error: "offline" }),
  };
  const directory = createDirectory(failing);
  await directory.loadUsers();
  assert.deepEqual(directory.store.get().users, { status: "error", error: "offline" });
});

test("switching repository resets state", async () => {
  const directory = createDirectory(new InMemoryUserRepository());
  await directory.loadUsers();
  directory.useRepository(new InMemoryUserRepository([sampleUsers[0]!]));
  assert.equal(directory.store.get().users.status, "loading");
});

test("isUser validates API shapes", () => {
  assert.equal(isUser(sampleUsers[0]), true);
  assert.equal(isUser({ ...sampleUsers[0], company: null }), false);
});
