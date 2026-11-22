// Run with: npm run build && node 02-UnionsAndNarrowing/dist/main.js
import { area, type Shape } from "./shapes.js";
import { renderStatus, toMessage } from "./narrowing.js";

const shapes: Shape[] = [
  { kind: "circle", radius: 1 },
  { kind: "rectangle", width: 2, height: 3 },
  { kind: "triangle", base: 4, height: 5 },
];
for (const shape of shapes) console.log(shape.kind, area(shape).toFixed(2));

console.log(renderStatus({ status: "loading" }));
console.log(renderStatus({ status: "success", data: ["a", "b"] }));
console.log(toMessage(new Error("Something broke")));
