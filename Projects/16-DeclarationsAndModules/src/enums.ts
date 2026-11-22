// Enums vs. `as const` unions.

// A numeric enum generates a real runtime object with a reverse mapping (Direction[0] === "Up").
export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// String enums have no reverse mapping and must be referenced by name.
export enum LogLevel {
  Debug = "debug",
  Info = "info",
  Error = "error",
}

export function isLoud(level: LogLevel): boolean {
  return level === LogLevel.Error;
}

// The usual alternative: a plain object plus a derived union type.
// It is plain JavaScript, accepts string literals, and is erased by any type-stripping tool.
export const Theme = { Light: "light", Dark: "dark" } as const;
export type Theme = (typeof Theme)[keyof typeof Theme]; // "light" | "dark"

export function themeClass(theme: Theme): string {
  return `theme-${theme}`;
}
// themeClass("dark") is fine. isLoud("error") is a compile error: it needs LogLevel.Error.
