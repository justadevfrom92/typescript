// Standard (TC39) decorators, supported by TypeScript without experimentalDecorators.
// A decorator is just a function that receives the decorated thing and a context object.

export const calls: string[] = [];

/** Method decorator: logs every call with its arguments. */
export function logged<This, Args extends unknown[], Return>(
  method: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  return function (this: This, ...args: Args): Return {
    calls.push(`${String(context.name)}(${args.map((arg) => JSON.stringify(arg)).join(", ")})`);
    return method.call(this, ...args);
  };
}

/** Method decorator: binds the method so it can be passed around as a callback. */
export function bound<This, F extends (this: This, ...args: any[]) => unknown>(_method: F, context: ClassMethodDecoratorContext<This, F>) {
  context.addInitializer(function (this: This) {
    const self = this as Record<string | symbol, unknown>;
    self[context.name] = (self[context.name] as Function).bind(this);
  });
}

/** Field decorator: clamps the initial value into a range. */
export function clamp(min: number, max: number) {
  return function (_value: undefined, _context: ClassFieldDecoratorContext<unknown, number>) {
    return (initial: number) => Math.min(max, Math.max(min, initial));
  };
}

export class Volume {
  @clamp(0, 10) level = 15;

  @logged
  set(level: number): number {
    this.level = Math.min(10, Math.max(0, level));
    return this.level;
  }

  @bound
  louder(): number {
    return this.set(this.level + 1);
  }
}
