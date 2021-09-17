import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class JustLoginGuard implements CanActivate {

  constructor(private loginService: LoginService, private appService: AppService, public router: Router) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    // removed login for now
    await this.loginService.checkLogin();
    if (!this.loginService.isLoggedIn) {
      // this.loginService.returnURL = [next.url.map(value => value.path).join('/'), {queryParams: next.queryParams}];
      this.router.navigate(['/']);
      return false;
    } else if (this.loginService.isLoggedIn && !this.appService.hotelOwner) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
