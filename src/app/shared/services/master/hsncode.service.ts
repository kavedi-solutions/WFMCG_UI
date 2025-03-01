import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  HSNCode,
  HSNCodePostRequest,
  HSNCodePutRequest,
  HSNCodeResponse,
  PaginationHeaders,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class HSNCodeService {
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

  GetHSNCodeList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<HSNCodeResponse> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
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

    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: HSNCodeResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetHSNCodebyID(HSNCodeID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/${HSNCodeID}/getbyid`;
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

  CheckHSNCodeExists(HSNCodeID: number, HSNCode: string) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/${HSNCodeID}/${encodeURIComponent(HSNCode)}/hsncode-exists`;
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

  createHSNCode(resourcesDetails: HSNCodePostRequest): Observable<HSNCode> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/create`;
    return this.http.post<HSNCode>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateHSNCode(
    HSNCodeID: number,
    resourcesDetails: HSNCodePutRequest
  ): Observable<HSNCode> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    resourcesDetails.modifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/update/${HSNCodeID}`;
    return this.http.put<HSNCode>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateHSNCode(HSNCodeID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/${HSNCodeID}/deactivate/${this.UserID}`;
    return this.http.put<HSNCode>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateHSNCode(HSNCodeID: number) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/${HSNCodeID}/activate/${this.UserID}`;
    return this.http.put<HSNCode>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  HSNCodeDropDown(HSNSACType: string) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/itemhsn/dropdown/${HSNSACType}`;
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
