import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { StockFilter } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
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
    this.APIURL = this.appconfig.GetCoreAPIURL() + `api/v${this.version}`;
  }

  GetClosingByItemID(ItemID: number, ReturnTypeID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/stock/${ItemID}/${ReturnTypeID}/getbyid`;
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

  SalesReturnItemStock(filters: StockFilter) {
    const url = `${this.APIURL}/company/${this.CompanyID}/stock/salesreturnitemstock`;
    let params = new HttpParams()
      .set('ReturnTypeID', `${filters.ReturnTypeID}`)
      .set('AccountTradeTypeID', `${filters.AccountTradeTypeID}`)
      .set('ItemID', `${filters.ItemID}`)
      .set('AccountID', `${filters.AccountID}`)
      .set('BillDate', `${filters.BillDate}`)
      .set('InvoiceID', `${filters.InvoiceID}`);

    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  SalesReturnInvoiceList(filters: StockFilter) {
    const url = `${this.APIURL}/company/${this.CompanyID}/stock/salesreturninvoicelist`;
    let params = new HttpParams()
      .set('ReturnTypeID', `${filters.ReturnTypeID}`)
      .set('AccountTradeTypeID', `${filters.AccountTradeTypeID}`)
      .set('ItemID', `${filters.ItemID}`)
      .set('AccountID', `${filters.AccountID}`)
      .set('BillDate', `${filters.BillDate}`);

    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
