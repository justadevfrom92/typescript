// Lesson 17: what each strictness flag catches.
// Every `// @ts-expect-error` line is a real compiler error. If a flag were switched off,
// the line would compile, the directive would be "unused", and the build would fail.
// So this file proves the flags in tsconfig.json are working.

// --- strictNullChecks (part of "strict") ------------------------------------
// "Mistake" functions hold the rejected code. They are exported but never called.
export function nameLengthMistake(name: string | null): number {
  // @ts-expect-error 'name' is possibly 'null'.
  return name.length;
}
export function nameLength(name: string | null): number {
  return name?.length ?? 0;
}

// --- noImplicitAny (part of "strict") ---------------------------------------
// @ts-expect-error Parameter 'value' implicitly has an 'any' type.
export const double = (value) => value * 2;
export const doubleTyped = (value: number) => value * 2;

// --- useUnknownInCatchVariables (part of "strict") --------------------------
export function errorMessage(run: () => void): string {
  try {
    run();
    return "ok";
  } catch (error) {
    // @ts-expect-error 'error' is of type 'unknown'.
    void error.message;
    return error instanceof Error ? error.message : String(error);
  }
}

// --- strictPropertyInitialization (part of "strict") ------------------------
export class Profile {
  // @ts-expect-error Property 'nickname' has no initializer and is not definitely assigned.
  nickname: string;
  name: string;
  bio = "";
  constructor(name: string) {
    this.name = name;
  }
}

// --- strictFunctionTypes (part of "strict") ---------------------------------
type Animal = { name: string };
type Dog = Animal & { bark(): string };
export const greetAnimal = (animal: Animal) => `Hi ${animal.name}`;
export const handlers: { dog: (dog: Dog) => string } = { dog: greetAnimal }; // OK: accepts more
// @ts-expect-error A handler that needs a Dog cannot be used where any Animal may be passed.
export const unsafeHandler: (animal: Animal) => string = (dog: Dog) => dog.bark();

// --- noUncheckedIndexedAccess -----------------------------------------------
export function firstUpperMistake(words: string[]): string {
  // @ts-expect-error Object is possibly 'undefined': words[0] may not exist.
  return words[0].toUpperCase();
}
export function firstUpper(words: string[]): string {
  return words[0]?.toUpperCase() ?? "";
}

// --- exactOptionalPropertyTypes ---------------------------------------------
export type Options = { color?: string };
// @ts-expect-error `undefined` is not the same as "missing" under this flag.
export const explicitUndefined: Options = { color: undefined };
export const missing: Options = {};
export function describeOptions(options: Options): string {
  return "color" in options ? `color=${options.color}` : "default color";
}

// --- noPropertyAccessFromIndexSignature -------------------------------------
export function readEnv(env: Record<string, string | undefined>): string {
  // @ts-expect-error Index-signature keys must use bracket access, making the guess visible.
  void env.HOME;
  return env["HOME"] ?? "/";
}

// --- noImplicitReturns ------------------------------------------------------
// @ts-expect-error Not all code paths return a value.
export function sign(n: number): string {
  if (n > 0) return "+";
  if (n < 0) return "-";
}
export function signFixed(n: number): string {
  return n > 0 ? "+" : n < 0 ? "-" : "0";
}

// --- noFallthroughCasesInSwitch ---------------------------------------------
export function size(code: "s" | "m" | "l"): number {
  let result = 0;
  switch (code) {
    // @ts-expect-error Fallthrough case in switch.
    case "s":
      result += 1;
    case "m":
      result += 2;
      break;
    case "l":
      result = 3;
  }
  return result;
}

// --- noImplicitOverride -----------------------------------------------------
class Base {
  render(): string {
    return "base";
  }
}
export class Child extends Base {
  // @ts-expect-error This member must have an 'override' modifier.
  render(): string {
    return "child";
  }
}
export class FixedChild extends Base {
  override render(): string {
    return "fixed child";
  }
}

// --- noUnusedLocals / noUnusedParameters ------------------------------------
export function total(prices: number[], _currency: string): number {
  // @ts-expect-error 'tax' is declared but its value is never read.
  const tax = 0.2;
  return prices.reduce((sum, price) => sum + price, 0); // prefix unused params with _ to allow them
}
