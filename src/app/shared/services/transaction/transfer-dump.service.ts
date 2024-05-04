import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  TransferDumpPagedResponse,
  TransferDumpPostRequest,
  TransferDumpPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TransferDumpService {
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

  GetTransferDumpList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<TransferDumpPagedResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: TransferDumpPagedResponse = {
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
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/getnexttransferno?TransferDate=${TransferDate}`;
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

  GetTransferDumpbyID(AutoID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/${AutoID}/getbyid`;
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

  createTransferDump(
    resourcesDetails: TransferDumpPostRequest
  ): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/create`;
    return this.http.post<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateTransferDump(
    AutoID: number,
    resourcesDetails: TransferDumpPutRequest
  ): Observable<any> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.modifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/update/${AutoID}`;
    return this.http.put<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  deleteTransferDump(AutoID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/transfer/dump/delete/${AutoID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }
}
