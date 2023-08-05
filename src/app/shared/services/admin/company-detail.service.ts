import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { CompanyPutRequest, CompanyResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyDetailService {
  APIURL?: string = '';
  version: string = '1';
  CompanyID: string = this.storage.get('companyID');
  UserID: string = this.storage.get('userID');

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private appconfig: AppConfig
  ) {
    this.APIURL =
      this.appconfig.GetCoreAPIURL() +
      `api/v${this.version}/company/${this.CompanyID}`;
  }

  GetCompanyDetailbyID() {
    const url = `${this.APIURL}/getbyid`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  updateCompany(
    resourcesDetails: CompanyPutRequest
  ): Observable<CompanyResponse> {
    const url = `${this.APIURL}/update`;
    return this.http.put<CompanyResponse>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }
}
