import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from '../common/storage.service';
import { map, Observable } from 'rxjs';
import {
  BulkPrintFilter,
  BulkPrintResponse,
  LoadingSlipInvoiceFilter,
  LodingSlipFilter,
} from '../../models';
import { NumberSymbol } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OthersReportService {
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
      `api/v${this.version}/company/${this.CompanyID}/reports/other`;
  }

  GetBulkPrintData(filter: BulkPrintFilter): Observable<BulkPrintResponse[]> {
    const url = `${this.APIURL}/bulkprint/get`;
    let params = new HttpParams()
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.FromDate}`)
      .set('ToDate', `${filter.ToDate}`);

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

  PrintInvoiceInventory(NoofCopy: number, InvoiceID: number[]) {
    const url = `${this.APIURL}/invoice/inventory`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
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

  PrintInvoiceService(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    const url = `${this.APIURL}/invoice/service`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
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

  PrintInvoiceAssets(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    const url = `${this.APIURL}/invoice/assets`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
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

  PrintInvoiceSalesReturn(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    const url = `${this.APIURL}/invoice/salesreturn`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
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

  PrintInvoicePurchaseReturn(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    const url = `${this.APIURL}/invoice/purchasereturn`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
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

  GetinvoiceidsData(filter: LoadingSlipInvoiceFilter): Observable<number[]> {
    const url = `${this.APIURL}/invoiceids/get`;
    let params = new HttpParams()
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`);

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

  PrintLoadingSlip(filter: LodingSlipFilter) {
    const url = `${this.APIURL}/loadingslip`;
    return this.http
      .post(encodeURI(url), filter, {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
