import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Account} from '../api/Api';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  account: Account = { iban: '123',  balance: 0, name: '332', accountType: '',  };

  constructor(private userService: UserService) {
    this.userService.accountSubject.subscribe(acc => {
      this.account = acc;
      console.log(this.account);
    });
  }

  ngOnInit(): void {
  }
}
