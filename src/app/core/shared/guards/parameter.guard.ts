import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PortalService } from '../services/portal.service';

@Injectable({
    providedIn: 'root'
})
export class ParameterGuard implements CanActivate {

    constructor(
        private portalService: PortalService,
        public router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.init(next);
    }

    async init(next: ActivatedRouteSnapshot) {
        if (next['_routerState'].url === '/Payment') {
            if (this.portalService.portalConfig.HIDEPAYMENTLINK) {
                this.router.navigate(['/']);
                return false;
            }
        }
        return true;
    }
}
