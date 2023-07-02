import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from '../common/storage.service';
import { map, Observable } from 'rxjs';
import { StockStatementFilter } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ReportStocksService {
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
      `api/v${this.version}/company/${this.CompanyID}/reports/stock`;
  }

  PrintStockStatement(filter: StockStatementFilter) {
    const url = `${this.APIURL}/stockstatement`;
    let params = new HttpParams();
    params = params.append('ReturnTypeID', filter.returnTypeID);
    params = params.append('FromDate', filter.fromDate);
    params = params.append('ToDate', filter.toDate);
    params = params.append('AccountTradeTypeID', filter.accountTradeTypeID);
    params = params.append('WithAmount', filter.withAmount);
    params = params.append('WithAllAmount', filter.withAllAmount);
    params = params.append('AmountCalculatedOn', filter.amountCalculatedOn);
    params = params.append('IsChildGroups', filter.isChildGroups);

    if (filter.itemGroups.length > 0) {
      filter.itemGroups.forEach((element) => {
        params = params.append('ItemGroups', element);
      });
    }

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
