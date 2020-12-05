import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common';
// import * as moment from 'moment';
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

  displayedColumns: string[] = ['complementaryname', 'iban', 'text', 'amount', 'timestamp'];
  dataSource: MatTableDataSource<Transaction>;
  pipe: DatePipe;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get fromDate(): any {
    return this.filterForm.get('fromDate').value;
  }
  get toDate(): any {
    return this.filterForm.get('toDate').value;
  }

  constructor(private userService: UserService) {
    this.userService.accountsWidgetSubject.subscribe(acc => {
      this.account = acc;
    });
  }

  ngOnInit(): void {
    const request: TransactionRequest = {n: 100, stored: false};
    this.userService.getTransactions(request, this.userService.getIbans()).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;


      // this.pipe = new DatePipe('en');
      // this.dataSource.filterPredicate = (data, filter) => {
      //   if (this.fromDate && this.toDate) {
      //     return data.timestamp >= this.fromDate && data.timestamp <= this.toDate;
      //   }
      //   return true;
      // };


    });
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

  applyRangeFilter(): void {
    this.dataSource.filter = '' + Math.random();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
