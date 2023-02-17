import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, Observable, filter } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { FilterValues, PaginationHeaders, Permission, RoleResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  APIURL?: string = '';
  version: string = '1';
  CompanyID: string = this.storage.get('companyID');

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  headerWithToken = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'bearer ' + this.storage.get('jwtToken'),
  });

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private appconfig: AppConfig
  ) {
    this.APIURL = this.appconfig.GetCoreAPIURL() + `api/v${this.version}`;
  }

  //filter: FilterValues[],

  GetRoleList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string
  ): Observable<RoleResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/role/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headerWithToken,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: RoleResponse = {
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

  GetDefaultPermission(Permissiontype: boolean) {
    const url = `${this.APIURL}/company/permission/default/${Permissiontype}`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headerWithToken,
        observe: 'response'
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
