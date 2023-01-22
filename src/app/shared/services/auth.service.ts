import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

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
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,

    private appconfig: AppConfig
  ) {
    this.APIURL = this.appconfig.GetCoreAPIURL() + `api/v${this.version}`;
  }

  Login(username: string, password: string) {
    let params = new HttpParams()
      .set('UserName', `${username}`)
      .set('Password', `${password}`);

    let version: string = '1';
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
}
