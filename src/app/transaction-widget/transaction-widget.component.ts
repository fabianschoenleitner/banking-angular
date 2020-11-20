import {Component, OnInit, OnDestroy} from '@angular/core';
import {UserService} from '../services/user-service';
import {Account, Iban, Transaction, TransactionRequest} from '../api/Api';
import {AccountsDropdownComponent} from '../accounts-dropdown/accounts-dropdown.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-transaction-widget',
  templateUrl: './transaction-widget.component.html',
  styleUrls: ['./transaction-widget.component.scss']
})
export class TransactionWidgetComponent {

  ibanArr: Iban[] = [];
  account: Account = {iban: '123', balance: 0, name: '332', accountType: ''};
  transactions: Transaction[] = [];

  constructor(private userService: UserService) {
    const userData = JSON.parse(localStorage.getItem('user'));
    this.ibanArr = JSON.parse(localStorage.getItem('user')).accounts;

    this.userService.transactionWidgetSubject.subscribe(acc => {
      this.account = acc;
      let ibanArr = [this.account.iban];

      if (this.account.name === 'Alle Konten') {
        ibanArr = userData.accounts;
      }

      const transactionRequest: { request: TransactionRequest } = {request: {n: 0, offset: 5}};
      userService.getTransactions(transactionRequest, ibanArr).subscribe((response) => {
        let i = 0;
        this.transactions = [];
        while (i < response.length) {
          this.transactions = this.transactions.concat(response[i].transactions);
          i = i + 1;
        }
        console.log(this.transactions);
      });

    });
  }

  checkBalance(iban): string  {
    if (this.ibanArr.indexOf(iban) > -1) {
      return 'red';
    } else {
      return 'green';
    }
  }

}
