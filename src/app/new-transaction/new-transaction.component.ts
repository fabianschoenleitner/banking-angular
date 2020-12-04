import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user-service';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: ''};
  savedTransactions: Transaction[];
  paymentUsageContent = false;
  transactionForm: FormGroup;
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
    this.transactionForm = this.fb.group({
      timestamp: [{year: tempDate.getFullYear(), month: tempDate.getMonth() + 1, day: tempDate.getDate()}, Validators.required],
      amount: [0, Validators.required],
      text: new FormArray([]),
      textType: ['Zahlungsreferenz'],
      type: [''],
      iban: [''],
      complementaryIban: ['', Validators.required],
      complementaryName: [''],
    });
    this.onChangeTextType(1);

    this.savedTransactionsForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    });

    const request: TransactionRequest = {n: 100, stored: true};
    this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
      this.savedTransactions = this.userService.sortTransactions(response);
    });
  }

  setPaymentUsageContent(paymentUsageContent: boolean): void {
    this.paymentUsageContent = paymentUsageContent;
  }

  get transaction(): { [p: string]: AbstractControl } {
    return this.transactionForm.controls;
  }

  get transactionArray(): FormArray {
    return this.transaction.text as FormArray;
  }

  get savedTrans(): { [p: string]: AbstractControl } {
    return this.savedTransactionsForm.controls;
  }

  get savedTransCheckArray(): FormArray {
    return this.savedTrans.checkArray as FormArray;
  }

  storeTransaction(requestType: string): void {
    this.sendTransaction(requestType);
    this.onClear();
  }

  sendSavedTrans(): void {
    const transToSend = this.savedTransactionsForm.get('checkArray') as FormArray;
    for (const t of transToSend.controls) {
      this.userService.sendTransaction(t.value, 'POST').subscribe(() => {
        this.deleteStoredTransaction(t.value);
      });
    }
  }

  sendTransaction(requestType: string): void {
    if (this.transactionForm.valid) {
      this.transactionForm.value.iban = this.account.iban;

      this.tempDate.setFullYear(
        this.transactionForm.value.timestamp.year,
        this.transactionForm.value.timestamp.month - 1,
        this.transactionForm.value.timestamp.day
      );

      this.transactionForm.value.timestamp = this.tempDate.toISOString();
      this.transactionForm.value.text = this.transactionForm.value.text.map(x => x.text).join('\n');

      if (requestType === `PUT`) {
        this.savedTransactions.push(this.transactionForm.value);
      }

      this.userService.sendTransaction(this.transactionForm.value, requestType).subscribe(() => {
        this.onClear();
      });
    }
  }

  onChangeTextType(e): void {
    const numberOfRows = e;
    if (this.transactionArray.length < numberOfRows) {
      for (let i = this.transactionArray.length; i < numberOfRows; i++) {
        this.transactionArray.push(this.fb.group({
          text: [''],
        }));
      }
    } else {
      for (let i = this.transactionArray.length; i >= numberOfRows; i--) {
        this.transactionArray.removeAt(i);
      }
    }
  }

  onClear(): void {
    this.tempDate = new Date();
    this.transactionArray.reset();
    this.transactionForm.controls.amount.patchValue(0);
    this.transactionForm.controls.textType.patchValue('Zahlungsreferenz');
    this.transactionForm.controls.type.patchValue('');
    this.transactionForm.controls.complementaryIban.reset();
    this.transactionForm.controls.complementaryName.reset();
    this.transactionForm.controls.timestamp.patchValue({
      year: this.tempDate.getFullYear(),
      month: this.tempDate.getMonth() + 1, day: this.tempDate.getDate()
    });
  }

  onCheckboxChange(e, data: Transaction): void {
    if (e.target.checked) {
      // console.log(data);
      this.savedTransCheckArray.push(new FormControl(data));
    } else {
      let i = 0;
      this.savedTransCheckArray.controls.forEach((item: FormControl) => {
        if (this.compareTransactions(item.value, data)) {
          this.savedTransCheckArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    // console.log(this.savedTransCheckArray.value);
  }

  openVerticallyCentered(content): void {
    this.modalService.open(content, {centered: true});
  }

  deleteSavedTrans(): void {
    let i = 0;
    for (const trans of this.savedTransCheckArray.value) {
      this.userService.sendTransaction(trans, 'DELETE').subscribe((tran: void) => {
          this.savedTransactions.forEach((item: Transaction) => {
            if (this.compareTransactions(item, trans)) {
              this.savedTransactions.splice(i, 1);
              return;
            }
            i = i + 1;
          });
          i = 0;
        }
      );
    }
  }

  deleteStoredTransaction(transaction: Transaction): void {
    let i = 0;
    this.savedTransactions.forEach((item: Transaction) => {
      if (this.compareTransactions(item, transaction)) {
        this.savedTransactions.splice(i, 1);
        return;
      }
      i++;
    });
  }

  compareTransactions(trans1: Transaction, trans2: Transaction): boolean {
    if (trans1 === null || trans2 === null) {
      return false;
    }
    if (trans1.type !== trans2.type) {
      return false;
    }
    if (trans1.text !== trans2.text) {
      return false;
    }
    if (trans1.complementaryName !== trans2.complementaryName) {
      return false;
    }
    if (trans1.complementaryIban !== trans2.complementaryIban) {
      return false;
    }
    if (trans1.amount !== trans2.amount) {
      return false;
    }
    if (trans1.textType !== trans2.textType) {
      return false;
    }
    if (trans1.iban !== trans2.iban) {
      return false;
    }
    if (trans1.timestamp !== trans2.timestamp) {
      return false;
    }
    return true;
  }
}
