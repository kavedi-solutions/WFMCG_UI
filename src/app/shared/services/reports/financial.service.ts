import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from '../common/storage.service';
import { map, Observable } from 'rxjs';
import { OutstandingRegisterFilter } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
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
      `api/v${this.version}/company/${this.CompanyID}/reports/financial`;
  }

  PrintOutstandingReport(filter: OutstandingRegisterFilter) {
    const url = `${this.APIURL}/register/outstanding`;
    let params = new HttpParams()      
      .set('AsOnDate', `${filter.asOnDate}`)
      .set('AreaWise', `${filter.areaWise}`)
      .set('AreaID', `${filter.areaID}`)
      .set('OutstandingType', `${filter.outstandingType}`)
      .set('WithInvoice', `${filter.withInvoice}`)      

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
