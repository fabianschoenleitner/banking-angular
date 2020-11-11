import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthService {
  baseUrl = 'https://tsurneyt30.execute-api.us-east-1.amazonaws.com/production';
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
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
      responseType: 'text',
      observe: 'body',
    }).subscribe(async (response: string) => {
        this.loggedIn.next(true);
        localStorage.setItem('user', response);
        await this.router.navigateByUrl('/user');
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    localStorage.clear();
    await this.router.navigate(['/']);
  }
}
