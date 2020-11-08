import {TransactionModel} from '../transaction/transaction-model';

export class AccountModel {
  public iban: string;
  public balance: number;
  public name: string;
  public accountType: string;
  public transactions: TransactionModel[];

  constructor(iban: string, balance: number, name: string, accountType: string, transactions: TransactionModel[]) {
    this.iban = iban;
    this.balance = balance;
    this.name = name;
    this.accountType = accountType;
    this.transactions = transactions;
  }
}
