import "./polyfills.js"; // first: defines Symbol.dispose in older browsers
import { example, showLesson } from "#shared/lessonPage.js";
import { calls, Volume } from "./decorators.js";
import { collect, fibonacci, mapIterable, paginate, Range, runningTotal, take } from "./iterators.js";
import { log, query, writeTwoFiles } from "./resources.js";
import { createVault, publicView, secret, Temperature } from "./symbols.js";

void showLesson({
  title: "15 · Modern Language Features",
  intro: "Iterators, generators, symbols, using and decorators, compiled by tsc into code your browser runs today.",
  sections: [
    {
      heading: "Iterables and generators",
      examples: [
        example("[...new Range(0, 10, 3)]", () => [...new Range(0, 10, 3)]),
        example("[...take(fibonacci(), 10)]", () => [...take(fibonacci(), 10)]),
        example("[...mapIterable(new Range(1, 5), (n) => n * n)]", () => [...mapIterable(new Range(1, 5), (n) => n * n)]),
        example("runningTotal(): next(), next(5), next(10), next()", () => {
          const total = runningTotal();
          return [total.next(), total.next(5), total.next(10), total.next()].map((step) => step.value);
        }),
        example("await collect(paginate(fetchPage))  // 3 fake pages", () =>
          collect(paginate(async (page) => [[1, 2], [3], []][page - 1] ?? [])),
        ),
      ],
    },
    {
      heading: "Symbols",
      examples: [
        example('createVault("main", "s3cret")[secret]', () => createVault("main", "s3cret")[secret]),
        example('publicView(createVault("main", "s3cret"))', () => publicView(createVault("main", "s3cret"))),
        example("`${new Temperature(21)}`", () => `${new Temperature(21)}`),
        example("+new Temperature(21)", () => +new Temperature(21)),
      ],
    },
    {
      heading: "Explicit resource management: using",
      note: "Resources are disposed in reverse order, even when an error is thrown halfway.",
      examples: [
        example("writeTwoFiles(true) (throws), then read the log", () => {
          log.length = 0;
          try {
            writeTwoFiles(true);
          } catch {
            // expected: "disk full"
          }
          return [...log];
        }),
        example("await query() with await using", async () => {
          log.length = 0;
          const rows = await query();
          return { rows, log: [...log] };
        }),
      ],
    },
    {
      heading: "Standard decorators",
      examples: [
        example("new Volume().level  // @clamp(0, 10) on an initial 15", () => new Volume().level),
        example("const louder = volume.louder; louder()  // @bound", () => {
          calls.length = 0;
          const volume = new Volume();
          const louder = volume.louder;
          return louder();
        }),
        example("calls logged by @logged", () => [...calls]),
      ],
    },
  ],
});
