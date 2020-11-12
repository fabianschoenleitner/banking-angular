import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginRequest, UserData} from '../api/Api';

@Injectable({providedIn: 'root'})
export class AuthService {
  baseUrl = 'http://localhost:10101';
  data: UserData;

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  constructor(private router: Router, private http: HttpClient) {
    console.log('Auth Service');
    if (localStorage.getItem('user')) {
      console.log('Logged in from memory');
    }
  }

  login(user: LoginRequest): Observable<UserData> {
    return this.http.post<UserData>(this.baseUrl + '/login', user);
  }

  async logout(): Promise<boolean> {
    localStorage.clear();
    return await this.router.navigate(['/']);
  }
}
