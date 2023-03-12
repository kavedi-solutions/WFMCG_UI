import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Area,
  AreaResponse,
  AreaPostRequest,
  AreaPutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
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

  GetAreaList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[],
  ): Observable<AreaResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/area/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: AreaResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetAreabyID(AreaID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/area/${AreaID}/getbyid`;
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

  CheckAreaNameExists(AreaID: number, AreaName: string) {
    const url = `${this.APIURL}/company/${this.CompanyID}/area/${AreaID}/${encodeURIComponent(AreaName)}/areaname-exists`;
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

  createArea(resourcesDetails: AreaPostRequest): Observable<Area> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/area/create`;
    return this.http.post<Area>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateArea(
    areaID: number,
    resourcesDetails: AreaPutRequest
  ): Observable<Area> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/area/update/${areaID}`;
    return this.http.put<Area>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateArea(AreaID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/area/${AreaID}/deactivate/${this.UserID}`;
    return this.http.put<Area>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateArea(AreaID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/area/${AreaID}/activate/${this.UserID}`;
    return this.http.put<Area>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  AreaDropDown() {
    const url = `${this.APIURL}/company/${this.CompanyID}/area/dropdown`;
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
