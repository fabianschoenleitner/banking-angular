import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Account, Balance, Iban, PriorBalanceRequest, Transaction, TransactionRequest, UserData} from '../api/Api';
import {AppSettings} from '../../app-settings';
import {from, Observable, Subject} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {

  accountSubject = new Subject<Account>();

  constructor(private router: Router, private http: HttpClient) {
  }

  public getTransactions(transactionRequest: { request: TransactionRequest }, ibanArr: Iban[]):
    Observable<{ transactions: Transaction[] }> {
    return from(ibanArr).pipe(
      mergeMap((iban: string) => {
        return this.http.post<{ transactions: Transaction[] }>
        (AppSettings.baseUrl + '/transactions/' + iban, transactionRequest) as Observable<{ transactions: Transaction[] }>;
      }));
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

}
