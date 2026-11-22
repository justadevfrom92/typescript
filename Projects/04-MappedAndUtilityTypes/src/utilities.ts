// Runtime helpers whose types come from the mapped types in ./types.ts.
import type { FormErrors, Getters, NewUser, User, UserPatch } from "./types.js";

export function createGetters<T extends Record<string, unknown>>(source: T): Getters<T> {
  const getters: Record<string, () => unknown> = {};
  for (const key of Object.keys(source)) {
    getters[`get${key.charAt(0).toUpperCase()}${key.slice(1)}`] = () => source[key];
  }
  return getters as Getters<T>;
}

export function applyPatch(user: User, patch: UserPatch): User {
  return { ...user, ...patch };
}

export function validateNewUser(input: NewUser): FormErrors<NewUser> {
  const errors: FormErrors<NewUser> = {};
  if (input.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Enter a valid email address.";
  return errors;
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.values(errors).some(Boolean);
}

// `satisfies` checks an object against a type while keeping its narrow literal types.
export const roleLabels = {
  admin: "Administrator",
  member: "Member",
} satisfies Record<User["role"], string>;

export function deepFreeze<T extends object>(value: T): Readonly<T> {
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") deepFreeze(nested);
  }
  return Object.freeze(value);
}
