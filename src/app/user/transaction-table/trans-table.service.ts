import {Injectable, PipeTransform, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscribable, Subscription} from 'rxjs';
import {Account, Transaction, UserData} from '../../api/Api';
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

  userData: UserData;

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private userService: UserService) {
    this.userData = userService.getUserData();

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._transactions$.next(result.transactions);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get transactions$(): Observable<Transaction[]> {
    return this._transactions$.asObservable();
  }

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get page(): number {
    return this._state.page;
  }

  get pageSize(): number {
    return this._state.pageSize;
  }

  get searchTerm(): string {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({page});
  }

  set pageSize(pageSize: number) {
    this._set({pageSize});
  }

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
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let transactions = sort(this.userData.accounts[0].transactions, sortColumn, sortDirection);

    // 2. filter
    transactions = transactions.filter(transaction => matches(transaction, searchTerm, this.pipe));
    const total = transactions.length;

    // 3. paginate
    transactions = transactions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({transactions, total});
  }
}
