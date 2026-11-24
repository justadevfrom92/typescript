// `using` needs Symbol.dispose / Symbol.asyncDispose. Browsers that predate them get
// stand-in symbols, so the compiled `using` code works everywhere.
// This module must be imported before any module that defines a [Symbol.dispose] method.
const symbols = Symbol as unknown as { dispose?: symbol; asyncDispose?: symbol };
symbols.dispose ??= Symbol("Symbol.dispose");
symbols.asyncDispose ??= Symbol("Symbol.asyncDispose");

export {};
