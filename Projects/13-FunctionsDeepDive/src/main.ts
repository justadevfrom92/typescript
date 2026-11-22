// Run with: npm run build && node 13-FunctionsDeepDive/dist/main.js
import { increment, parseDate, pipe, SelectBuilder, shout } from "./functions.js";

console.log(parseDate(2026, 1, 15).toISOString(), parseDate("not a date"));
const counter = { count: 0, step: 5 };
console.log(increment.call(counter), increment.call(counter));
console.log(new SelectBuilder("users").where("age > 18").limit(10).build());
const slugify = pipe((s: string) => s.trim(), (s) => s.toLowerCase(), (s) => s.replace(/\s+/g, "-"));
console.log(slugify("  Hello TypeScript World "));
console.log(shout("typed!"));
