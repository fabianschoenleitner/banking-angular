import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Transaction, TransactionRequest} from '../../api/Api';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';
import {UserService} from '../../services/user-service';

interface SearchResult {
  transactions: Transaction[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(transactions: Transaction[], column: SortColumn, direction: string): Transaction[] {
  if (direction === '' || column === '') {
    return transactions;
  } else {
    return [...transactions].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(transaction: Transaction, term: string, pipe: PipeTransform): void {
  return transaction.recipientName.toLowerCase().includes(term.toLowerCase())
    || transaction.recipientIban.toLowerCase().includes(term.toLowerCase())
    || transaction.senderIban.toLowerCase().includes(term.toLowerCase())
    || transaction.type.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(transaction.amount).includes(term)
    || transaction.timestamp.toString().toLowerCase().includes(term.toLowerCase());
  // || pipe.transform(transaction.timestamp).includes(term);
}

@Injectable({providedIn: 'root'})
export class TransactionTableService {

  transactions: Transaction[];

  private loadingvar$ = new BehaviorSubject<boolean>(true);
  private searchvar$ = new Subject<void>();
  private transactionsvar$ = new BehaviorSubject<Transaction[]>([]);
  private totalvar$ = new BehaviorSubject<number>(0);

  private statevar: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private userService: UserService) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const ibanArr = userData.accounts;
    const transactionRequest: { request: TransactionRequest } = {request: {n: 0, offset: 100}};
    userService.getTransactions(transactionRequest, ibanArr).subscribe((trans: { transactions: Transaction[] }) => {
      this.transactions = trans.transactions;
    });

    this.searchvar$.pipe(
      tap(() => this.loadingvar$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this.loadingvar$.next(false))
    ).subscribe(result => {
      this.transactionsvar$.next(result.transactions);
      this.totalvar$.next(result.total);
    });

    this.searchvar$.next();
  }

  get transactions$(): Observable<Transaction[]> {
    return this.transactionsvar$.asObservable();
  }

  get total$(): Observable<number> {
    return this.totalvar$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingvar$.asObservable();
  }

  get page(): number {
    return this.statevar.page;
  }

  get pageSize(): number {
    return this.statevar.pageSize;
  }

  get searchTerm(): string {
    return this.statevar.searchTerm;
  }
  // suppressed because of ng bootstrap recommendation
  // tslint:disable-next-line:adjacent-overload-signatures
  set page(page: number) {
    this._set({page});
  }

  // suppressed because of ng bootstrap recommendation
  // tslint:disable-next-line:adjacent-overload-signatures
  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

  // suppressed because of ng bootstrap recommendation
  // tslint:disable-next-line:adjacent-overload-signatures
  set searchTerm(searchTerm: string) {
    this._set({searchTerm});
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({sortColumn});
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({sortDirection});
  }

  private _set(patch: Partial<State>): void {
    Object.assign(this.statevar, patch);
    this.searchvar$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this.statevar;

    // 1. sort
    let transactions = sort(this.transactions, sortColumn, sortDirection);

    // 2. filter
    transactions = transactions.filter(transaction => matches(transaction, searchTerm, this.pipe));
    const total = transactions.length;

    // 3. paginate
    transactions = transactions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({transactions, total});
  }
}
