import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { GSTR1Filter, GSTR3BFilter } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GstService {
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
      `api/v${this.version}/company/${this.CompanyID}/reports/gst`;
  }

  PrintGSTR3B(filter: GSTR3BFilter) {
    const url = `${this.APIURL}/gstr3b`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('ReportType', `${filter.reportType}`);

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

  PrintGSTR1(filter: GSTR1Filter) {
    const url = `${this.APIURL}/gstr1`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)

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
