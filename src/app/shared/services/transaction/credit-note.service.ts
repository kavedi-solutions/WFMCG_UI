import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  CreditNotePostRequest,
  CreditNotePagedResponse,
  CreditNotePutRequest,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
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
    this.APIURL =
      this.appconfig.GetCoreAPIURL() +
      `api/v${this.version}/company/${this.CompanyID}/creditnote`;
  }

  GetCreditNoteList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<CreditNotePagedResponse> {
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

    const url = `${this.APIURL}/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: CreditNotePagedResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetNextBillNo(BookAccountID: number, BillDate: Date) {
    const url = `${this.APIURL}/getnextbill/${BookAccountID}?BillDate=${BillDate}`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return Number(response.body);
        })
      );
  }

  GetCreditNotebyID(CreditNoteID: number) {
    const url = `${this.APIURL}/${CreditNoteID}/getbyid`;
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

  createCreditNote(resourcesDetails: CreditNotePostRequest): Observable<any> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/create`;
    return this.http.post<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateCreditNote(
    creditnoteID: number,
    resourcesDetails: CreditNotePutRequest
  ): Observable<any> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/update/${creditnoteID}`;
    return this.http.put<any>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  deleteCreditNote(creditnoteID: number) {
    const url = `${this.APIURL}/delete/${creditnoteID}`;
    return this.http.delete<any>(encodeURI(url), {
      headers: this.headers,
    });
  }

  getCNDNSettlements(
    SelectType: string,
    AccountID: number,
    InvoiceType: string,
    InvoiceID: number
  ) {
    const url = `${this.APIURL}/selecttype/${SelectType}/account/${AccountID}/invoiceid/${InvoiceType}/${InvoiceID}/getcndnsettlements`;
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
    // return this.http.delete<any>(encodeURI(url), {
    //   headers: this.headers,
    // });
  }
}
