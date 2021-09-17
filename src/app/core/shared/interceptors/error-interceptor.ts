import { catchError, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          error['body'] = request.body;
          // @ts-ignore
          error['requestHeaders'] = JSON.stringify(request.headers.headers, (key, value) => (value instanceof Map ? [...value] : value));

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }

          if (typeof error.error === 'string') {
            errorMessage += `\nError: ${error.error}`;
          }
          error['customMessage'] = errorMessage;
          return throwError(error);
        })
      );
  }
}
