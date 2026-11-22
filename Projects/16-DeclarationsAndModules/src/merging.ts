// Declaration merging and namespaces.

// 1. Interfaces with the same name merge into one.
export interface Box {
  width: number;
}
export interface Box {
  height: number;
}
export const box: Box = { width: 2, height: 3 };

// 2. A function and a namespace with the same name merge: a callable with properties.
export function format(value: number): string {
  return format.prefix + value.toFixed(format.digits);
}
export namespace format {
  export let prefix = "$";
  export let digits = 2;
}

// 3. A class and a namespace merge: static helpers and related types grouped together.
export class Color {
  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
  ) {}
  toHex(): string {
    return "#" + [this.r, this.g, this.b].map((n) => n.toString(16).padStart(2, "0")).join("");
  }
}
export namespace Color {
  export type Name = "red" | "black";
  export const named: Record<Name, Color> = { red: new Color(255, 0, 0), black: new Color(0, 0, 0) };
}

// 4. Namespaces as plain grouping. Modules are preferred today, but namespaces are still
//    common in older code and in .d.ts files.
export namespace Validation {
  export interface Validator {
    isValid(input: string): boolean;
  }
  const digits = /^\d+$/;
  export const zipCode: Validator = { isValid: (input) => input.length === 5 && digits.test(input) };
  export const nonEmpty: Validator = { isValid: (input) => input.trim().length > 0 };
}
