import { example, showLesson } from "#shared/lessonPage.js";
import { describeOptions, doubleTyped, errorMessage, firstUpper, FixedChild, nameLength, readEnv, signFixed, total } from "./strictness.js";

void showLesson({
  title: "17 · Compiler & Strictness",
  intro:
    "src/strictness.ts holds one rejected line per flag, marked // @ts-expect-error. If a flag is turned off in tsconfig.json, the build fails. This page runs the corrected code.",
  sections: [
    {
      heading: "strict: null checks, implicit any, unknown in catch",
      examples: [
        example("nameLength(null)", () => nameLength(null)),
        example('nameLength("Ada")', () => nameLength("Ada")),
        example("doubleTyped(21)", () => doubleTyped(21)),
        example('errorMessage(() => { throw new Error("bad") })', () => errorMessage(() => { throw new Error("bad"); })),
        example('errorMessage(() => { throw "a plain string" })', () => errorMessage(() => { throw "a plain string"; })),
      ],
    },
    {
      heading: "noUncheckedIndexedAccess and exactOptionalPropertyTypes",
      examples: [
        example("firstUpper([])", () => firstUpper([])),
        example('firstUpper(["ts"])', () => firstUpper(["ts"])),
        example("describeOptions({})", () => describeOptions({})),
        example('describeOptions({ color: "red" })', () => describeOptions({ color: "red" })),
      ],
    },
    {
      heading: "Index signatures, returns, overrides and unused code",
      examples: [
        example('readEnv({ HOME: "/home/ada" })', () => readEnv({ HOME: "/home/ada" })),
        example("[1, -1, 0].map(signFixed)", () => [1, -1, 0].map(signFixed)),
        example("new FixedChild().render()", () => new FixedChild().render()),
        example('total([1, 2], "USD")', () => total([1, 2], "USD")),
      ],
    },
  ],
});
