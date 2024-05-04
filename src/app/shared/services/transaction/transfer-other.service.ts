import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  TransferOtherPagedResponse,
  TransferOtherPostRequest,
  TransferOtherPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';


@Injectable({
  providedIn: 'root'
})
export class TransferOtherService {

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

  GetTransferOtherList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<TransferOtherPagedResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: TransferOtherPagedResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetNextTransferNo(TransferDate: Date) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/getnexttransferno?TransferDate=${TransferDate}`;
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

  GetTransferOtherbyID(AutoID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/${AutoID}/getbyid`;
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

  createTransferOther(
    resourcesDetails: TransferOtherPostRequest
  ): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/create`;
    return this.http.post<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateTransferOther(
    AutoID: number,
    resourcesDetails: TransferOtherPutRequest
  ): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.modifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/update/${AutoID}`;
    return this.http.put<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  deleteTransferOther(AutoID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/Other/delete/${AutoID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }
}
