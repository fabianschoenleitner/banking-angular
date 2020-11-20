import {Component, LOCALE_ID, NgModule, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../services/user-service';
import {Account} from '../api/Api';


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  account: Account = {iban: '123', balance: 0.00, name: '332', accountType: ''};
  paymentUsageContent = false;
  form: FormGroup;


  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userService.accountsWidgetSubject.subscribe(acc => {
      this.account = acc;
      console.log(this.account);
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [''],
      transactionType: [''],
      iban: [''],
      date: [''],
      transactionTextType: [''],
      recepientName: [''],
      bic: [''],
      text: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ])
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);

    }
  }

  get text(): FormArray {
    return this.form.get('text') as FormArray;
  }

  setPaymentUsageContent(paymentUsageContent: boolean): void {
    this.paymentUsageContent = paymentUsageContent;
  }

}
