import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import {
  FilterValues,
  PaginationHeaders,
  Accounts,
  AccountsResponse,
  AccountsPostRequest,
  AccountsPutRequest,
  AccountFilter_DropDown,
  AccountBalancePutRequest,
  AccountBalanceResponse,
} from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
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

  GetAccountsList(
    paginationHeaders: PaginationHeaders,
    sort: string,
    searchText: string,
    filter: FilterValues[]
  ): Observable<AccountsResponse> {
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

    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/paged`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          const payload: AccountsResponse = {
            headers: JSON.parse(response.headers.get('x-pagination')!),
            body: response.body,
          };
          return payload;
        })
      );
  }

  GetAccountsbyID(AccountsID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/${AccountsID}/getbyid`;
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

  CheckAccountsNameExists(AccountsID: number, AccountsName: string) {
    const url = `${this.APIURL}/company/${
      this.CompanyID
    }/accounts/${AccountsID}/${encodeURIComponent(
      AccountsName
    )}/accountsname-exists`;
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

  CheckBookInitExists(AccountsID: number, BookInit: string) {
    const url = `${this.APIURL}/company/${
      this.CompanyID
    }/accounts/${AccountsID}/${encodeURIComponent(BookInit)}/bookinit-exists`;
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

  createAccounts(resourcesDetails: AccountsPostRequest): Observable<Accounts> {
    resourcesDetails.createdBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/create`;
    return this.http.post<Accounts>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  updateAccounts(
    AccountsID: number,
    resourcesDetails: AccountsPutRequest
  ): Observable<Accounts> {
    resourcesDetails.ModifiedBy = this.UserID;
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/update/${AccountsID}`;
    return this.http.put<Accounts>(encodeURI(url), resourcesDetails, {
      headers: this.headers,
    });
  }

  DeactivateAccounts(AccountsID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/${AccountsID}/deactivate/${this.UserID}`;
    return this.http.put<Accounts>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  ActivateAccounts(AccountsID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/${AccountsID}/activate/${this.UserID}`;
    return this.http.put<Accounts>(encodeURI(url), null, {
      headers: this.headers,
    });
  }

  AccountsDropDown(filters: AccountFilter_DropDown) {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/dropdown`;
    let params = new HttpParams()
      .set('GroupID', `${filters.GroupID}`)
      .set('BalanceTransferToID', `${filters.BalanceTransferToID}`)
      .set('AccountTypeID', `${filters.AccountTypeID}`)
      .set('TransactionTypeID', `${filters.TransactionTypeID}`)
      .set('SalesTypeID', `${filters.SalesTypeID}`)
      .set('AccountTradeTypeID', `${filters.AccountTradeTypeID}`)
      .set('AreaID', `${filters.AreaID}`);

    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetAccountBalance() {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/balance`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  UpdateBalance(
    AccountsID: number,
    resourcesDetails: AccountBalancePutRequest
  ): Observable<AccountBalanceResponse> {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/updatebalance/${AccountsID}`;
    return this.http.put<AccountBalanceResponse>(
      encodeURI(url),
      resourcesDetails,
      {
        headers: this.headers,
      }
    );
  }
}