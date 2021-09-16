import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { map, share, shareReplay, takeUntil } from 'rxjs/operators';
import { HotelConfig, Rooms, SearchParams } from './types';
import * as _ from 'lodash';
import { PortalEnvironment, PortalInjectionService, PORTAL_ENV } from './services/portal-injection.service';

export interface ApiSelectOptions {
  Object: string;
  Select?: Array<string>;
  Where?: Array<ApiWhereObject>;
  OrderBy?: Array<ApiOrderByObject>;
  Paging?: ApiPagingObject;
  DataTypes?: boolean;
  TotalCount?: boolean;
  Distinct?: boolean;
  Joins?: Array<ApiSelectJoinOption>;
}

export interface ApiWhereObject {
  Column: string;
  Operator: string;
  Value: string | number | string[] | number[];
  IsNull?: number | string;
}

export interface ApiOrderByObject {
  Column: string;
  Direction: string;
}

export interface ApiPagingObject {
  Current: number;
  ItemsPerPage: number;
}

export interface ApiSelectJoinOption {
  Object: string;
  Key: string;
  Fields: Array<string>;
  Field: string;
}

export interface ApiSelectResponse<T = any> {
  ResultSets: Array<Array<T>>;
  DataTypes: Array<ApiDataTypeObject>;
  TotalCount: number;
}
export class BaseRequest {
  Action: string;
  BaseObject?: string;

  [k: string]: any;
}

export class SelectRequest extends BaseRequest {
  Object: string;
  Select: Array<string>;
  Where?: Array<ApiWhereObject>;
  OrderBy?: Array<ApiOrderByObject>;
  Paging?: ApiPagingObject;
  DataTypes?: boolean;
  TotalCount?: boolean;
  Distinct?: boolean;
  Joins?: any;

  constructor(options: ApiSelectOptions) {
    super();
    this.Action = 'Select';
    this.Object = options.Object;
    this.Select = options.Select;
    this.Where = options.Where;
    this.OrderBy = options.OrderBy;
    if (options.Paging) {
      this.Paging = options.Paging;
    } else {
      this.Paging = { Current: 1, ItemsPerPage: 20 };
    }
    this.DataTypes = options.DataTypes || false;
    this.TotalCount = options.TotalCount || false;
    this.Distinct = options.Distinct;
    this.Joins = options.Joins;
  }
}



export interface ApiSPOptions {
  Object: string;
  Parameters: {
    [key: string]: any
  };
}

export class ExecSPRequest extends BaseRequest {
  Object: string;
  Parameters: object = {};

  constructor(options: ApiSPOptions) {
    super();
    this.Action = 'Execute';
    this.Object = options.Object;
    this.Parameters = options.Parameters;
  }
}

export class ApiResponse {
  DataTypes: Array<ApiDataTypeObject>;
  ResultSets: Array<any>;
}

export interface ApiDataTypeObject {
  HasDefault: boolean;
  IsNullable: boolean;
  Name: string;
  Type: string;
  IsComputed?: boolean;
  IsIdentity?: boolean;
  IsPrimaryKey?: boolean;
}

export class StartSequenceRequest extends BaseRequest {
  Object: string;
  Parameters: object = {};

  constructor(options: ApiSPOptions) {
    super();
    this.Action = 'ApiSequence';
    this.Object = options.Object;
    this.Parameters = options.Parameters;
  }
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  hotelConfig$ = this.getHotelConfig().pipe(shareReplay());
  rooms$ = new BehaviorSubject<Rooms>([]);
  hotelFacilities = new BehaviorSubject<HotelConfig | null>(null);
  hotelInfo$ = new BehaviorSubject<HotelConfig | null>(null);
  loginToken = '';
  url = this.environment.nodeApi + '/';
  getConfigUrl = null;

  constructor(
    public http: HttpClient,
    // private inj: Injector,
    @Inject(PORTAL_ENV) private environment: PortalEnvironment,
    private portalInjectionService: PortalInjectionService
  ) {
    this.hotelConfig$.subscribe(info => {
      if (info) {
        this.hotelInfo$.next(info)
      }
    })
  }

  apiReq(body: any): Observable<any> {
    return this.http.post('https://4001.hoteladvisor.net', body)
  }

  getHotelConfig(): Observable<HotelConfig> {
    return this.apiReq({
      Action: 'Execute',
      Object: 'SP_HOTEL_BOOKINGPARAMS',
      Parameters: {
        SUBDOMAIN: 'mango'
      }
    }).pipe(
      map((response: any) => {
        response[0][0].photos = response[1];
        return response[0][0];
      })
    )
  }
  // getFacilityConfig(): Observable<HotelConfig> {
  //   return this.apiReq({
  //     Action: 'Execute',
  //     Object: 'SP_HOTEL_BOOKINGPARAMS',
  //     Parameters: {
  //       SUBDOMAIN: 'mango'
  //     }
  //   }).pipe(
  //     map((response: any) => {
  //       response[0][0].Amenitys = response[1];
  //       return response[0];
  //     })
  //   )
  // }
  getRooms(params: SearchParams): Observable<Rooms> {
    return this.apiReq({
      Action: 'Execute',
      Object: 'SP_PORTALV4_HOTELDETAILPRICE',
      Parameters: params
    }).pipe(
      map((response: any) => {
        //response[0][0].photos = response[1];
        return response[0];
      })
    )
  }

  startSequence$(options: ApiSPOptions) {
    const reqBody = new StartSequenceRequest(options);
    return this.execute(reqBody);
  }

  execute<T = any>(param: BaseRequest, options?: any): Observable<T> {
    // this switch needed for debugging purposes
    let nameOfTheAction = '';
    let getConfigRequest = false;
    switch (param.Action) {
      case 'Execute':
      case 'Select':
      case 'ApiSequence':
        nameOfTheAction = param['Object'];
        break;
      case 'Login':
        nameOfTheAction = 'login';
        break;
      case 'GetConfig':
        getConfigRequest = true;
        nameOfTheAction = 'GetConfig/' + param['ConfigName'];
        break;
    }
   

    if (!this.environment.production && this.environment.local && this.environment.localLoginToken) {
      this.loginToken = this.environment.localLoginToken;
      param['LoginToken'] = this.environment.localLoginToken;
    } else if (this.loginToken) {
      param['LoginToken'] = this.loginToken;
    } else if (!this.environment.production && this.environment.loginToken) {
      this.loginToken = this.environment.loginToken;
      param['LoginToken'] = this.environment.loginToken;
    }

    const reqOptions: any = {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')/* .set('ngsw-bypass', 'true') */,
      ...options || {},
    };
    const requrl = new URL((getConfigRequest ? this.getConfigUrl || this.url : this.url) + nameOfTheAction);
    requrl.searchParams.append('ngsw-bypass', 'true');
    return this.http.post<ApiResponse | string | any>(requrl.toString(), JSON.parse(JSON.stringify(param)), reqOptions) as unknown as Observable<T>;
  }

  execSP(options: ApiSPOptions, {
    cancelSubject = null
  }: {
    cancelSubject?: Subject<any> | Observable<any>
  } = {
      cancelSubject: null
    }) {
    const reqBody = new ExecSPRequest(options);
    return (cancelSubject ? this.execute(reqBody).pipe(takeUntil(cancelSubject)) : this.execute(reqBody)).toPromise();
  }


  onSearch(val: any): void {
    this.getRooms(val)
      .subscribe((response) => {
        this.rooms$.next(response);
      }
      );
  }


  async minimalGetHotelConfig(isReturn?: boolean, subdomain?: string) {
    let response: any = await this.apiReq({
      Action: 'Execute',
      Object: 'SP_HOTEL_BOOKINGPARAMS',
      Parameters: {
        SUBDOMAIN: 'mango',

      }
    }).toPromise();
    if (isReturn) {
      return response;
    }
    if (0 in response && 0 in response[0] && response[0][0].Amenitys) {     
      response[0][0]._Amenitys = null;
      let amen;
      if (response[0][0].Amenitys.startsWith('[')) {
        amen = JSON.parse(response[0][0].Amenitys);
        response[0][0]._Amenitys = _.groupBy(amen, 'CatgoryName') as any;
      } else {
        amen = _.compact(_.uniq(response[0][0].Amenitys.split(',')));
        response[0][0]._Amenitys = amen;
      }
    }
    return response[0][0];
  }

  async getConfig(name: string):Promise<{}> {
    return new Promise(async (resolve, reject) => {
      const resp =  await this.http.post('https://4001.hoteladvisor.net', {
        Action: "GetConfig",
        ConfigName: name
      }).toPromise();
      if(resp){
        resolve(resp);
      }
      else{
        reject('data çekilemedi')
      }
    })
  }

  async select(options: ApiSelectOptions, {
    cancelSubject = null
  }: {
    cancelSubject?: Subject<any> | Observable<any>
  } = {
      cancelSubject: null
    }): Promise<ApiSelectResponse> {
    const reqBody = new SelectRequest(options);
    return (cancelSubject ? this.execute(reqBody).pipe(takeUntil(cancelSubject)) : this.execute(reqBody)).toPromise();
  }

  execSP$(options: ApiSPOptions) {
    const reqBody = new ExecSPRequest(options);
    return this.execute(reqBody);
  }

}
