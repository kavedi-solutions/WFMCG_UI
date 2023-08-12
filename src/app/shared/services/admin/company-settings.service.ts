import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { CompanySettingPutRequest, CompanySettingResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsService {
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

  GetCompanySettingsbyID() {
    const url = `${this.APIURL}/settings/getbyid`;
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

  updateCompanySettings(
    resourcesDetails: CompanySettingPutRequest
  ): Observable<CompanySettingResponse> {
    const url = `${this.APIURL}/settings/update`;
    return this.http.put<CompanySettingResponse>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }
}