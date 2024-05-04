import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from '../common/storage.service';
import { map, Observable } from 'rxjs';
import {
  AccountLedgerFilter,
  OutstandingRegisterFilter,
  PurchaseRegisterFilter,
  SalesRegisterFilter,
} from '../../models';

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
      `api/v${this.version}`;
  }

  PrintPurchaseRegister(filter: PurchaseRegisterFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/financial/register/purchase`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('OutputType', `${filter.outputType}`)
      .set('MonthWiseSummary', `${filter.monthWiseSummary}`)
      .set('ItemWiseSummary', `${filter.itemWiseSummary}`);

    if (filter.accountsIds.length > 0) {
      filter.accountsIds.forEach((element) => {
        params = params.append('AccountsIds', element);
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

  PrintSalesRegister(filter: SalesRegisterFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/financial/register/sales`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('OutputType', `${filter.outputType}`)
      .set('MonthWiseSummary', `${filter.monthWiseSummary}`)
      .set('ItemWiseSummary', `${filter.itemWiseSummary}`);

    if (filter.accountsIds.length > 0) {
      filter.accountsIds.forEach((element) => {
        params = params.append('AccountsIds', element);
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

  PrintOutstandingReport(filter: OutstandingRegisterFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/financial/register/outstanding`;
    let params = new HttpParams()
      .set('AsOnDate', `${filter.asOnDate}`)
      .set('AreaWise', `${filter.areaWise}`)
      .set('AreaID', `${filter.areaID}`)
      .set('OutstandingType', `${filter.outstandingType}`)
      .set('WithInvoice', `${filter.withInvoice}`);

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

  PrintAccountLedger(filter: AccountLedgerFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/financial/accountledger`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('OutputType', `${filter.outputType}`);

    if (filter.accountsIds.length > 0) {
      filter.accountsIds.forEach((element) => {
        params = params.append('AccountsIds', element);
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
