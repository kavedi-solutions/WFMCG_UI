import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of, Observable, filter } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Permission,
  Role,
  RoleResponse,
  RolePostRequest,
  RolePutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
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

  //filter: FilterValues[],

  GetRoleList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<RoleResponse> {
    let params = new HttpParams()
      .set('Page', `${paginationHeaders.page}`)
      .set('PageSize', `${paginationHeaders.pageSize}`)
      .set('Sort', `${sort}`)
      .set('Query', `${searchText}`);
    if (filter) {
      filter.forEach((filterValues) => {
        params = filterValues.title
          ? params.append(
              filterValues.title,
              filterValues.value!.toString()
            )
          : params;
      });
    }

    const url = `${this.APIURL}/company/${this.CompanyID}/role/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: RoleResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetDefaultPermission(Permissiontype: boolean) {
    const url = `${this.APIURL}/company/permission/default/${Permissiontype}`;
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

  GetRolebyID(RoleID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/role/${RoleID}/getbyid`;
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

  CheckRoleNameExists(RoleID: number, RoleName: string) {
    const url = `${this.APIURL}/company/${this.CompanyID}/role/${RoleID}/${RoleName}/rolename-exists`;
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

  createRole(resourcesDetails: RolePostRequest): Observable<Role> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/role/create`;
    return this.http.post<Role>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateRole(
    roleID: number,
    resourcesDetails: RolePutRequest
  ): Observable<Role> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/role/update/${roleID}`;
    return this.http.put<Role>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateRole(RoleID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/role/${RoleID}/deactivate/${this.UserID}`;
    return this.http.put<Role>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateRole(RoleID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/role/${RoleID}/activate/${this.UserID}`;
    return this.http.put<Role>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  RoleDropDown() {
    const url = `${this.APIURL}/company/${this.CompanyID}/role/dropdown`;
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
