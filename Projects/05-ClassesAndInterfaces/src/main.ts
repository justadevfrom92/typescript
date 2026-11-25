import { example, showLesson } from "#shared/lessonPage.js";
import { CheckingAccount, describeAll, SavingsAccount } from "./accounts.js";

const savings = new SavingsAccount("Ada");
const events: string[] = [];
savings.on("deposited", ({ amount, balance }) => events.push(`+${amount} → ${balance}`));
const checking = new CheckingAccount("Alan", 50);

void showLesson({
  title: "05 · Classes & Interfaces",
  intro: "An abstract Account class with two subclasses, private fields and a typed event emitter. See src/accounts.ts and src/events.ts.",
  sections: [
    {
      heading: "SavingsAccount (no overdraft)",
      examples: [
        example(`savings.deposit(1000);
savings.balance;`, () => {
          savings.deposit(1000);
          return savings.balance;
        }),
        example(`savings.addInterest(5);
savings.balance;`, () => {
          savings.addInterest(5);
          return savings.balance;
        }),
        example(`events  // filled by the typed 'deposited' listener`, () => events),
        example(`savings.withdraw(5000)`, () => savings.withdraw(5000)),
        example(`savings.deposit(-5)`, () => savings.deposit(-5)),
      ],
    },
    {
      heading: "CheckingAccount (overdraft 50)",
      examples: [
        example(`checking.withdraw(30);
checking.balance;`, () => {
          checking.withdraw(30);
          return checking.balance;
        }),
        example(`checking.withdraw(30)`, () => checking.withdraw(30)),
      ],
    },
    {
      heading: "Interfaces: Describable",
      note: "describeAll() accepts anything with describe(). savings.emit(...) would not compile because emit is protected.",
      examples: [example(`describeAll([savings, checking])`, () => describeAll([savings, checking]))],
    },
  ],
});
