import { test } from "node:test";
import assert from "node:assert/strict";
import { applyPatch, createGetters, deepFreeze, hasErrors, validateNewUser } from "./utilities.js";
import type { ElementOf, KeysOfType, User } from "./types.js";

const user: User = { id: 1, name: "Ada", email: "ada@example.com", role: "admin", createdAt: new Date(0) };

test("createGetters builds typed getters", () => {
  const getters = createGetters({ city: "London" });
  assert.equal(getters.getCity(), "London");
});

test("applyPatch only changes patched fields", () => {
  const updated = applyPatch(user, { name: "Ada L." });
  assert.equal(updated.name, "Ada L.");
  assert.equal(updated.email, user.email);
});

test("validateNewUser returns field errors", () => {
  assert.equal(hasErrors(validateNewUser({ name: "Ada", email: "ada@example.com", role: "member" })), false);
  const errors = validateNewUser({ name: "", email: "x", role: "member" });
  assert.ok(errors.name && errors.email);
});

test("deepFreeze freezes nested objects", () => {
  const frozen = deepFreeze({ settings: { theme: "dark" } });
  assert.ok(Object.isFrozen(frozen.settings));
  // @ts-expect-error nested properties are readonly in the type too
  assert.throws(() => (frozen.settings.theme = "light"), TypeError);
});

test("type-level helpers compile to the expected types", () => {
  const element: ElementOf<string[]> = "only strings allowed";
  const stringKey: KeysOfType<User, string> = "email";
  assert.equal(typeof element, "string");
  assert.equal(stringKey, "email");
});
