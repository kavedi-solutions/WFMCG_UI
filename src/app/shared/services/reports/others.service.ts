import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { LocalStorageService } from '../common/storage.service';
import { map, Observable } from 'rxjs';
import {
  accountsIncentiveDropDown,
  BulkPrintFilter,
  BulkPrintResponse,
  DailyCollectionReportFilter,
  IncentiveReportFilter,
  LoadingSlipInvoiceFilter,
  LodingSlipFilter,
  SalesPurchaseReportFilter,
  SalesPurchaseReportResponse,
  VoucherPrintFilter,
  VoucherPrintResponse,
} from '../../models';
import { NumberSymbol } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class OthersReportService {
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

  GetBulkPrintData(filter: BulkPrintFilter): Observable<BulkPrintResponse[]> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/bulkprint/get`;
    let params = new HttpParams()
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.FromDate}`)
      .set('ToDate', `${filter.ToDate}`);

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

  PrintInvoiceInventory(NoofCopy: number, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/inventory`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoiceService(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/service`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoiceAssets(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/assets`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoiceSalesReturn(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/salesreturn`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoicePurchaseReturn(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/purchasereturn`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoiceCreditNote(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/creditnote`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintInvoiceDebitNote(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoice/debitnote`;
    let params = new HttpParams();

    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetinvoiceidsData(filter: LoadingSlipInvoiceFilter): Observable<number[]> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/invoiceids/get`;
    let params = new HttpParams()
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`);

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

  PrintLoadingSlip(filter: LodingSlipFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/loadingslip`;
    return this.http
      .post(encodeURI(url), filter, {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetVoucherPrintData(
    filter: VoucherPrintFilter
  ): Observable<VoucherPrintResponse[]> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/voucher/get`;
    let params = new HttpParams()
      .set('VoucherType', `${filter.voucherType}`)
      .set('BookAccountID', `${filter.bookAccountID}`)
      .set('FromDate', `${filter.FromDate}`)
      .set('ToDate', `${filter.ToDate}`);

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

  PrintVouchers(
    VoucherType: string,
    NoofCopy: NumberSymbol,
    InvoiceID: number[]
  ) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/voucher/print`;
    let params = new HttpParams();
    if (VoucherType != '') {
      params = params.append('VoucherType', VoucherType);
    }
    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  PrintJVouchers(NoofCopy: NumberSymbol, InvoiceID: number[]) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/jvoucher/print`;
    let params = new HttpParams();
    if (NoofCopy != 0) {
      params = params.append('noofCopy', NoofCopy);
    }

    if (InvoiceID.length > 0) {
      InvoiceID.forEach((element) => {
        params = params.append('InvoiceIDs', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetsalespurchaseData(
    filter: SalesPurchaseReportFilter
  ): Observable<SalesPurchaseReportResponse[]> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/salepurchasereport`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('ReturnTypeID', `${filter.returnTypeID}`)
      .set('HasBookSelected', `${filter.hasBookSelected}`)
      .set('HasFirstSelected', `${filter.hasFirstSelected}`)
      .set('SelectedFirstName', `${filter.selectedFirstName}`)
      .set('HasSecondSelected', `${filter.hasSecondSelected}`)
      .set('SelectedSecondName', `${filter.selectedSecondName}`)
      .set('HasThirdSelected', `${filter.hasThirdSelected}`)
      .set('SelectedThirdName', `${filter.selectedThirdName}`)
      .set('HasFourthSelected', `${filter.hasFourthSelected}`)
      .set('SelectedFourthName', `${filter.selectedFourthName}`)
      .set('HasFifthSelected', `${filter.hasFifthSelected}`)
      .set('SelectedFifthName', `${filter.selectedFifthName}`)
      .set('HasSixthSelected', `${filter.hasSixthSelected}`)
      .set('SelectedSixthName', `${filter.selectedSixthName}`)
      .set('MonthWise', `${filter.monthWise}`)
      .set('ShowInvoiceNo', `${filter.showInvoiceNo}`)
      .set('ShowInvoiceDate', `${filter.showInvoiceDate}`)
      .set('ShowQuantity', `${filter.showQuantity}`)
      .set('ShowAmount', `${filter.showAmount}`)
      .set('ShowDiscountAmount', `${filter.showDiscountAmount}`)
      .set('ShowTaxableAmount', `${filter.showTaxableAmount}`)
      .set('ShowTaxAmount', `${filter.showTaxAmount}`)
      .set('ShowGrossAmount', `${filter.showGrossAmount}`)
      .set('ShowSchemeAmount', `${filter.showSchemeAmount}`)
      .set('ShowNetAmount', `${filter.showNetAmount}`)
      .set('SortFirst', `${filter.sortFirst}`)
      .set('SortSecond', `${filter.sortSecond}`)
      .set('SortThird', `${filter.sortThird}`)
      .set('SortFourth', `${filter.sortFourth}`)
      .set('SortFifth', `${filter.sortFifth}`)
      .set('SortSixth', `${filter.sortSixth}`);

    if (
      filter.selectedBookAccountID != null &&
      filter.selectedBookAccountID.length > 0
    ) {
      filter.selectedBookAccountID.forEach((element) => {
        params = params.append('SelectedBookAccountID', element);
      });
    }

    if (filter.selectedFirstID != null && filter.selectedFirstID.length > 0) {
      filter.selectedFirstID.forEach((element) => {
        params = params.append('SelectedFirstID', element);
      });
    }

    if (filter.selectedSecondID != null && filter.selectedSecondID.length > 0) {
      filter.selectedSecondID.forEach((element) => {
        params = params.append('SelectedSecondID', element);
      });
    }

    if (filter.selectedThirdID != null && filter.selectedThirdID.length > 0) {
      filter.selectedThirdID.forEach((element) => {
        params = params.append('SelectedThirdID', element);
      });
    }

    if (filter.selectedFourthID != null && filter.selectedFourthID.length > 0) {
      filter.selectedFourthID.forEach((element) => {
        params = params.append('SelectedFourthID', element);
      });
    }

    if (filter.selectedFifthID != null && filter.selectedFifthID.length > 0) {
      filter.selectedFifthID.forEach((element) => {
        params = params.append('SelectedFifthID', element);
      });
    }

    if (filter.selectedSixthID != null && filter.selectedSixthID.length > 0) {
      filter.selectedSixthID.forEach((element) => {
        params = params.append('SelectedSixthID', element);
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

  ExportsalespurchaseData(filter: SalesPurchaseReportFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/exportsalepurchasereport`;
    let params = new HttpParams()
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`)
      .set('TransactionTypeID', `${filter.transactionTypeID}`)
      .set('ReturnTypeID', `${filter.returnTypeID}`)
      .set('HasBookSelected', `${filter.hasBookSelected}`)
      .set('HasFirstSelected', `${filter.hasFirstSelected}`)
      .set('SelectedFirstName', `${filter.selectedFirstName}`)
      .set('HasSecondSelected', `${filter.hasSecondSelected}`)
      .set('SelectedSecondName', `${filter.selectedSecondName}`)
      .set('HasThirdSelected', `${filter.hasThirdSelected}`)
      .set('SelectedThirdName', `${filter.selectedThirdName}`)
      .set('HasFourthSelected', `${filter.hasFourthSelected}`)
      .set('SelectedFourthName', `${filter.selectedFourthName}`)
      .set('HasFifthSelected', `${filter.hasFifthSelected}`)
      .set('SelectedFifthName', `${filter.selectedFifthName}`)
      .set('HasSixthSelected', `${filter.hasSixthSelected}`)
      .set('SelectedSixthName', `${filter.selectedSixthName}`)
      .set('MonthWise', `${filter.monthWise}`)
      .set('ShowInvoiceNo', `${filter.showInvoiceNo}`)
      .set('ShowInvoiceDate', `${filter.showInvoiceDate}`)
      .set('ShowQuantity', `${filter.showQuantity}`)
      .set('ShowAmount', `${filter.showAmount}`)
      .set('ShowDiscountAmount', `${filter.showDiscountAmount}`)
      .set('ShowTaxableAmount', `${filter.showTaxableAmount}`)
      .set('ShowTaxAmount', `${filter.showTaxAmount}`)
      .set('ShowGrossAmount', `${filter.showGrossAmount}`)
      .set('ShowSchemeAmount', `${filter.showSchemeAmount}`)
      .set('ShowNetAmount', `${filter.showNetAmount}`)
      .set('SortFirst', `${filter.sortFirst}`)
      .set('SortSecond', `${filter.sortSecond}`)
      .set('SortThird', `${filter.sortThird}`)
      .set('SortFourth', `${filter.sortFourth}`)
      .set('SortFifth', `${filter.sortFifth}`)
      .set('SortSixth', `${filter.sortSixth}`);

    if (
      filter.selectedBookAccountID != null &&
      filter.selectedBookAccountID.length > 0
    ) {
      filter.selectedBookAccountID.forEach((element) => {
        params = params.append('SelectedBookAccountID', element);
      });
    }

    if (filter.selectedFirstID != null && filter.selectedFirstID.length > 0) {
      filter.selectedFirstID.forEach((element) => {
        params = params.append('SelectedFirstID', element);
      });
    }

    if (filter.selectedSecondID != null && filter.selectedSecondID.length > 0) {
      filter.selectedSecondID.forEach((element) => {
        params = params.append('SelectedSecondID', element);
      });
    }

    if (filter.selectedThirdID != null && filter.selectedThirdID.length > 0) {
      filter.selectedThirdID.forEach((element) => {
        params = params.append('SelectedThirdID', element);
      });
    }

    if (filter.selectedFourthID != null && filter.selectedFourthID.length > 0) {
      filter.selectedFourthID.forEach((element) => {
        params = params.append('SelectedFourthID', element);
      });
    }

    if (filter.selectedFifthID != null && filter.selectedFifthID.length > 0) {
      filter.selectedFifthID.forEach((element) => {
        params = params.append('SelectedFifthID', element);
      });
    }

    if (filter.selectedSixthID != null && filter.selectedSixthID.length > 0) {
      filter.selectedSixthID.forEach((element) => {
        params = params.append('SelectedSixthID', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetIncentiveAccountData(
    filter: IncentiveReportFilter
  ): Observable<accountsIncentiveDropDown[]> {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/incentive/accounts`;
    let params = new HttpParams()
      .set('ReportType', `${filter.reportType}`)
      .set('ManufactureID', `${filter.manufactureID}`)
      .set('AreaID', `${filter.areaID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`);

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

  GetIncentiveReport(filter: IncentiveReportFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/incentive`;
    let params = new HttpParams()
      .set('ReportType', `${filter.reportType}`)
      .set('ManufactureID', `${filter.manufactureID}`)
      .set('AreaID', `${filter.areaID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`);

    if (
      filter.SelectedAccountID != null &&
      filter.SelectedAccountID.length > 0
    ) {
      filter.SelectedAccountID.forEach((element) => {
        params = params.append('SelectedAccountID', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  GetDailyCollectionReport(filter: DailyCollectionReportFilter) {
    this.CompanyID = this.storage.get('companyID');
    this.UserID = this.storage.get('userID');
    const url = `${this.APIURL}/company/${this.CompanyID}/reports/other/dailycollection`;
    let params = new HttpParams()
      .set('ReportType', `${filter.reportType}`)
      .set('transactionTypeID', `${filter.transactionTypeID}`)
      .set('returnTypeID', `${filter.returnTypeID}`)
      .set('FromDate', `${filter.fromDate}`)
      .set('ToDate', `${filter.toDate}`);

    if (
      filter.selectedBookAccountID != null &&
      filter.selectedBookAccountID.length > 0
    ) {
      filter.selectedBookAccountID.forEach((element) => {
        params = params.append('SelectedBookAccountID', element);
      });
    }

    if (
      filter.selectedAccountID != null &&
      filter.selectedAccountID.length > 0
    ) {
      filter.selectedAccountID.forEach((element) => {
        params = params.append('SelectedAccountID', element);
      });
    }

    return this.http
      .get(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
