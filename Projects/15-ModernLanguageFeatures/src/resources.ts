// Explicit resource management: `using` calls [Symbol.dispose]() automatically
// when the variable goes out of scope, even if an error is thrown.

export const log: string[] = [];

export class TempFile implements Disposable {
  #open = true;
  constructor(readonly name: string) {
    log.push(`open ${name}`);
  }

  write(text: string): void {
    if (!this.#open) throw new Error("File is closed");
    log.push(`write ${this.name}: ${text}`);
  }

  [Symbol.dispose](): void {
    this.#open = false;
    log.push(`close ${this.name}`);
  }
}

export class Connection implements AsyncDisposable {
  constructor(readonly id: number) {
    log.push(`connect ${id}`);
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await Promise.resolve();
    log.push(`disconnect ${this.id}`);
  }
}

export function writeTwoFiles(failHalfway: boolean): void {
  using first = new TempFile("a.txt");
  using second = new TempFile("b.txt");
  first.write("hello");
  if (failHalfway) throw new Error("disk full");
  second.write("world");
} // Disposed in reverse order: b.txt, then a.txt.

export async function query(): Promise<string> {
  await using connection = new Connection(1);
  log.push(`query on ${connection.id}`);
  return "rows";
}
