import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Manufacture,
  ManufactureResponse,
  ManufacturePostRequest,
  ManufacturePutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';
@Injectable({
  providedIn: 'root',
})
export class ManufactureService {
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

  GetManufactureList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<ManufactureResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: ManufactureResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetManufacturebyID(ManufactureID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/${ManufactureID}/getbyid`;
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

  CheckManufactureNameExists(ManufactureID: number, ManufactureName: string) {
    const url = `${this.APIURL}/company/${
      this.CompanyID
    }/manufacture/${ManufactureID}/${encodeURIComponent(ManufactureName)}/manufacturename-exists`;
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

  createManufacture(resourcesDetails: ManufacturePostRequest): Observable<Manufacture> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/create`;
    return this.http.post<Manufacture>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateManufacture(
    manufactureID: number,
    resourcesDetails: ManufacturePutRequest
  ): Observable<Manufacture> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/update/${manufactureID}`;
    return this.http.put<Manufacture>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateManufacture(ManufactureID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/${ManufactureID}/deactivate/${this.UserID}`;
    return this.http.put<Manufacture>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateManufacture(ManufactureID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/${ManufactureID}/activate/${this.UserID}`;
    return this.http.put<Manufacture>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ManufactureDropDown() {
    const url = `${this.APIURL}/company/${this.CompanyID}/manufacture/dropdown`;
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
