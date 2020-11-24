import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user-service';
import {Account} from '../api/Api';


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: ''};
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
      timestamp: [''],
      amount: [''],
      text: new FormArray([]),
      textType: [''],
      type: [''],
      iban: [''],
      complementaryIban: [''],
      complementaryName: [''],
    });
    this.onChangeTextType(1);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.value.iban = this.account.iban;

      const tempDate = new Date();
      tempDate.setFullYear(
        this.form.value.timestamp.year,
        this.form.value.timestamp.month - 1,
        this.form.value.timestamp.day
      );

      this.form.value.timestamp = tempDate.toISOString();
      this.form.value.text = this.form.value.text.map(x => x.text).join('\n');

      this.userService.sendTransaction(this.form.value).subscribe(trans => {
        console.log(trans);
      });
    }
  }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  get t(): FormArray {
    return this.f.text as FormArray;
  }

  setPaymentUsageContent(paymentUsageContent: boolean): void {
    this.paymentUsageContent = paymentUsageContent;
  }

  onChangeTextType(e): void {
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
