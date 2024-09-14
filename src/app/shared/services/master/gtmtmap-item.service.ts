import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  ItemGTMTMapping,
  ItemGTMTMappingResponse,
  ItemGTMTPostRequest,
  ItemGTMTPutRequest,
  PaginationHeaders,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GTMTMapItemService {
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
    searchText: string
  ): Observable<ItemGTMTMappingResponse> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    let params = new HttpParams()
      .set('Page', `${paginationHeaders.page}`)
      .set('PageSize', `${paginationHeaders.pageSize}`)
      .set('Sort', `${sort}`)
      .set('Query', `${searchText}`);

    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: ItemGTMTMappingResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  createItem(
    resourcesDetails: ItemGTMTPostRequest
  ): Observable<ItemGTMTMapping> {
    this.CompanyID = this.storage.get('companyID');
    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/create`;
    return this.http.post<ItemGTMTMapping>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateItem(
    AutoID: number,
    resourcesDetails: ItemGTMTPutRequest
  ): Observable<ItemGTMTMapping> {
    this.CompanyID = this.storage.get('companyID');
    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/update/${AutoID}`;
    return this.http.put<ItemGTMTMapping>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  GTItemDropDown() {
    this.CompanyID = this.storage.get('companyID');
    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/dropdown`;

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

  MTItemDropDown(GTItemID: number) {
    this.CompanyID = this.storage.get('companyID');
    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/dropdown/${GTItemID}`;

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

  DeleteMappingItembyID(AutoID: number) {
    this.CompanyID = this.storage.get('companyID');
    const url = `${this.APIURL}/company/${this.CompanyID}/item/gtmt/delete/${AutoID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }
}
