import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PortalEnvironment, PORTAL_ENV, PortalInjectionService } from './portal-injection.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


export class BaseRequest {
  Action: string;
  BaseObject?: string;

  [k: string]: any;
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


export class GetConfigRequest extends BaseRequest {
  ConfigName: string;

  constructor(ConfigName) {
    super();
    this.Action = 'GetConfig';
    this.ConfigName = ConfigName;
  }
}

//
// export class SetConfigRequest extends BaseRequest {
//   ConfigName: string;
//   NewValue: string;
//   TimeStamp: string;
//
//   constructor(ConfigName, NewValue) {
//     super();
//     this.Action = 'SetConfig';
//     this.ConfigName = ConfigName;
//     this.NewValue = NewValue;
//     this.TimeStamp = TimeStamp;
//   }
// }

export interface ApiSelectResponse<T = any> {
  ResultSets: Array<Array<T>>;
  DataTypes: Array<ApiDataTypeObject>;
  TotalCount: number;
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


export interface ApiDeleteOptions {
  Object: string;
  Keys: Array<string | number>;
}

export class DeleteRequest extends BaseRequest {
  Object: string;
  Keys: Array<string | number>;

  constructor(options: ApiDeleteOptions) {
    super();
    this.Action = 'Delete';
    this.Object = options.Object;
    this.Keys = options.Keys;
  }
}


export class ApiDeleteResponse {
  Message: string;
  RowsAffected: number;
  Success: boolean;
}


export class ApiUpdateResponse {
  Message: string;
  Row: any = {};
  RowsAffected = 0;
  Success = false;
}

export interface ApiUpdateOptions {
  Object: string;
  Row: {
    [key: string]: any
  };
  SelectAfterUpdate?: Array<any>;
}

export class UpdateRequest extends BaseRequest {
  Object: string;
  Row: object = {};
  SelectAfterUpdate: Array<any> = [];

  constructor(options: ApiUpdateOptions) {
    super();
    this.Action = 'Update';
    this.Object = options.Object;
    this.Row = options.Row;
    if (options.SelectAfterUpdate) {
      this.SelectAfterUpdate = options.SelectAfterUpdate;
    }
  }
}

export interface ApiInsertOptions {
  Object: string;
  Row: {
    [key: string]: any
  };
  SelectAfterInsert?: Array<any>;
}

export class InsertRequest extends BaseRequest {
  Object: string;
  Row: object = {};
  SelectAfterInsert: Array<any> = [];

  constructor(options: ApiInsertOptions) {
    super();
    this.Action = 'Insert';
    this.Object = options.Object;
    this.Row = options.Row;
    if (options.SelectAfterInsert) {
      this.SelectAfterInsert = options.SelectAfterInsert;
    }
  }
}

export class ApiInsertResponse {
  Success: boolean;
  PrimaryKey: any;
  Message: string;
  Row: {};
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

export interface ApiFuncOptions extends ApiSPOptions {
}

export class FuncRequest extends ExecSPRequest {

  constructor(options: ApiFuncOptions) {
    super(options);
    this.Action = 'Function';
  }
}

export interface ApiTranslationSelectOptions {
  Object: string;
  PrimaryKey: string | number;
  Languages: Array<string>;
}
export class ApiTranslationSelectRequest extends BaseRequest implements ApiTranslationSelectOptions {
  Object: string;
  PrimaryKey: string | number;
  Languages: Array<string>;
  constructor(options: ApiTranslationSelectOptions) {
    super();
    this.Action = 'TranslationSelect';
    this.Object = options.Object;
    this.PrimaryKey = options.PrimaryKey;
    this.Languages = JSON.parse(JSON.stringify(options.Languages));
  }
}
export interface ApiTranslationSelectResponse {
  Success: boolean;
  Message: string;
  Translations: { [k: string]: { [k: string]: string } };
  TranslationsArray?: {
    [m: string]: { [h: string]: { [p: string]: string } }
  }
}

export interface ApiTranslationUpdateOptions {
  Object: string;
  PrimaryKey: string | number;
  Translations: { [k: string]: { [k: string]: string | number | boolean } };
}
export class ApiTranslationUpdateRequest extends BaseRequest {
  Object: string;
  PrimaryKey: string | number;
  Translations: { [k: string]: { [k: string]: string | number | boolean } };

  constructor(options: ApiTranslationUpdateOptions) {
    super();
    this.Action = 'TranslationUpdate';
    this.Object = options.Object;
    this.PrimaryKey = options.PrimaryKey;
    this.Translations = options.Translations;
  }
}
export type ApiTranslationUpdateResponse = string;

export interface ApiNavigator extends Navigator {
  CITY: string;
  COUNTRYCODE: string;
  CREATEDATE: string;
  IP: string;
  LANGUAGECODE: string;
  LATITUDE: number;
  LONGITUDE: number;
  REGION: string;
  ZIPCODE: string;
}

export interface ApiInsertOptions {
  Object: string;
  Row: {
    [key: string]: any
  };
  SelectAfterInsert?: Array<any>;
}

export interface ApiMultiInsertOptions {
  Object: string;
  Row: Array<{
    [key: string]: any
  }>;
  SelectAfterInsert?: Array<any>;
}

export class MultiInsertRequest extends BaseRequest {
  Object: string;
  Row: Array<any> = [];
  SelectAfterInsert: Array<any> = [];

  constructor(options: ApiMultiInsertOptions) {
    super();
    this.Action = 'Insert';
    this.Object = options.Object;
    this.Row = options.Row || [];
    if (options.SelectAfterInsert) {
      this.SelectAfterInsert = options.SelectAfterInsert;
    }
  }
}

export class ApiMultiInsertResponse {
  Success: boolean;
  PrimaryKeys: Array<any>;
  Message: string;
  Rows: Array<{}>;
}

export interface ApiMultiUpdateOptions {
  Object: string;
  Row: Array<{
    [key: string]: any
  }>;
  SelectAfterUpdate?: Array<any>;
}

export class MultiUpdateRequest extends BaseRequest {
  Object: string;
  Row: Array<any> = [];
  SelectAfterUpdate: Array<any> = [];

  constructor(options: ApiMultiUpdateOptions) {
    super();
    this.Action = 'Update';
    this.Object = options.Object;
    this.Row = options.Row;
    if (options.SelectAfterUpdate) {
      this.SelectAfterUpdate = options.SelectAfterUpdate;
    }
  }
}

export class ApiMultiUpdateResponse {
  Message: string;
  Row: any = {};
  Rows: Array<any> = [];
  PrimaryKeys: Array<any>;
  RowsAffected = 0;
  Success = false;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = this.environment.nodeApi + '/';

  getConfigUrl = null;

  loginToken = '';

  tenant: any = {};

  refreshToken$ = new Subject<string>();

  constructor(
    public http: HttpClient,
    // private inj: Injector,
    @Inject(PORTAL_ENV) private environment: PortalEnvironment,
    private portalInjectionService: PortalInjectionService
  ) {
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

    if (param['Parameters']) {
      const portal = this.portalInjectionService.PORTAL_SERVICE;
      if (portal && portal.portalConfig$.value.PortalId) {
        param.Parameters['PORTALID'] = portal.portalConfig$.value.PortalId;
      } else if (!('PORTALID' in param['Parameters'])) {
        param['Parameters']['PORTALID'] = 1;
      }
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

  async getEndPoint(booking = true) {

    this.url = this.environment.nodeApi + '/';
    if (booking) {
      const resp = await this.http.get('/assets/endpoints.json').toPromise();
      if (Array.isArray(resp) && resp.length > 0) {
        for (const respItem of resp) {
          if (Array.isArray(respItem.url) && respItem.url.length) {
            if (respItem.url.some(url => window.location.host === url)) {
              this.url = respItem.endpoint;
              if (respItem.webApi) {
                this.environment.webApi = respItem.webApi;
              }
            }
          }
        }
      }
    } else {
      const endpoints = {
        'siparis.elaresort.com': 'https://bisiparis.elaresort.com:4001/'
      }
      if (window.location.host in endpoints) {
        this.getConfigUrl = this.environment.nodeApi + '/';
        this.url = endpoints[window.location.host];
      }
    }
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

  select$(options: ApiSelectOptions): Observable<ApiSelectResponse> {
    const reqBody = new SelectRequest(options);

    return this.execute(reqBody);
  }


  async delete(options: ApiDeleteOptions): Promise<ApiDeleteResponse> {
    const reqBody = new DeleteRequest(options);

    return this.execute(reqBody).toPromise();
  }


  async insert(options: ApiInsertOptions): Promise<ApiInsertResponse> {
    const reqBody = new InsertRequest(options);
    if (reqBody.BaseObject) {
      reqBody.Object = reqBody.BaseObject;
      delete reqBody.BaseObject;
    }
    return this.execute(reqBody).toPromise();
  }


  update(options: ApiUpdateOptions): Promise<ApiUpdateResponse> {
    const reqBody = new UpdateRequest(options);
    if (reqBody.BaseObject) {
      reqBody.Object = reqBody.BaseObject;
      delete reqBody.BaseObject;
    }
    return this.execute(reqBody).toPromise();
  }

  async getConfig(configName: string): Promise<{}> {
    const reqBody = new GetConfigRequest(configName);
    try {
      return await this.execute(reqBody).toPromise();
    } catch (e) {
      if (e.status === 404) {
        console.warn('Get Config 404', e);
      } else if (e.status === 200) {
        console.error('Get Config Error (with status code 200)', e);
      } else {
        console.warn('Get Config Error', e);
      }
      throw e;
    }
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

  startSequence(options: ApiSPOptions) {
    const reqBody = new StartSequenceRequest(options);
    return this.execute(reqBody).toPromise();
  }

  startSequence$(options: ApiSPOptions) {
    const reqBody = new StartSequenceRequest(options);
    return this.execute(reqBody);
  }

  execSP$(options: ApiSPOptions) {
    const reqBody = new ExecSPRequest(options);
    return this.execute(reqBody);
  }

  func(options: ApiFuncOptions, {
    cancelSubject = null
  }: {
    cancelSubject?: Subject<any> | Observable<any>
  } = {
      cancelSubject: null
    }): Promise<any> {
    return (cancelSubject ? this.func$(options).pipe(takeUntil(cancelSubject)) : this.func$(options)).toPromise();
  }

  func$(options: ApiFuncOptions) {
    const reqBody = new FuncRequest(options);
    return this.execute(reqBody);
  }

  login(options: { Usercode: string, Password: string, Tenant: number }) {
    return this.execute({ Action: 'Login', ...options }).toPromise();
  }

  resetCache(options: { LoginToken: string }) {
    return this.execute({ Action: 'ResetCaches', ...options }).toPromise();
  }

  htmlTopdf(options: { HTML: string }) {
    return this.execute({ Action: 'HtmlToPdf', ...options }).toPromise();
  }

  async navigator(): Promise<ApiNavigator> {
    return await this.execute({
      Action: 'GetIp'
    }).toPromise().then(x => {
      const r = navigator;
      for (const [k, v] of Object.entries(x)) {
        r[k] = v;
      }
      return <ApiNavigator>r;
    });
  }

  selectTranslations$(options: ApiTranslationSelectOptions): Observable<ApiTranslationSelectResponse> {
    const reqBody = new ApiTranslationSelectRequest(options);
    return this.execute(reqBody).pipe(
      map(resp => {
        if (!resp.Translations) {
          resp.Translations = {};
        }
        for (const lang of options.Languages) {
          if (!resp.Translations[lang]) {
            resp.Translations[lang] = resp.Translations[lang.toUpperCase()] || resp.Translations[lang.toLowerCase()] || {};
          }
        }
        return resp;
      })
    );
  }

  selectTranslations(options: ApiTranslationSelectOptions, {
    cancelSubject = null
  }: {
    cancelSubject?: Subject<any> | Observable<any>
  } = {
      cancelSubject: null
    }): Promise<ApiTranslationSelectResponse> {
    return (cancelSubject ? this.selectTranslations$(options).pipe(takeUntil(cancelSubject)) : this.selectTranslations$(options)).toPromise();
  }

  updateTranslations$(options: ApiTranslationUpdateOptions): Observable<ApiTranslationUpdateResponse> {
    const reqBody = new ApiTranslationUpdateRequest(options);
    if (reqBody.BaseObject) {
      reqBody.Object = reqBody.BaseObject;
      delete reqBody.BaseObject;
    }
    return this.execute(reqBody);
  }

  updateTranslations(options: ApiTranslationUpdateOptions, {
    cancelSubject = null
  }: {
    cancelSubject?: Subject<any> | Observable<any>
  } = {
      cancelSubject: null
    }): Promise<ApiTranslationUpdateResponse> {
    return (cancelSubject ? this.updateTranslations$(options).pipe(takeUntil(cancelSubject)) : this.updateTranslations$(options)).toPromise();
  }

  async multiInsert(
    options: ApiMultiInsertOptions,
    cancelObservable?: Observable<any>
  ): Promise<ApiMultiInsertResponse> {
    console.log('MULTI INSERT', this.tenant, options);
    const reqBody = new MultiInsertRequest(options);
    if (reqBody.BaseObject) {
      reqBody.Object = reqBody.BaseObject;
      delete reqBody.BaseObject;
    }
    let cellCount = 0;
    for (const row of reqBody.Row) {
      for (const key of Object.keys(row)) {
        cellCount++;
        if (cellCount > 2000) {
          throw new Error('Can\'t multi-insert nore than 2000 fields.');
        }
        if (typeof row[key] === 'number') {
          row[key] = '' + row[key];
        }
      }
    }
    return this.execute(reqBody).toPromise();
  }

  multiUpdate(options: ApiMultiUpdateOptions, cancelObservable?: Observable<any>): Promise<ApiMultiUpdateResponse> {
    const reqBody = new MultiUpdateRequest(options);
    if (Array.isArray(reqBody.Row)) {
      for (const rowElement of reqBody.Row) {
        for (const [key, value] of Object.entries(rowElement)) {
          if (typeof value === 'number') {
            rowElement[key] = '' + value;
          }
        }
      }
    }
    if (reqBody.BaseObject) {
      reqBody.Object = reqBody.BaseObject;
      delete reqBody.BaseObject;
    }
    return this.execute(reqBody).toPromise();
  }
}
