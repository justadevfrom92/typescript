// Minimal hand-written types for Node's built-in test runner and assert module.
// They replace @types/node so the repository keeps zero third-party type packages.

declare module "node:test" {
  type TestFn = () => void | Promise<void>;
  export function test(name: string, fn: TestFn): Promise<void>;
  export function describe(name: string, fn: () => void): void;
  export function beforeEach(fn: TestFn): void;
  export function afterEach(fn: TestFn): void;
}

declare module "node:assert/strict" {
  interface Assert {
    (value: unknown, message?: string): asserts value;
    ok(value: unknown, message?: string): asserts value;
    equal<T>(actual: unknown, expected: T, message?: string): asserts actual is T;
    notEqual(actual: unknown, expected: unknown, message?: string): void;
    deepEqual<T>(actual: unknown, expected: T, message?: string): asserts actual is T;
    throws(fn: () => unknown, expected?: RegExp | (new (...args: any[]) => Error), message?: string): void;
    rejects(promise: Promise<unknown> | (() => Promise<unknown>), expected?: RegExp | (new (...args: any[]) => Error), message?: string): Promise<void>;
    match(value: string, pattern: RegExp, message?: string): void;
  }
  const assert: Assert;
  export default assert;
}

// Just enough of node:fs for tests that read source files.
declare module "node:fs" {
  export function readFileSync(path: string | URL, encoding: "utf8"): string;
  export function readdirSync(path: string | URL): string[];
  export function existsSync(path: string | URL): boolean;
}
