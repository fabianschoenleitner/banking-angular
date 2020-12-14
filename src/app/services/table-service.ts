import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})

export class TableService {

  getDate(date: string, form: FormGroup): Date {
    const tempDate = new Date();
    if (date === 'fromDate') {
      tempDate.setFullYear(
        form.value.fromDate.year,
        form.value.fromDate.month - 1,
        form.value.fromDate.day
      );
      tempDate.setHours(0, 0, 0);
    } else {
      tempDate.setFullYear(
        form.value.toDate.year,
        form.value.toDate.month - 1,
        form.value.toDate.day
      );
      tempDate.setHours(23, 59, 59);
    }
    return tempDate;
  }

  checkBalance(amount: number): string {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  setShowDateError(toDateIn, fromDateIn, form: FormGroup): boolean {
    if (toDateIn != null && fromDateIn != null) {
      const toDate = this.getDate('toDate', form);
      const fromDate = this.getDate('fromDate', form);

      return fromDate > toDate;
    } else {
      return false;
    }
  }
  checkFutureDate(date): boolean {
    const tempDate = new Date(date);
    const now = new Date();
    return now < tempDate;
  }

}
