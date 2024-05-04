import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  VReceiptPagedResponse,
  VReceiptPostRequest,
  VReceiptPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class VReceiptService {

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

  GetVReceiptList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<VReceiptPagedResponse> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    let params = new HttpParams()
      .set('Page', `${paginationHeaders.page}`)
      .set('PageSize', `${paginationHeaders.pageSize}`)
      .set('Sort', `${sort}`)
      .set('Query', `${searchText}`);
    if (filter) {
      filter.forEach((filterValues) => {
        params = filterValues.title
          ? params.append(filterValues.title, filterValues.value!.toString())
          : params;
      });
    }

    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: VReceiptPagedResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetNextVoucherNo(BookAccountID: number, VoucherDate: Date) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/getnextvoucher/${BookAccountID}?VoucherDate=${VoucherDate}`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return Number(response.body);
        })
      );
  }

  GetVReceiptbyID(VReceiptID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/${VReceiptID}/getbyid`;
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

  createVReceipt(resourcesDetails: VReceiptPostRequest): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/create`;
    return this.http.post<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateVReceipt(
    VReceiptID: number,
    resourcesDetails: VReceiptPutRequest
  ): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.modifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/update/${VReceiptID}`;
    return this.http.put<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  deleteVReceipt(VReceiptID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/voucher/receipt/delete/${VReceiptID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }
}
