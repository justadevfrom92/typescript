import { example, showLesson } from "#shared/lessonPage.js";
import type { User } from "./types.js";
import { applyPatch, createGetters, deepFreeze, hasErrors, roleLabels, validateNewUser } from "./utilities.js";

const user: User = { id: 1, name: "Ada", email: "ada@example.com", role: "admin", createdAt: new Date("2026-01-01") };

void showLesson({
  title: "04 · Mapped & Utility Types",
  intro: "The types live in src/types.ts. These runtime helpers in src/utilities.ts get their types from them.",
  sections: [
    {
      heading: "Partial<Pick<User, ...>> for edit forms",
      examples: [
        example(`user`, () => user),
        example(`applyPatch(user, { name: "Ada L." })`, () => applyPatch(user, { name: "Ada L." })),
      ],
    },
    {
      heading: "FormErrors<T> = Partial<Record<keyof T, string>>",
      examples: [
        example(`validateNewUser({ name: "A", email: "nope", role: "member" })`, () => validateNewUser({ name: "A", email: "nope", role: "member" })),
        example(`hasErrors(validateNewUser({ name: "Ada", email: "ada@example.com", role: "member" }))  // a valid user`, () => hasErrors(validateNewUser({ name: "Ada", email: "ada@example.com", role: "member" }))),
      ],
    },
    {
      heading: "Key remapping: Getters<T>",
      note: 'Getters<{ name: string }> is { getName: () => string }, built with a template literal type.',
      examples: [
        example(`createGetters({ name: "Ada", year: 1843 }).getName()`, () => createGetters({ name: "Ada", year: 1843 }).getName()),
        example(`createGetters({ name: "Ada", year: 1843 }).getYear()`, () => createGetters({ name: "Ada", year: 1843 }).getYear()),
      ],
    },
    {
      heading: "satisfies and Readonly",
      examples: [
        example(`roleLabels`, () => roleLabels),
        example(`Object.isFrozen(deepFreeze({ a: { b: 1 } }).a)`, () => Object.isFrozen(deepFreeze({ a: { b: 1 } }).a)),
      ],
    },
  ],
});
