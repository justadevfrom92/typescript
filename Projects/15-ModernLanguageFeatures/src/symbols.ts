// Symbols: unique keys that never collide with string keys.

export const secret: unique symbol = Symbol("secret");

export type Vault = { label: string; [secret]: string };

export function createVault(label: string, value: string): Vault {
  return { label, [secret]: value };
}

// Symbol keys are skipped by JSON.stringify and Object.keys.
export function publicView(vault: Vault): string {
  return JSON.stringify(vault);
}

// Well-known symbols customise built-in behaviour.
export class Temperature {
  constructor(readonly celsius: number) {}

  [Symbol.toPrimitive](hint: "number" | "string" | "default"): number | string {
    return hint === "number" ? this.celsius : `${this.celsius}°C`;
  }

  get [Symbol.toStringTag](): string {
    return "Temperature";
  }
}
