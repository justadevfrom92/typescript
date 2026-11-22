// Run with: npm run build && node 05-ClassesAndInterfaces/dist/main.js
import { CheckingAccount, describeAll, InsufficientFundsError, SavingsAccount } from "./accounts.js";

const savings = new SavingsAccount("Ada");
savings.on("deposited", ({ amount, balance }) => console.log(`+${amount} -> ${balance}`));
savings.deposit(1000);
savings.addInterest(5);

const checking = new CheckingAccount("Alan", 50);
checking.withdraw(30);

try {
  savings.withdraw(5000);
} catch (error) {
  if (error instanceof InsufficientFundsError) console.log(error.message);
}

console.log(describeAll([savings, checking]));
