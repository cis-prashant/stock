import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService : AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
          if (err.status === 401) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
              this.router.navigate(['/login'],{ queryParams: { returnUrl: this.router.url } });
              //location.reload(true);
          }
          if (err.status === 429) {
            this.router.navigate(['/login'],{ queryParams: { returnUrl: this.router.url } });
          }
          if (err.status == 422) {
            this.router.navigate(['/login'],{ queryParams: { returnUrl: this.router.url } });
          }
          const error = err.error.message || err.statusText;
          return throwError(error);
      })
  )
    // return next.handle(request);
  }
}
