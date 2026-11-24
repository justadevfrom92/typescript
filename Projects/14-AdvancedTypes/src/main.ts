import { example, showLesson } from "#shared/lessonPage.js";
import { addCents, cents, concat, countWords, deepMerge, getPath, isJson, on, partial, pickDefault, routes, statusColors, userId, type Event } from "./advanced.js";

const config = { server: { port: 8080, host: "localhost" }, debug: false };
const clicks: number[] = [];
const handleClick = on("click", (event) => clicks.push(event.x));
const events: Event[] = [
  { type: "click", x: 10, y: 5 },
  { type: "key", key: "a" },
  { type: "click", x: 42, y: 0 },
];

void showLesson({
  title: "14 · Advanced Types",
  intro: "Branded, recursive and variadic types, const type parameters and NoInfer. The type-level tests at the bottom of src/advanced.ts run when tsc compiles the project.",
  sections: [
    {
      heading: "keyof typeof and Extract",
      examples: [
        example("statusColors", () => statusColors),
        example("on(\"click\", handler) applied to 3 events (handler gets typed click events only)", () => {
          events.forEach(handleClick);
          return clicks;
        }),
      ],
    },
    {
      heading: "Branded types",
      note: "UserId and OrderId are both strings at runtime, but assigning one to the other is a compile error.",
      examples: [
        example('userId("u_ada")', () => userId("u_ada")),
        example('userId("ada")', () => userId("ada")),
        example("addCents(cents(150), cents(250))", () => addCents(cents(150), cents(250))),
        example("cents(1.5)", () => cents(1.5)),
      ],
    },
    {
      heading: "Index signatures and recursive types",
      examples: [
        example('countWords("the cat and the hat")', () => countWords("the cat and the hat")),
        example("deepMerge(config, { server: { port: 9090 } })", () => deepMerge(config, { server: { port: 9090 } })),
        example('getPath(config, "server.port")  // typed as number', () => getPath(config, "server.port")),
        example("isJson({ a: [1, null] })", () => isJson({ a: [1, null] })),
        example("isJson({ a: () => 1 })", () => isJson({ a: () => 1 })),
      ],
    },
    {
      heading: "Variadic tuples, const type parameters and NoInfer",
      examples: [
        example('concat([1, "a"], [true])  // type [number, string, boolean]', () => concat([1, "a"], [true])),
        example('partial((g: string, n: string) => `${g} ${n}`, "Hi")("Ada")', () => partial((greeting: string, name: string) => `${greeting} ${name}`, "Hi")("Ada")),
        example('routes(["/", "/about"])  // type readonly ["/", "/about"]', () => routes(["/", "/about"])),
        example('pickDefault(["small", "large"], "small")', () => pickDefault(["small", "large"], "small")),
      ],
    },
  ],
});
