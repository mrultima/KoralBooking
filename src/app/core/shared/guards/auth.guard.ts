import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { AppService } from '../services/app.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private appService: AppService, public router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.init(next);
  }

  async init(next: ActivatedRouteSnapshot) {
    await this.loginService.checkLoginIn.pipe(first(x => typeof x === 'boolean')).toPromise();
    if (!this.loginService.isLoggedIn) {
      this.loginService.returnURL = next['_routerState'].url;
      this.router.navigate(['Login']);
      return false;
    }
    return true;
  }
}
