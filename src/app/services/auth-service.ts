import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginRequest, UserData} from '../api/Api';
import {AppSettings} from '../../app-settings';

@Injectable({providedIn: 'root'})
export class AuthService {
  data: UserData;

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  constructor(private router: Router, private http: HttpClient) {
    // console.log('Auth Service');
    if (localStorage.getItem('user')) {
      // console.log('Logged in from memory');
    }
  }

  login(user: LoginRequest): Observable<UserData> {
    return this.http.post<UserData>(AppSettings.baseUrl + '/login', user);
  }

  async logout(): Promise<boolean> {
    localStorage.clear();
    return await this.router.navigate(['/']);
  }
}
