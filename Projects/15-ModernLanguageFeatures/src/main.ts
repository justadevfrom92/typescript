// Run with: npm run build && node 15-ModernLanguageFeatures/dist/main.js
import { calls, Volume } from "./decorators.js";
import { fibonacci, Range, take } from "./iterators.js";
import { log, query, writeTwoFiles } from "./resources.js";
import { Temperature } from "./symbols.js";

console.log([...new Range(0, 10, 3)], [...take(fibonacci(), 8)]);
console.log(`${new Temperature(21)}`, +new Temperature(21));

try {
  writeTwoFiles(true);
} catch (error) {
  console.log("Caught:", (error as Error).message);
}
await query();
console.log(log);

const volume = new Volume();
const louder = volume.louder; // safe to detach thanks to @bound
louder();
console.log(volume.level, calls);
