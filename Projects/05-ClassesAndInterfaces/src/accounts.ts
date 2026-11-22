// Lesson 05: interfaces, classes, access modifiers, private fields, inheritance,
// abstract classes and static members.
import { TypedEmitter } from "./events.js";

export interface Identifiable {
  readonly id: string;
}

export interface Describable {
  describe(): string;
}

type AccountEvents = {
  deposited: { amount: number; balance: number };
  withdrew: { amount: number; balance: number };
};

export class InsufficientFundsError extends Error {
  constructor(
    public readonly requested: number,
    public readonly available: number,
  ) {
    super(`Cannot withdraw ${requested}; only ${available} available.`);
    this.name = "InsufficientFundsError";
  }
}

export abstract class Account extends TypedEmitter<AccountEvents> implements Identifiable, Describable {
  static #nextId = 1;
  readonly id: string;
  #balance = 0; // truly private at runtime

  constructor(public readonly owner: string) {
    super();
    this.id = `ACC-${Account.#nextId++}`;
  }

  get balance(): number {
    return this.#balance;
  }

  deposit(amount: number): void {
    Account.assertPositive(amount);
    this.#balance += amount;
    this.emit("deposited", { amount, balance: this.#balance });
  }

  withdraw(amount: number): void {
    Account.assertPositive(amount);
    const available = this.#balance + this.overdraftLimit();
    if (amount > available) throw new InsufficientFundsError(amount, available);
    this.#balance -= amount;
    this.emit("withdrew", { amount, balance: this.#balance });
  }

  /** Subclasses decide how far below zero the balance may go. */
  protected abstract overdraftLimit(): number;

  describe(): string {
    return `${this.id} (${this.owner}): ${this.#balance}`;
  }

  private static assertPositive(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) throw new RangeError("Amount must be a positive number.");
  }
}

export class SavingsAccount extends Account {
  protected overdraftLimit(): number {
    return 0;
  }

  addInterest(ratePercent: number): void {
    const interest = Math.round((this.balance * ratePercent) / 100);
    if (interest > 0) this.deposit(interest);
  }
}

export class CheckingAccount extends Account {
  constructor(
    owner: string,
    private readonly overdraft = 100,
  ) {
    super(owner);
  }

  protected overdraftLimit(): number {
    return this.overdraft;
  }

  override describe(): string {
    return `${super.describe()} (overdraft ${this.overdraft})`;
  }
}

// Interfaces describe behavior, so unrelated classes can share a function.
export function describeAll(items: readonly Describable[]): string[] {
  return items.map((item) => item.describe());
}
