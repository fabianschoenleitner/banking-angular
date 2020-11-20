import {Component, QueryList, ViewChildren} from '@angular/core';
import {Iban, Transaction} from '../../api/Api';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {TransactionTableService} from './trans-table.service';
import {NgbdSortableHeaderDirective, SortEvent} from './sortable.directive';
import {faArrowCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  providers: [TransactionTableService, DecimalPipe],
})
export class TransactionTableComponent {

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;
  ibanArr: Iban[] = [];

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(public service: TransactionTableService, private library: FaIconLibrary) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;

    library.addIcons(faArrowCircleUp);
    this.ibanArr = JSON.parse(localStorage.getItem('user')).accounts;
  }

  onSort({column, direction}: SortEvent): void {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  checkBalance(iban): string  {
    if (this.ibanArr.indexOf(iban) > -1) {
      return 'red';
    } else {
      return 'green';
    }
  }

  isUrgent(transactionType): boolean {
    return 'Eilauftrag' === transactionType;
  }

}
