// The lesson page: every example below runs in the browser and shows its result.
import { example, showLesson } from "#shared/lessonPage.js";
import { average, describeSize, fail, formatPrice, formatters, greet, isSize, Sizes, splitName, toNumber } from "./basics.js";

void showLesson({
  title: "01 · Basic Types",
  intro: "Annotations, literal unions, tuples, readonly arrays, unknown and never. Open src/basics.ts next to this page.",
  sections: [
    {
      heading: "Functions with optional and default parameters",
      examples: [
        example(`greet("TypeScript")`, () => greet("TypeScript")),
        example(`greet("Ada", "Hi", "?")`, () => greet("Ada", "Hi", "?")),
      ],
    },
    {
      heading: "Literal union types",
      note: 'formatPrice only accepts "USD" | "EUR" | "GBP". Passing "JPY" is a compile error.',
      examples: [
        example(`formatPrice(1999)`, () => formatPrice(1999)),
        example(`formatPrice(500, "EUR")`, () => formatPrice(500, "EUR")),
        example(`Sizes  // declared with as const`, () => Sizes),
        example(`isSize("medium")`, () => isSize("medium")),
        example(`isSize("huge")`, () => isSize("huge")),
      ],
    },
    {
      heading: "Tuples, readonly arrays and object types",
      examples: [
        example(`splitName("Grace Brewster Hopper")`, () => splitName("Grace Brewster Hopper")),
        example(`average([3, 4, 5])`, () => average([3, 4, 5])),
        example(`average([])`, () => average([])),
        example(`describeSize({ name: "T-shirt", size: "medium", quantity: 2 })`, () => describeSize({ name: "T-shirt", size: "medium", quantity: 2 })),
      ],
    },
    {
      heading: "unknown, function types and never",
      examples: [
        example(`toNumber("42")`, () => toNumber("42")),
        example(`toNumber("forty-two")`, () => toNumber("forty-two")),
        example(`toNumber(undefined)`, () => toNumber(undefined)),
        example(`formatters.percent(0.256)`, () => formatters.percent(0.256)),
        example(`fail("boom")`, () => fail("boom")),
      ],
    },
  ],
});
