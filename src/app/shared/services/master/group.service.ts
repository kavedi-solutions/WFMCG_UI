import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Group,
  GroupResponse,
  GroupPostRequest,
  GroupPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
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

  GetGroupList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string
  ): Observable<GroupResponse> {
    let params = new HttpParams()
      .set('Page', `${paginationHeaders.page}`)
      .set('PageSize', `${paginationHeaders.pageSize}`)
      .set('Sort', `${sort}`)
      .set('Query', `${searchText}`);
    // if (filter) {
    //   filter.forEach((filterValues) => {
    //     params = filterValues.title
    //       ? params.append(
    //           filterValues.title,
    //           filterValues.value!.value.toString()
    //         )
    //       : params;
    //   });
    // }

    const url = `${this.APIURL}/company/${this.CompanyID}/group/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: GroupResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
            sort,
            filter: [],
            searchText,
          };
          return payload;
        })
      );
  }

  GetGroupbyID(GroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/group/${GroupID}/getbyid`;
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

  CheckGroupNameExists(GroupID: number, GroupName: string) {
    const url = `${this.APIURL}/company/${this.CompanyID}/group/${GroupID}/${GroupName}/groupname-exists`;
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

  createGroup(resourcesDetails: GroupPostRequest): Observable<Group> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/group/create`;
    return this.http.post<Group>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateGroup(
    GroupID: number,
    resourcesDetails: GroupPutRequest
  ): Observable<Group> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/group/update/${GroupID}`;
    return this.http.put<Group>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateGroup(GroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/group/${GroupID}/deactivate/${this.UserID}`;
    return this.http.put<Group>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateGroup(GroupID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/group/${GroupID}/activate/${this.UserID}`;
    return this.http.put<Group>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  GroupDropDown() {
    const url = `${this.APIURL}/company/${this.CompanyID}/group/dropdown`;
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
