// Run with: npm run build && node 01-BasicTypes/dist/main.js
import { average, describeSize, formatPrice, formatters, greet, splitName, toNumber } from "./basics.js";

console.log(greet("TypeScript"));
console.log(formatPrice(1999), formatPrice(500, "EUR"));
console.log(splitName("Grace Brewster Hopper"));
console.log("Average:", average([3, 4, 5]));
console.log(describeSize({ name: "T-shirt", size: "medium", quantity: 2 }));
console.log(toNumber("42"), toNumber("forty-two"), toNumber(undefined));
console.log(formatters.percent(0.256), formatters.fixed(Math.PI));
