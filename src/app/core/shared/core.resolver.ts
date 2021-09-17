import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PortalService } from './services/portal.service';
import { debounceTime, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreResolver implements Resolve<Observable<any>> {

  constructor(
    public portalService: PortalService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> | Promise<Observable<any>> | Observable<any> {
    return this.portalService.appInitialized$.pipe(debounceTime(10), first(x => x));
  }

}
