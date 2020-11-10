import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';



@Injectable()
export class AddTokenInterceptor implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = '';

    JSON.parse(localStorage.getItem('user'), (key, value) => {
      if (key === 'token') {
        token = value;
      }
    });
    const jsonReq: HttpRequest<any> = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(jsonReq);
  }
}
