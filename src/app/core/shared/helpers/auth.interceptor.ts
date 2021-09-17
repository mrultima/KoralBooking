import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, finalize, first, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    queueCounter$ = new BehaviorSubject(0);
    queue$ = new BehaviorSubject(0);
    refreshInProgress = false;
    constructor(
        public router: Router,
        public api: ApiService,
        public http: HttpClient,
        public activatedRoute: ActivatedRoute
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // If this is a request  for our nodejs servers with a LoginToken, then intercept
        if (request.method === 'POST' && request.url.startsWith(this.api.url) && request.body.hasOwnProperty('LoginToken') && request.body.Action !== 'Login') {
            return next.handle(request).pipe(catchError((e: HttpErrorResponse) => {
                // If response is 401 meaning out credentials are wrong, then try to refresh login token
                if (e.status === 401) {
                    // getNewTicket, reads queueCounter$ and increases it by one
                    const ticket = this.getNewTicket();
                    console.warn('401 Login Token Invalid! Ticket No: ', ticket);
                    // If there is a token refresh process going on, wait until it refreshes and  it's our turn
                    // then just try again with the new login token
                    if (this.refreshInProgress) {
                        console.warn('Token Refresh Already In Progress. Waiting... Ticket No: ', ticket);
                        // Wait for ticket emits when it's our turn, then it increases queue$ by one so next request is processed
                        return this.waitForTicket(ticket).pipe(
                            switchMap(() => {
                                console.warn('We Have A New Token! Trying Again... Ticket No: ', ticket);
                                // Then retry the failed request with the new login token
                                // cloneRequestWithNewToken modifies request's LoginToken with the one in current ApiService
                                return next.handle(this.cloneRequestWithNewToken(request));
                            })
                        );
                    }
                    console.warn('Trying To Refresh Login Token. Ticket No: ', ticket);
                    this.refreshInProgress = true;
                    // refreshTokenRequest sends a token refresh request.
                    // if it succeeds, then tries again. if it fails, goes to login page and reloads page
                    // After it succeeds, it also increased queue$ by one so next request can proceed
                    return this.refreshTokenRequest(request, next, e, ticket).pipe(finalize(() => this.queue$.next(ticket + 1)));
                } else {
                    return throwError(e);
                }
            }));
        }
        // Otherwise, just pass it along.
        return next.handle(request);
    }

    refreshTokenRequest(request: HttpRequest<any>, next: HttpHandler, original401Response: HttpErrorResponse, ticket: number, authCode?: string): Observable<HttpEvent<any>> {
        return this.http.post(this.api.url + 'Login', {
            Action: 'Login',
            LoginToken: this.api.loginToken,
            AuthCode: authCode
        }).pipe(
            switchMap((resp: any) => {
                if (!(resp && resp.Success && resp.LoginToken)) {
                    // If request returns 200 but Success is false, turn it into an error so the next catchError can catch it
                    console.warn('Token Refresh Failed! Ticket No: ', ticket);
                    return throwError(resp);
                }
                // If refresh succeeds, then replace current api and localStorage tokens with the new one
                console.warn('Token Refresh Successfull! Trying Again... Ticket No: ', ticket);
                this.api.loginToken = resp.LoginToken;
                this.api.refreshToken$.next(resp.LoginToken);
                this.refreshInProgress = false;
                // Retry the failed request with new login token
                return next.handle(this.cloneRequestWithNewToken(request));
            }),
            catchError((refreshError) => {
                // If token refresh fails...
                return this.processRefreshTokenError(original401Response, refreshError);
            })
        );
    }

    processRefreshTokenError(original401Response: HttpErrorResponse, refreshTokenError: HttpErrorResponse) {
        this.api.refreshToken$.next();
        return throwError(original401Response);
    }

    cloneRequestWithNewToken(request) {
        const newReq = request.clone();
        newReq.body.LoginToken = this.api.loginToken;
        return newReq;
    }

    getNewTicket() {
        const ticket = this.queueCounter$.getValue();
        this.queueCounter$.next(ticket + 1);
        return ticket;
    }

    waitForTicket(ticket) {
        return this.queue$.pipe(
            first(queue => queue === ticket),
            tap((queue) => timer(0).subscribe(() => this.queue$.next(queue + 1))),
        );
    }
}
