import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
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
  CurrentAccountBalanceResponse,
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
    let params = new HttpParams();
    if (filters.GroupID.length > 0) {
      filters.GroupID.forEach((element) => {
        params = params.append('GroupID', element);
      });
    } 

    if (filters.BalanceTransferToID.length > 0) {
      filters.BalanceTransferToID.forEach((element) => {
        params = params.append('BalanceTransferToID', element);
      });
    } 

    if (filters.AccountTypeID.length > 0) {
      filters.AccountTypeID.forEach((element) => {
        params = params.append('AccountTypeID', element);
      });
    } 

    if (filters.TransactionTypeID.length > 0) {
      filters.TransactionTypeID.forEach((element) => {
        params = params.append('TransactionTypeID', element);
      });
    } 

    if (filters.SalesTypeID.length > 0) {
      filters.SalesTypeID.forEach((element) => {
        params = params.append('SalesTypeID', element);
      });
    }

    if (filters.AccountTradeTypeID.length > 0) {
      filters.AccountTradeTypeID.forEach((element) => {
        params = params.append('AccountTradeTypeID', element);
      });
    } 

    if (filters.AreaID.length > 0) {
      filters.AreaID.forEach((element) => {
        params = params.append('AreaID', element);
      });
    } 

    if (filters.HeadBookId.length > 0) {
      filters.HeadBookId.forEach((element) => {
        params = params.append('HeadBookId', element);
      });
    } 

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

  GetCurrentAccountBalance(AccountID: number) {
    const url = `${this.APIURL}/company/${this.CompanyID}/accounts/currentbalance/${AccountID}`;
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
