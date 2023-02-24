import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { PaginationHeaders, UserResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  GetUserList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string
  ): Observable<UserResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/users/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: UserResponse = {
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
}
