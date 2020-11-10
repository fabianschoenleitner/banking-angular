import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:10101';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private http: HttpClient) {
    console.log('Auth Service');
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('Logged in from memory');
      const user = JSON.parse(userData);
      this.loggedIn.next(true);
    }
  }

  login(user): Subscription {
    return this.http.request('POST', this.baseUrl + '/login', {
      body: user,
      responseType: 'json',
      observe: 'body',
    }).subscribe(async (response: any) => {
      if (response.auth === true && response.token !== undefined) {
        this.loggedIn.next(true);
        const userData = {
          token: response.token,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        await this.router.navigateByUrl('/user');
      }
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    localStorage.clear();
    await this.router.navigate(['/']);
  }
}
