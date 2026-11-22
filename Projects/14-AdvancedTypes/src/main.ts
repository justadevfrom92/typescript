// Run with: npm run build && node 14-AdvancedTypes/dist/main.js
import { addCents, cents, concat, countWords, deepMerge, getPath, routes, statusColors, userId } from "./advanced.js";

console.log(statusColors.active, userId("u_ada"), addCents(cents(150), cents(250)));
console.log(countWords("the cat and the hat"));
console.log(deepMerge({ theme: { color: "blue", size: 12 }, debug: false }, { theme: { size: 14 } }));
const config = { server: { port: 8080, host: "localhost" } };
console.log(getPath(config, "server.port"));
console.log(concat([1, "a"], [true]), routes(["/", "/about"]));
