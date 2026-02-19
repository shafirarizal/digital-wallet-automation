export class DigitalWallet {
  private balance: number;

  constructor(initialBalance: number = 0) {
    this.balance = initialBalance;
  }

  getBalance(): number {
    return this.balance;
  }

  deductFunds(amount: number): number {
    if (amount > this.balance) {
      throw new Error('Insufficient funds: Deduction exceeds current balance');
    }
    this.balance -= amount;
    return this.balance;
  }
}