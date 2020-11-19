import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user-service';
import {Account, Transaction, TransactionRequest} from '../api/Api';
import { AccountsDropdownComponent } from '../accounts-dropdown/accounts-dropdown.component';

@Component({
  selector: 'app-transaction-widget',
  templateUrl: './transaction-widget.component.html',
  styleUrls: ['./transaction-widget.component.scss']
})
export class TransactionWidgetComponent implements OnInit {

  account: Account = {iban: '123', balance: 0, name: '332', accountType: ''};
  transactions: Transaction[];

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('user'));

    this.userService.transactionWidgetSubject.subscribe(acc => {
      this.account = acc;
      let ibanArr = [this.account.iban];
      console.log(this.account.iban);

      if (this.account.name === 'Alle Konten') {
        ibanArr = userData.accounts;
      }

      const transactionRequest: { request: TransactionRequest } = {request: {n: 0, offset: 5}};
      this.userService.getTransactions(transactionRequest, ibanArr).subscribe((trans: { transactions: Transaction[] }) => {
        this.transactions = trans.transactions;
        console.log(this.transactions);
      });

    });
  }

  checkBalance(amount): string {
    if (amount > 0) {
      return 'green';
    } else {
      return 'red';
    }
  }



}
