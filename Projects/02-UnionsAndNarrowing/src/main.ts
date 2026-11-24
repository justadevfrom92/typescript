import { example, showLesson } from "#shared/lessonPage.js";
import { describeCount, emailsOnly, move, padLeft, renderStatus, toMessage } from "./narrowing.js";
import { area, type Shape } from "./shapes.js";

const shapes: Shape[] = [
  { kind: "circle", radius: 1 },
  { kind: "rectangle", width: 2, height: 3 },
  { kind: "triangle", base: 4, height: 5 },
];

void showLesson({
  title: "02 · Unions & Narrowing",
  intro: "Discriminated unions, exhaustive switch statements and every way to narrow a union. See src/shapes.ts and src/narrowing.ts.",
  sections: [
    {
      heading: "Discriminated union: Shape",
      note: "area() switches on shape.kind. Adding a new Shape without a case is a compile error thanks to assertNever.",
      examples: shapes.map((shape) => example(`area(${JSON.stringify(shape)})`, () => Number(area(shape).toFixed(2)))),
    },
    {
      heading: "Narrowing with typeof, equality, in and instanceof",
      examples: [
        example('padLeft("x", 3)', () => padLeft("x", 3)),
        example('padLeft("x", "> ")', () => padLeft("x", "> ")),
        example("describeCount(null)", () => describeCount(null)),
        example("describeCount(0)", () => describeCount(0)),
        example('move({ fly: () => "flap!" })', () => move({ fly: () => "flap!" })),
        example('toMessage(new Error("Something broke"))', () => toMessage(new Error("Something broke"))),
        example("toMessage(42)", () => toMessage(42)),
      ],
    },
    {
      heading: "Type predicates",
      examples: [
        example("emailsOnly([...])", () =>
          emailsOnly([
            { type: "email", address: "ada@example.com" },
            { type: "phone", number: "555-0101" },
          ]),
        ),
      ],
    },
    {
      heading: "RemoteData<T>: async state as a union",
      examples: [
        example('renderStatus({ status: "idle" })', () => renderStatus({ status: "idle" })),
        example('renderStatus({ status: "loading" })', () => renderStatus({ status: "loading" })),
        example('renderStatus({ status: "success", data: ["a", "b"] })', () => renderStatus({ status: "success", data: ["a", "b"] })),
        example('renderStatus({ status: "error", error: "offline" })', () => renderStatus({ status: "error", error: "offline" })),
      ],
    },
  ],
});
