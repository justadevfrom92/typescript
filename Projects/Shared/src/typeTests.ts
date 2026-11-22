// Type-level testing: these helpers make the compiler itself the test runner.
// `type _ = Expect<Equal<A, B>>` fails to compile unless A and B are identical.
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
export type Expect<T extends true> = T;
