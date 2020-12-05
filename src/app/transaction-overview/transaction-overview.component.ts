import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss', '../transaction-widget/transaction-widget.component.scss']
})
export class TransactionOverviewComponent implements OnInit, AfterViewInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: ''};
  transactions: Transaction[];
  userdata = JSON.parse(localStorage.getItem('user'));
  filterActive = false;
  removable = true;
  displayedColumns: string[] = ['complementaryName', 'iban', 'text', 'amount', 'timestamp'];
  dataSource = new MatTableDataSource(new Array<Transaction>());
  pipe: DatePipe;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get fromDate(): Date {
    return this.filterForm.get('fromDate').value;
  }
  get toDate(): Date {
    return this.filterForm.get('toDate').value;
  }

  constructor(private userService: UserService) {
    this.userService.accountsWidgetSubject.subscribe(acc => {
      this.account = acc;
    });

    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: Transaction, filter) => {
      const formatted = this.pipe.transform(data.timestamp, 'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter) ;
    };
  }

  ngOnInit(): void {
    const request: TransactionRequest = {n: 100, stored: false};
    this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
      this.transactions.map( ( trans: Transaction) => {
        trans.timestamp = new Date(trans.timestamp);
      });
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite:';
    });
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

  getDateRange(value): void {
    this.filterActive = true;
    this.dataSource.data = this.transactions;
    // TODO: Ask why crating date is not working with a method call??
    const toDate = this.getDate('fromDate');
    const fromDate = this.getDate('toDate');

    fromDate.setFullYear(
      this.filterForm.value.fromDate.year,
      this.filterForm.value.fromDate.month - 1,
      this.filterForm.value.fromDate.day
    );
    fromDate.setHours(0, 0, 0);
    toDate.setFullYear(
      this.filterForm.value.toDate.year,
      this.filterForm.value.toDate.month - 1,
      this.filterForm.value.toDate.day
    );
    toDate.setHours(23, 59, 59);
    this.dataSource.data = this.dataSource.data.filter(
      e => e.timestamp.getTime() >= fromDate.getTime() && e.timestamp.getTime() <= toDate.getTime()
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkBalance(amount): string  {
    if (amount >= 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  getDate(date): Date {
    const tempDate = new Date();
    if (date === 'fromDate') {
      tempDate.setFullYear(
        this.filterForm.value.fromDate.year,
        this.filterForm.value.fromDate.month - 1,
        this.filterForm.value.fromDate.day
      );
      tempDate.setHours(0, 0, 0);
    } else {
      tempDate.setFullYear(
        this.filterForm.value.toDate.year,
        this.filterForm.value.toDate.month - 1,
        this.filterForm.value.toDate.day
      );
      tempDate.setHours(23, 59, 59);
    }
    return tempDate;
  }

  clearFilters(): void {
    this.dataSource.filter = '';
    this.filterForm.reset();
    this.filterActive = false;
    this.dataSource.data = this.transactions;
  }


}
