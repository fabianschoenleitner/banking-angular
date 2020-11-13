import {Component, Input, QueryList, ViewChildren} from '@angular/core';
import {Transaction} from '../../api/Api';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {TransactionTableService} from './trans-table.service';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';
import {UserService} from '../../services/user-service';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  providers: [TransactionTableService, DecimalPipe],
})
export class TransactionTableComponent {

  transactions$: Observable<Transaction[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: TransactionTableService) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
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
}
