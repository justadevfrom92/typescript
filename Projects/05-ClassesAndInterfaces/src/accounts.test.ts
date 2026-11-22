import { test } from "node:test";
import assert from "node:assert/strict";
import { CheckingAccount, describeAll, InsufficientFundsError, SavingsAccount } from "./accounts.js";

test("deposits and interest", () => {
  const account = new SavingsAccount("Ada");
  account.deposit(200);
  account.addInterest(10);
  assert.equal(account.balance, 220);
});

test("savings cannot overdraw", () => {
  const account = new SavingsAccount("Ada");
  assert.throws(() => account.withdraw(1), InsufficientFundsError);
});

test("checking can overdraw up to its limit", () => {
  const account = new CheckingAccount("Alan", 50);
  account.withdraw(50);
  assert.equal(account.balance, -50);
  assert.throws(() => account.withdraw(1), InsufficientFundsError);
});

test("invalid amounts are rejected", () => {
  assert.throws(() => new SavingsAccount("A").deposit(-5), RangeError);
});

test("events carry typed payloads and can unsubscribe", () => {
  const account = new SavingsAccount("Ada");
  const seen: number[] = [];
  const stop = account.on("deposited", ({ balance }) => seen.push(balance));
  account.deposit(10);
  stop();
  account.deposit(10);
  assert.deepEqual(seen, [10]);
});

test("ids are unique and describe works through the interface", () => {
  const a = new SavingsAccount("A");
  const b = new CheckingAccount("B");
  assert.notEqual(a.id, b.id);
  assert.match(describeAll([a, b])[1] ?? "", /overdraft 100/);
});
