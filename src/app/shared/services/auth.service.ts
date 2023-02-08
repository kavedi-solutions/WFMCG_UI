import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
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

  headerWithToken = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'bearer ' + this.storage.get('jwtToken'),
  });

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private appconfig: AppConfig
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
        headers: this.headerWithToken,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        }),
        catchError((error) => of(console.log(error)))
      );
  }
}
