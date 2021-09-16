import { Inject, Injectable, InjectionToken } from '@angular/core';
// import { PortalConfig, PortalService } from './portal.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HotelConfig } from '../types';
// import { LoginService } from './login.service';
// import { OnlineService } from '@travelaps/pages/online/online.service';
import { AppService } from './app.service';

export const PORTAL_ENV = new InjectionToken<PortalEnvironment>('env');


export interface IAzureSettings {
  container: string;
  token: string;
  storageUrl: string;
}
export interface PortalEnvironment {
  production: boolean;
  webApi: string;
  nodeApi: string;
  logApi: string;
  loginToken?: string | null;
  localLoginToken?: string | null;
  local?: boolean;
  dmStorage?: IAzureSettings;
  dmFacility?: boolean;
  dmUser?: boolean;
}

export abstract class BasketProcessor {
  abstract notes(): Array<any>;

  onPromotionCode(val: string): Observable<{ price: number }> | void {
  };

  clearPromotionCode(code: string): Observable<any> | void {
  }

  abstract refreshItems(): Promise<boolean>;

  abstract complete(dryrun: Number): { observableArray: Array<any> };
}

@Injectable({
  providedIn: 'root'
})
export class PortalInjectionService {

  readonly app$ = new BehaviorSubject<boolean>(false);

  // STARTER_BASKET_CONFIG = new BehaviorSubject<BasketConfig>(undefined);
  // STARTER_HOTEL_CONFIG = new BehaviorSubject<any>(undefined);
  STARTER_PORTAL_CONFIG = new BehaviorSubject<HotelConfig>(undefined);
  BASKET_PROCESSORS: Array<BasketProcessor> = [];
  BASKET_PANEL_ITEMS_COMPONENT_FACTORIES = new BehaviorSubject<object>({});
  BASKET_GUEST_ITEM_FACTORIES = new BehaviorSubject<object>({});
  BASKET_STEP_FACTORIES = new BehaviorSubject<{ [k: string]: { label: string, factory: any } }>({});
  SEARCH_BOX_COMPONENT_FACTORIES = new BehaviorSubject<{ [k: string]: { id: string, icon: string, label: string, type: string, factory: any } }>({});
  COMPLETE_ITEM_COMPONENT_FACTORIES = new BehaviorSubject<any>([]);
  HOMEPAGE_DYNAMIC_DESIGN_FACTORIES = new BehaviorSubject<any>([]);
  PORTAL_ENV: PortalEnvironment;
  test = Math.random();
  // PORTAL_SERVICE: PortalService;
  // LOGIN_SERVICE: LoginService;
  // ONLINE_SERVICE: OnlineService;
  APP_SERVICE: AppService
  constructor(
    @Inject(PORTAL_ENV) public environment: PortalEnvironment
  ) {
    this.PORTAL_ENV = this.environment;
    window['injService'] = this;
  }
}
