import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  ItemGroup,
  ItemGroupResponse,
  ItemGroupPostRequest,
  ItemGroupPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ItemgroupService {
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

  GetItemGroupList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<ItemGroupResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: ItemGroupResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetItemGroupbyID(ItemGroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/${ItemGroupID}/getbyid`;
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

  CheckItemGroupNameExists(ItemGroupID: number, ItemGroupName: string) {
    const url = `${this.APIURL}/company/${
      this.CompanyID
    }/itemgroup/${ItemGroupID}/${encodeURIComponent(
      ItemGroupName
    )}/ItemGroupname-exists`;
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

  createItemGroup(
    resourcesDetails: ItemGroupPostRequest
  ): Observable<ItemGroup> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/create`;
    return this.http.post<ItemGroup>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateItemGroup(
    ItemGroupID: number,
    resourcesDetails: ItemGroupPutRequest
  ): Observable<ItemGroup> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/update/${ItemGroupID}`;
    return this.http.put<ItemGroup>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateItemGroup(ItemGroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/${ItemGroupID}/deactivate/${this.UserID}`;
    return this.http.put<ItemGroup>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateItemGroup(ItemGroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/${ItemGroupID}/activate/${this.UserID}`;
    return this.http.put<ItemGroup>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ItemGroupDropDown(ItemGroupType: string) {
    const url = `${this.APIURL}/company/${this.CompanyID}/itemgroup/dropdown/${ItemGroupType}`;
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
}
