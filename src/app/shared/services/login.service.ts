import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  APIURL?: string = '';
  constructor(private http: HttpClient, private appconfig: AppConfig) {
    this.APIURL = this.appconfig.GetCoreAPIURL();
  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  httpGet(url: string, paramater: any): Observable<any> {
    //this.SetHeader();
    const options = {
      params: new HttpParams({ fromObject: paramater }),
      headers: this.headers,
    };
    let version: string = '1';
    const geturl = `${this.APIURL}api/v${version}/${url}`;
    return this.http.get<any>(geturl, options);
  }
}
