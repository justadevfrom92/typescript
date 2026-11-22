// Global augmentation: add to built-in types or the global scope.
// Use sparingly; it affects every file in the program.

declare global {
  interface Array<T> {
    /** Last element, or undefined for an empty array. */
    lastItem(): T | undefined;
  }
  // `var` (not let/const) is required to declare a property of globalThis.
  var appVersion: string | undefined;
}

if (!Array.prototype.lastItem) {
  Object.defineProperty(Array.prototype, "lastItem", {
    value: function <T>(this: T[]) {
      return this[this.length - 1];
    },
    configurable: true,
  });
}

globalThis.appVersion = "16.0.0";

export {}; // Makes this file a module, so `declare global` is allowed.
