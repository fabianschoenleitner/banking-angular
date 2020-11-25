import {Component, QueryList, ViewChildren} from '@angular/core';
import {Iban, Transaction} from '../../api/Api';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {TransactionTableService} from './trans-table.service';
import {NgbdSortableHeaderDirective, SortEvent} from './sortable.directive';
import {faArrowCircleUp} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {UserService} from '../../services/user-service';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  providers: [TransactionTableService, DecimalPipe],
})
export class TransactionTableComponent {

  transactionsX: Transaction[];
  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;
  // TODO: Load data on first try
  constructor(public service: TransactionTableService, private library: FaIconLibrary, private userService: UserService) {

    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
    library.addIcons(faArrowCircleUp);
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

  checkBalance(amount): string  {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  isUrgent(transactionType): boolean {
    return 'Eilauftrag' === transactionType;
  }

}
