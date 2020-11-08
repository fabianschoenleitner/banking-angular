import {TransactionModel} from '../transaction/transaction-model';

export class AccountModel {
  public id: string;
  public balance: number;
  public name: string;
  public transactions: TransactionModel[];

  constructor(id: string, balance: number, name: string, transactions: TransactionModel[]) {
    this.id = id;
    this.balance = balance;
    this.name = name;
    this.transactions = transactions;
  }
}
