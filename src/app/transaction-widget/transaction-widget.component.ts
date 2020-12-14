import {Component} from '@angular/core';
import {UserService} from '../services/user-service';
import {Account, Iban, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';

@Component({
  selector: 'app-transaction-widget',
  templateUrl: './transaction-widget.component.html',
  styleUrls: ['./transaction-widget.component.scss']
})
export class TransactionWidgetComponent {

  ibanArr: Iban[];
  account: Account;
  transactions: Transaction[];

  constructor(private userService: UserService) {

  }

  checkBalance(amount): string {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  getAccount(account: Account): void {
    this.account = account;
    this.ibanArr = this.userService.getIbans(this.account);
    const request: TransactionRequest = {n: 100, stored: false};
    this.userService.getTransactions(request, this.ibanArr).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
    });
  }

}
