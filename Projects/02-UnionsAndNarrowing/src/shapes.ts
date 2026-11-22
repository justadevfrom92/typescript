// Lesson 02: union types, discriminated unions, narrowing and exhaustiveness.

export type Circle = { kind: "circle"; radius: number };
export type Rectangle = { kind: "rectangle"; width: number; height: number };
export type Triangle = { kind: "triangle"; base: number; height: number };
export type Shape = Circle | Rectangle | Triangle;

// The `kind` field lets TypeScript narrow inside each `case`.
export function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape); // Adding a new Shape without a case is a compile error.
  }
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}
