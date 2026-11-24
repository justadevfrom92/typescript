import { example, showLesson } from "#shared/lessonPage.js";
import { assert, debounce, increment, once, parseDate, pipe, SelectBuilder, shout, toArray } from "./functions.js";

const counter = { count: 0, step: 5 };
const slugify = pipe(
  (s: string) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, "-"),
);
let initCalls = 0;
const init = once((name: string) => `initialised by ${name} (call #${++initCalls})`);

void showLesson({
  title: "13 · Functions Deep Dive",
  intro: "Overloads, this parameters, assertion functions and generic composition. See src/functions.ts.",
  sections: [
    {
      heading: "Overloads",
      note: "parseDate(1, 2) is a compile error: no overload takes exactly two numbers.",
      examples: [
        example("parseDate(2026, 1, 15)", () => parseDate(2026, 1, 15)),
        example("parseDate(0)", () => parseDate(0)),
        example('parseDate("not a date")', () => parseDate("not a date")),
        example("toArray(1)", () => toArray(1)),
        example("toArray([1, 2])", () => toArray([1, 2])),
      ],
    },
    {
      heading: "this parameters and fluent this returns",
      examples: [
        example("increment.call(counter)", () => increment.call(counter)),
        example("increment.call(counter)", () => increment.call(counter)),
        example('new SelectBuilder("users").where("age > 18").limit(10).build()', () => new SelectBuilder("users").where("age > 18").limit(10).build()),
      ],
    },
    {
      heading: "Assertion functions",
      examples: [
        example('shout("typed!")', () => shout("typed!")),
        example("shout(42)", () => shout(42)),
        example('assert(1 > 2, "math is broken")', () => assert(1 > 2, "math is broken")),
      ],
    },
    {
      heading: "Generic composition: pipe, once, debounce",
      examples: [
        example('slugify("  Hello TypeScript World ")', () => slugify("  Hello TypeScript World ")),
        example('init("first"); init("second")', () => [init("first"), init("second")]),
        example('debounced("a"); debounced("b"); debounced("c")  // after 50 ms', async () => {
          const seen: string[] = [];
          const debounced = debounce((value: string) => seen.push(value), 20);
          debounced("a");
          debounced("b");
          debounced("c");
          await new Promise((resolve) => setTimeout(resolve, 50));
          return seen;
        }),
      ],
    },
  ],
});
