import {Component, OnInit} from '@angular/core';

import {Account} from '../api/Api';
import {UserService} from '../services/user-service';
import {AuthService} from '../services/auth-service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  account: Account = {iban: '123', balance: 0, name: '332', accountType: '',};
  collapsed = true;
  mobile = false;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              public authService: AuthService,
              public breakpointObserver: BreakpointObserver, private userService: UserService) {
    this.userService.accountSubject.subscribe(acc => {
      this.account = acc;
      console.log(this.account);
    });

  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 990px)').subscribe(result => {
      this.mobile = result.matches;
    });
    this.form = this.fb.group({
      amount: [''],
      transactionType: [''],
      iban: [''],
      date: [''],
    });
  }


  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);

    }
  }

  // TODO: How to close toggle-menu on click outside of nav. Setting collapsed = true doesn't help.
  onClickedOutside(e: Event): void {
    if (!this.collapsed) {
      console.log('Clicked outside:', e);
      this.collapsed = true;
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}

