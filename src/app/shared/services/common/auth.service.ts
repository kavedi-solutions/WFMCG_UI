import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, of } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AccessRights } from '../../models';
import { LocalStorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

const fileHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    includeMedia: 'true',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  APIURL?: string = '';
  version: string = '1';
  CompanyID: string = this.storage.get('companyID');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private appconfig: AppConfig,
    private jwtHelperService: JwtHelperService
  ) {
    this.APIURL = this.appconfig.GetCoreAPIURL() + `api/v${this.version}`;
  }

  Login(username: string, password: string) {
    let params = new HttpParams()
      .set('UserName', `${username}`)
      .set('Password', `${password}`);

    const url = `${this.APIURL}/login`;

    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        }),
        catchError((error) => of(console.log(error)))
      );
  }

  GetMenu() {
    const url = `${this.APIURL}/common/menu`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        }),
        catchError((error) => of(console.log(error)))
      );
  }

  getUserAccessRights(MenuID: string): AccessRights {
    debugger;
    const decode = this.jwtHelperService.decodeToken(
      this.storage.get('jwtToken')
    );
    let Rights: string[] = decode['Role_' + MenuID].split(',');
    var accRights: AccessRights = {
      canView: false,
      canAdd: false,
      canEdit: false,
      canDelete: false,
    };

    Rights.forEach((element) => {
      switch (element) {
        case 'RY':
          accRights.canView = true;
          break;
        case 'CY':
          accRights.canAdd = true;
          break;
        case 'UY':
          accRights.canEdit = true;
          break;
        case 'DY':
          accRights.canDelete = true;
          break;
      }
    });

    return accRights;
  }
}
