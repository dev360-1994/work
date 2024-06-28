import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { observable, Observable, throwError } from 'rxjs';
import { CONSTANT } from '../constants';
import { catchError } from 'rxjs/operators'
import { SessionExpiresService } from '../modules/session-expires/session-expires.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private sessionExpiresService: SessionExpiresService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = CONSTANT.getUser();
    let authReq = req.clone();
    if (user?.token) {
      authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${user?.token}`).set('userId',user.id) });
    }
    return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
      if (!error?.status || error.status === 0 || error.status === 401) {
        this.sessionExpiresService.openDialog();
        // CONSTANT.logout();
      };
      return throwError(error)
    }));
  }
}