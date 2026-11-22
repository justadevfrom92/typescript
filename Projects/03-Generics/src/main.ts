// Run with: npm run build && node 03-Generics/dist/main.js
import { groupBy, pluck, Queue, sortBy } from "./generics.js";

const books = [
  { title: "Dune", year: 1965, genre: "sci-fi" },
  { title: "Emma", year: 1815, genre: "classic" },
  { title: "Neuromancer", year: 1984, genre: "sci-fi" },
];

console.log(pluck(books, "title"));
console.log(sortBy(books, "year").map((book) => book.year));
console.log(Object.keys(groupBy(books, (book) => book.genre)));

const queue = new Queue<number>().enqueue(1).enqueue(2);
console.log("Dequeued", queue.dequeue(), "remaining", queue.size);
