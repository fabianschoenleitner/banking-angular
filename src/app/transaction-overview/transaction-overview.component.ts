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
  styleUrls: ['./transaction-overview.component.scss']
})
export class TransactionOverviewComponent implements OnInit, AfterViewInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: ''};
  transactions: Transaction[];

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
        console.log(trans.timestamp);
      });
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

  getDateRange(value): void {
    this.dataSource.data = this.transactions;
    const fromDate = value.fromDate;
    const toDate = value.toDate;
    this.dataSource.data = this.dataSource.data.filter(
      e =>
        e.timestamp.getFullYear() >= fromDate.getFullYear() && e.timestamp.getFullYear() <= toDate.getFullYear() &&
        e.timestamp.getMonth() >= fromDate.getMonth()  && e.timestamp.getMonth()  <= toDate.getMonth()  &&
        e.timestamp.getDate() >= fromDate.getDate()  && e.timestamp.getDate()  <= toDate.getDate()
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
