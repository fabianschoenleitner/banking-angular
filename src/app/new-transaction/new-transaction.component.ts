import {Component, LOCALE_ID, NgModule, OnInit} from '@angular/core';
import {AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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

  // ngOnInit(): void {
  //   this.form = this.fb.group({
  //     amount: [''],
  //     transactionType: [''],
  //     iban: [''],
  //     date: [''],
  //     transactionTextType: [''],
  //     recepientName: [''],
  //     bic: [''],
  //     text: this.fb.array([
  //       this.fb.control(''),
  //       this.fb.control(''),
  //       this.fb.control(''),
  //       this.fb.control('')
  //     ])
  //   });
  // }
  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [''],
      transactionType: [''],
      iban: [''],
      date: [''],
      transactionTextType: [''],
      recepientName: [''],
      bic: [''],
      texts: new FormArray([])
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);

    }
  }

  // get texts(): FormArray {
  //   return this.form.get('texts') as FormArray;
  // }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  get t(): FormArray {
    return this.f.texts as FormArray;
  }

  setPaymentUsageContent(paymentUsageContent: boolean): void {
    this.paymentUsageContent = paymentUsageContent;
  }

  onChangeTransactionTextType(e): void {
    const numberOfRows = e;
    if (this.t.length < numberOfRows) {
      for (let i = this.t.length; i < numberOfRows; i++) {
        this.t.push(this.fb.group({
          text: [''],
        }));
      }
    } else {
      for (let i = this.t.length; i >= numberOfRows; i--) {
        this.t.removeAt(i);
      }
    }
  }

  onClear(): void {
    // clear errors and reset ticket fields
    this.t.reset();
  }

}
