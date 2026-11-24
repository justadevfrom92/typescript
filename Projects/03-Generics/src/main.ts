import { example, showLesson } from "#shared/lessonPage.js";
import { first, groupBy, memoize, pluck, Queue, sortBy, TtlCache, uniqueBy } from "./generics.js";

const books = [
  { title: "Dune", year: 1965, genre: "sci-fi" },
  { title: "Emma", year: 1815, genre: "classic" },
  { title: "Neuromancer", year: 1984, genre: "sci-fi" },
];

let squareCalls = 0;
const square = memoize((n: number) => {
  squareCalls++;
  return n * n;
});

void showLesson({
  title: "03 · Generics",
  intro: "Type parameters link inputs to outputs. All examples use the books array below; see src/generics.ts.",
  sections: [
    {
      heading: "Generic functions and keyof constraints",
      note: 'pluck(books, "author") would not compile: "author" is not a key of the book type.',
      examples: [
        example("books", () => books),
        example("first(books)", () => first(books)),
        example('pluck(books, "title")', () => pluck(books, "title")),
        example('sortBy(books, "year")', () => pluck(sortBy(books, "year"), "year")),
        example("groupBy(books, (b) => b.genre)", () => groupBy(books, (book) => book.genre)),
        example("uniqueBy(books, (b) => b.genre)", () => pluck(uniqueBy(books, (book) => book.genre), "title")),
      ],
    },
    {
      heading: "Generic higher-order functions",
      examples: [
        example("square(4); square(4); square(4)", () => [square(4), square(4), square(4)]),
        example("how many times the real function ran", () => squareCalls),
      ],
    },
    {
      heading: "Generic classes",
      examples: [
        example("new Queue<number>().enqueue(1).enqueue(2).dequeue()", () => new Queue<number>().enqueue(1).enqueue(2).dequeue()),
        example('const cache = new TtlCache<string>(1000); cache.set("k", "v"); cache.get("k")', () => {
          const cache = new TtlCache<string>(1000);
          cache.set("k", "v");
          return cache.get("k");
        }),
        example("…after the time-to-live passes", () => {
          let now = 0;
          const cache = new TtlCache<string>(1000, () => now);
          cache.set("k", "v");
          now = 1500;
          return cache.get("k");
        }),
      ],
    },
  ],
});
