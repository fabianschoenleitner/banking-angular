import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Account, Balance, Iban, PriorBalanceRequest, Transaction, TransactionRequest, TransactionResponse, UserData} from '../api/Api';
import {AppSettings} from '../../app-settings';
import {forkJoin, from, Observable, Subject} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {

  accountsWidgetSubject = new Subject<Account>();
  transactionWidgetSubject = new Subject<Account>();

  constructor(private router: Router, private http: HttpClient) {
  }

  public getTransactions(request: TransactionRequest, ibanArr: Iban[]): Observable<TransactionResponse[]> {

    const obs: Array<Observable<TransactionResponse>> = [];
    for (const iban of ibanArr) {
      obs.push(
        this.http.post<TransactionResponse>
        (AppSettings.baseUrl + '/transactions/' + iban, request));

    }
    return forkJoin<Observable<TransactionResponse>[]>(obs);
  }

  public getAllAccounts(): Observable<{ accounts: Account[] }> {
    const path = AppSettings.baseUrl + '/accounts';
    return this.http.get<{ accounts: Account[] }>(path);
  }

  public getBalances(priorBalanceRequest: { request: PriorBalanceRequest }, ibanArr: Iban[]):
    Observable<Balance[]> {
    return from(ibanArr).pipe(
      mergeMap((iban: string) => {
        return this.http.post<Balance[]>
        (AppSettings.baseUrl + '/balances/' + iban, priorBalanceRequest) as Observable<Balance[]>;
      }));
  }

  public sendTransaction(transaction: { request: Transaction }): Observable<void> {
    const path = AppSettings.baseUrl + '/transaction';
    return this.http.post<void>(path, transaction) as Observable<void>;
  }

  public getIbans(account: Account): Iban[] {
    if (account.name === 'Alle Konten') {
      return JSON.parse(localStorage.getItem('user')).accounts;
    }
    return [account.iban];
  }

  public sortTransactions(response: TransactionResponse[]): Transaction[] {
    let transactions: Transaction[] = [];
    for (const transactionResponse of response) {
      transactions = transactions.concat(transactionResponse.transactions);
    }
    transactions = this.sort(transactions);
    return transactions;
  }

  compare = (v1: Date, v2: Date) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  sort(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => {
      const res = this.compare(a.timestamp, b.timestamp);
      return -res;
    });
  }

}
