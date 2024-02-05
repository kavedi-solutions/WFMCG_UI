import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Item,
  ItemResponse,
  ItemPostRequest,
  ItemPutRequest,
  ItemOpeningResponse,
  OpeningItemPutRequest,
  ItemFilter_DropDown,
  ItemFilter_DropDownReport,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
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

  GetItemList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<ItemResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/item/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: ItemResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetItembyID(ItemID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/${ItemID}/getbyid`;
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

  CheckItemNameExists(ItemID: number, ItemName: string) {
    const url = `${this.APIURL}/company/${
      this.CompanyID
    }/item/${ItemID}/${encodeURIComponent(ItemName)}/itemname-exists`;
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

  createItem(resourcesDetails: ItemPostRequest): Observable<Item> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/item/create`;
    return this.http.post<Item>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateItem(
    ItemID: number,
    resourcesDetails: ItemPutRequest
  ): Observable<Item> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/item/update/${ItemID}`;
    return this.http.put<Item>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateItem(ItemID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/${ItemID}/deactivate/${this.UserID}`;
    return this.http.put<Item>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateItem(ItemID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/${ItemID}/activate/${this.UserID}`;
    return this.http.put<Item>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ItemDropDown(filters: ItemFilter_DropDown) {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/dropdown`;
    let params = new HttpParams()
      .set('ItemType', `${filters.ItemType}`)
      .set('AccountTradeTypeID', `${filters.AccountTradeTypeID != undefined ? filters.AccountTradeTypeID : 0}`)
      .set('ReturnTypeID', `${filters.ReturnTypeID != undefined ? filters.ReturnTypeID : 0}`)
      .set('TransactionTypeID', `${filters.TransactionTypeID != undefined ? filters.TransactionTypeID : 0}`)
      .set('AccountID', `${filters.AccountID != undefined ? filters.AccountID : 0}`)
      .set('InvoiceID', `${filters.InvoiceID != undefined ? filters.InvoiceID : 0}`)
      .set('BillDate', `${filters.BillDate != undefined ? filters.BillDate : ''}`);

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

  ItemDropDownReport(filters: ItemFilter_DropDownReport) {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/dropdownreport`;
    let params = new HttpParams()
      .set('ItemType', `${filters.ItemType}`)      
      .set('TransactionTypeID', `${filters.TransactionTypeID != undefined ? filters.TransactionTypeID : 0}`)

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

  GetItemOpeningList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<ItemOpeningResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/item/opening/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: ItemOpeningResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  updateItemOpening(
    ItemID: number,
    resourcesDetails: OpeningItemPutRequest
  ): Observable<Item> {
    const url = `${this.APIURL}/company/${this.CompanyID}/item/opening/update/${ItemID}`;
    return this.http.put<Item>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }
}
