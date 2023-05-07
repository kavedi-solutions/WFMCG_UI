import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  PurchaseSPostRequest,
  PurchaseSPagedResponse,
  PurchaseSPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseSService {
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

  GetPurchaseList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<PurchaseSPagedResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: PurchaseSPagedResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetNextBillNo(BookAccountID: number, BillDate: Date) {
    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/getnextbill/${BookAccountID}?BillDate=${BillDate}`;
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

  GetPurchasebyID(PurchaseID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/${PurchaseID}/getbyid`;
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

  createPurchase(resourcesDetails: PurchaseSPostRequest): Observable<any> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/create`;
    return this.http.post<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updatePurchase(
    purchaseID: number,
    resourcesDetails: PurchaseSPutRequest
  ): Observable<any> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/update/${purchaseID}`;
    return this.http.put<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  deletePurchase(purchaseID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/purchase/service/delete/${purchaseID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }
}
