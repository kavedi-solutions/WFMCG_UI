import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  CompanyPutRequest,
  CompanyResponse,
  eInvoiceFilter,
  eInvoiceResponse,
  e_InvoiceRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class EInvoiceService {
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

  GetAPIBalance() {
    const url = `${this.APIURL}/einvoice/getapibalance`;
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

  GeteInvoiceData(filter: eInvoiceFilter): Observable<eInvoiceResponse[]> {
    const url = `${this.APIURL}/einvoice/getinvoice`;
    let params = new HttpParams()
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('EIstatus', `${filter.eistatus}`);

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

  GeteInvoiceErrorData(filter: eInvoiceFilter): Observable<eInvoiceResponse[]> {
    const url = `${this.APIURL}/einvoice/error`;
    let params = new HttpParams()
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('EIstatus', `${filter.eistatus}`);

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

  GetGSTDetail(GSTIN: string) {
    const url = `${this.APIURL}/einvoice/getgstDetail/${GSTIN}`;
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

  GenerateEInvoice(request: e_InvoiceRequest) {
    const url = `${this.APIURL}/einvoice/generate`;
    return this.http.post<e_InvoiceRequest>(encodeURI(url), request, {
      headers: this.headers,
    });
  }

  GetEInvoiceDetails(request: e_InvoiceRequest) {
    const url = `${this.APIURL}/einvoice/getbyirn`;
    return this.http.post<e_InvoiceRequest>(encodeURI(url), request, {
      headers: this.headers,
    });
  }
}
