import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {Transaction, TransactionRequest, UserData} from '../api/Api';

@Injectable({providedIn: 'root'})
export class UserService {
  baseUrl = 'http://localhost:10101';

  constructor(private router: Router, private http: HttpClient) {

  }

  fetchTransactions(transactionRequest: { request: TransactionRequest }, iban: string): Observable<{ transactions: Transaction[] }> {
    const path = '/transactions/' + iban;
    return this.http.post<{ transactions: Transaction[] }>(this.baseUrl + path, {transactionRequest});
  }

  getUserData(): UserData {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData.accounts) {
      for (const acc of userData.accounts) {
        const transactionRequest: { request: TransactionRequest } = {request: {n: 0, offset: 100}};
        this.fetchTransactions(transactionRequest, acc.iban).subscribe((trans: { transactions: Transaction[] }) => {
          acc.transactions = trans.transactions;
        });
      }
    }
    return userData;
  }
}
