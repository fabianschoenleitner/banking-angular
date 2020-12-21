import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Account, Transaction, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {TableService} from '../services/table-service';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-transaction-overview',
  templateUrl: './transaction-overview.component.html',
  styleUrls: ['./transaction-overview.component.scss', '../transaction-widget/transaction-widget.component.scss']
})
export class TransactionOverviewComponent implements OnInit, AfterViewInit {
  account: Account = {iban: '', balance: 0.00, name: '', accountType: '', limit: 0};
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '', limit: 0}];
  transactions: Transaction[];
  userdata = JSON.parse(localStorage.getItem('user'));
  filterActive = false;
  removable = true;
  displayedColumns: string[] = ['timestamp', 'complementaryIban', 'text', 'amount'];
  dataSource = new MatTableDataSource(new Array<Transaction>());
  pipe: DatePipe;
  showDateError = false;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public userService: UserService, public tableService: TableService, private library: FaIconLibrary) {
    library.addIcons(faSyncAlt);
  }

  ngOnInit(): void {
    this.userService.accountsWidgetSubject.subscribe(acc => {
      this.account = acc;
    });

    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: Transaction, filter) => {
      const formatted = this.pipe.transform(data.timestamp, 'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data, filter);
    };

    this.userService.transactionFinanceSite.subscribe(trans => {
      this.transactions = trans;
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite:';
      this.paginator._intl.getRangeLabel = this.tableService.germanRangeLabel;
    });
  }

  ngAfterViewInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.showDateError = this.tableService.setShowDateError(this.toDate, this.fromDate, this.filterForm);
    });
  }

  get fromDate(): Date {
    return this.filterForm.get('fromDate').value;
  }

  get toDate(): Date {
    return this.filterForm.get('toDate').value;
  }

  getDateRange(): void {
    this.filterActive = true;
    this.dataSource.data = this.transactions;

    const toDate = this.tableService.getDate('toDate', this.filterForm);
    const fromDate = this.tableService.getDate('fromDate', this.filterForm);

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

  clearFilters(): void {
    this.dataSource.filter = '';
    this.filterForm.reset();
    this.filterActive = false;
    this.dataSource.data = this.transactions;
  }

  refreshTransactions(): void {
    const request: TransactionRequest = {n: 100, stored: false};
    this.userService.getTransactions(request, [this.account.iban]).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
      this.transactions.map((trans: Transaction) => {
        trans.timestamp = new Date(trans.timestamp);
      });
      this.userService.transactionFinanceSite.next(this.transactions);
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.getRangeLabel = this.tableService.germanRangeLabel;
    });
    this.userService.getAllAccounts().subscribe(({accounts}) => {
      this.accounts = accounts;
      this.account = accounts.filter((a: Account) => a.iban === this.account.iban)[0];
    });
  }

}
