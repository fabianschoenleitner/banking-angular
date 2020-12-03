import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user-service';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: ''};
  savedTransactions: Transaction[];
  paymentUsageContent = false;
  form: FormGroup;
  savedTransactionsForm: FormGroup;
  minDate = undefined;
  tempDate = new Date();
  userdata = JSON.parse(localStorage.getItem('user'));

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private config: NgbDatepickerConfig,
              private modalService: NgbModal) {
    this.userService.accountsWidgetSubject.subscribe(acc => {
      this.account = acc;
      console.log(this.account);
    });
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

  }

  ngOnInit(): void {
    const tempDate = new Date();
    console.log(tempDate);
    this.form = this.fb.group({
      timestamp: [{year: tempDate.getFullYear(), month: tempDate.getMonth() + 1, day: tempDate.getDate()}, Validators.required],
      amount: [0,  Validators.required],
      text: new FormArray([]),
      textType: ['Zahlungsreferenz'],
      type: [''],
      iban: [''],
      complementaryIban: ['', Validators.required],
      complementaryName: [''],
    });
    this.onChangeTextType(1);

    const request: TransactionRequest = {n: 100, stored: true};
    this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
      this.savedTransactions = this.userService.sortTransactions(response);

    });

    this.savedTransactionsForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    });

  }

  onSubmit(method: string): void {
    if (this.form.valid) {
      this.form.value.iban = this.account.iban;

      this.tempDate.setFullYear(
        this.form.value.timestamp.year,
        this.form.value.timestamp.month - 1,
        this.form.value.timestamp.day
      );

      this.form.value.timestamp = this.tempDate.toISOString();
      this.form.value.text = this.form.value.text.map(x => x.text).join('\n');

      if (method === `PUT`) {
        this.savedTransactions.push(this.form.value);
      }

      this.userService.sendTransaction(this.form.value, method).subscribe(trans => {
        console.log(trans);
        this.onClear();
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
    this.t.reset();
    // TODO: Ask Danny: form.reset() does not reset date and amount values
    // this.form.reset();
    this.form.controls.amount.patchValue(0);
    this.form.controls.textType.patchValue('Zahlungsreferenz');
    // this.form.controls.type.reset();
    this.form.controls.complementaryIban.reset();
    this.form.controls.complementaryName.reset();
    this.form.controls.timestamp.patchValue({year: this.tempDate.getFullYear(),
      month: this.tempDate.getMonth() + 1, day: this.tempDate.getDate()});
  }

  storeTransaction(method: string): void {
    this.onSubmit(method);
  }

  onCheckboxChange(e, data: Transaction): void {
    const checkArray: FormArray = this.savedTransactionsForm.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(data));
      console.log(data);
    } else {
      let i = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === data) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  deleteFromFormArray(checkArray: FormArray, data: Transaction): void {
    let i = 0;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value === data) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }

  sendSavedTrans(): void {
    console.log(this.savedTransactionsForm.value);
    const transToSend = this.savedTransactionsForm.get('checkArray') as FormArray;
    for (const t of transToSend.controls) {
      this.userService.sendTransaction(t.value, 'POST').subscribe(trans => {
        console.log(trans);
        this.deleteFromFormArray(transToSend, t.value);
      });
    }
  }

  deleteSavedTrans(): void {
    console.log(this.savedTransactionsForm.value);
    const transToDelete = this.savedTransactionsForm.get('checkArray') as FormArray;
    for (const t of transToDelete.controls) {
      this.userService.sendTransaction(t.value, 'DELETE').subscribe(trans => {
        console.log(trans);
        this.deleteFromFormArray(transToDelete, t.value);
      });
    }
  }

  openVerticallyCentered(content): void {
    this.modalService.open(content, { centered: true });
  }

}
