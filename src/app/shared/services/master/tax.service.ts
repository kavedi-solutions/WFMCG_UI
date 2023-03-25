import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { FilterValues, PaginationHeaders, Tax, TaxPostRequest, TaxPutRequest, TaxResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
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

  GetTaxList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<TaxResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/tax/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: TaxResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetTaxbyID(TaxID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/${TaxID}/getbyid`;
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

  CheckTaxNameExists(TaxID: number, TaxName: string) {
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/${TaxID}/${encodeURIComponent(TaxName)}/taxname-exists`;
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

  createTax(resourcesDetails: TaxPostRequest): Observable<Tax> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/create`;
    return this.http.post<Tax>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateTax(
    taxID: number,
    resourcesDetails: TaxPutRequest
  ): Observable<Tax> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/update/${taxID}`;
    return this.http.put<Tax>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateTax(TaxID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/${TaxID}/deactivate/${this.UserID}`;
    return this.http.put<Tax>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateTax(TaxID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/${TaxID}/activate/${this.UserID}`;
    return this.http.put<Tax>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  TaxDropDown() {
    const url = `${this.APIURL}/company/${this.CompanyID}/tax/dropdown`;
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
