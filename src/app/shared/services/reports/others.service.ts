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
    this.APIURL =
      this.appconfig.GetCoreAPIURL() +
      `api/v${this.version}/company/${this.CompanyID}/reports/other`;
  }

  GetBulkPrintData(filter: BulkPrintFilter): Observable<BulkPrintResponse[]> {
    const url = `${this.APIURL}/bulkprint/get`;
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
    const url = `${this.APIURL}/invoice/inventory`;
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
    const url = `${this.APIURL}/invoice/service`;
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
    const url = `${this.APIURL}/invoice/assets`;
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
    const url = `${this.APIURL}/invoice/salesreturn`;
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
    const url = `${this.APIURL}/invoice/purchasereturn`;
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
    const url = `${this.APIURL}/invoice/creditnote`;
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
    const url = `${this.APIURL}/invoice/debitnote`;
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
    const url = `${this.APIURL}/invoiceids/get`;
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
    const url = `${this.APIURL}/loadingslip`;
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
    const url = `${this.APIURL}/voucher/get`;
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
    const url = `${this.APIURL}/voucher/print`;
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
    const url = `${this.APIURL}/jvoucher/print`;
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
    const url = `${this.APIURL}/salepurchasereport`;
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
    const url = `${this.APIURL}/exportsalepurchasereport`;
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
    const url = `${this.APIURL}/incentive/accounts`;
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
    const url = `${this.APIURL}/incentive`;
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
    const url = `${this.APIURL}/dailycollection`;
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
