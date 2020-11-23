import {Injectable, PipeTransform} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Transaction, TransactionRequest, TransactionResponse} from '../../api/Api';
import {DecimalPipe} from '@angular/common';
import {debounceTime, switchMap, tap} from 'rxjs/operators';
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
// TODO: Fix sorting of Date Objects if necessary. ATM: Temp Fake Server sends Timestamps as string
//  => Sorting of Dates is based on 'day' instead of year.
// const compare = (v1: string | number | Date, v2: string | number | Date): number => {
//   if (typeof (v1) === 'string') {
//     console.log('sorting type is string');
//   }
//   else {
//     if (v1 < v2) {
//       return -1;
//     }
//     else if (v1 > v2) {
//       return 1;
//     }
//     else {
//       return 0;
//     }
//   }
// };

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
  return transaction.complementaryName.toLowerCase().includes(term.toLowerCase())
    || transaction.complementaryIban.toLowerCase().includes(term.toLowerCase())
    || transaction.iban.toLowerCase().includes(term.toLowerCase())
    || transaction.type.toLowerCase().includes(term.toLowerCase())
    || transaction.timestamp.toString().toLowerCase().includes(term.toLowerCase())
    // || pipe.transform(transaction.timestamp).includes(term)
    || pipe.transform(transaction.amount).includes(term);
}

@Injectable({providedIn: 'root'})
export class TransactionTableService {

  transactions: Transaction[] = [];

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
    const ibanArr = this.userService.getIbans({iban: '', balance: 0, name: 'Alle Konten', accountType: ''});
    const request: TransactionRequest = {n: 100};
    userService.getTransactions(request, ibanArr).subscribe((response: TransactionResponse[]) => {
      this.transactions = this.userService.sortTransactions(response);
    });

    this.searchvar$.pipe(
      tap(() => this.loadingvar$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      // delay(200),
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
