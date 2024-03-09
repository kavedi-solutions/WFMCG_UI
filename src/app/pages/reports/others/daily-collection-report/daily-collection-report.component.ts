import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import * as fromService from '../../../../shared';
import * as defaultData from '../../../../data';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  DailyCollectionReportFilter,
  returnTypeResponse,
  transactionTypeResponse,
} from '../../../../shared';
import { PdfViewerDialogComponent } from 'src/app/theme';

@Component({
  selector: 'app-daily-collection-report',
  templateUrl: './daily-collection-report.component.html',
  styleUrls: ['./daily-collection-report.component.scss'],
})
export class DailyCollectionReportComponent implements OnInit {
  PageTitle: string = 'Daily Collection Report';
  columns: MtxGridColumn[] = [];

  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  SelectedBookAccountID: number[] = [];
  SelectedAccountID: number[] = [];
  ShowReturnType: boolean = true;

  booksDropDown: accountsDropDownResponse[] = [];
  booksselectedAccountsData: accountsDropDownResponse[] = [];

  accountsData: accountsDropDownResponse[] = [];
  filteraccountsData: accountsDropDownResponse[] = [];
  selectedeAccountsData: accountsDropDownResponse[] = [];

  transactionTypeDropDown: transactionTypeResponse[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];

  AccountName: string = '';
  SearchAccounts: Subject<any> = new Subject();

  collectionForm = this.fb.group({
    TransactionTypeID: ['21', [Validators.required]],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    ReturnTypeID: ['1'],
    ReportType: ['S'],
    AccountName: [''],
  });

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private sessionService: fromService.LocalStorageService,
    private commonService: fromService.CommonService,
    private reportService: fromService.OthersReportService,
    private accountService: fromService.AccountsService
  ) {
    this.columns = defaultData.GetFinancialColumns();
    this.FillTransactionType();
    this.FillReturnTypeDropDown();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillBooks(21);
    this.FillAccounts();
  }

  ngOnInit(): void {
    this.SearchAccounts.pipe(debounceTime(300)).subscribe(() => {
      this.filteraccountsData = this._filterAccount(this.AccountName);
    });
  }

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    this.FromMinDate = new Date(currentYear - 20, 0, 1);
    this.FromMaxDate = new Date();
    this.FromDateControl.setValue(
      moment(
        GetFinYearStartDate(
          new Date(),
          Number(this.sessionService.get('FinYearStartMonth'))
        )
      )
    );
  }

  SetMinMaxToDate() {
    const currentYear = new Date().getFullYear();
    this.ToMinDate = new Date(currentYear - 20, 0, 1);
    this.ToMaxDate = new Date();
    this.ToDateControl.setValue(moment(new Date()));
  }

  FromDateChange() {
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.ToMinDate = FromDate;
  }

  ToDateChange() {
    let ToDate = this.ToDateControl.value.format('YYYY-MM-DD');
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.FromMaxDate = ToDate;
    if (FromDate > ToDate) this.FromDateControl.setValue(moment(ToDate));
  }

  FillTransactionType() {
    this.transactionTypeDropDown = [];
    this.commonService
      .TransactionTypeDropDown()
      .subscribe((response: transactionTypeResponse[]) => {
        this.transactionTypeDropDown = response.filter(
          (a) => a.allowSPReport == true
        );
      });
  }

  FillReturnTypeDropDown() {
    this.returnTypeDropDown = [];
    this.commonService
      .ReutnTypeDropDown()
      .subscribe((response: returnTypeResponse[]) => {
        this.returnTypeDropDown = response;
      });
  }

  onAccountNameKeyUp($event: any) {
    this.AccountName = $event.target.value.trim();
    this.SearchAccounts.next(this.AccountName);
  }

  TransactionTypeSelectionChange(event: any) {
    this.ShowReturnType = false;
    switch (event) {
      case '11':
      case '21':
      case '12':
      case '13':
      case '22':
      case '23':
        this.ShowReturnType = true;
        break;
      case '31':
      case '32':
        break;
      case '33':
      case '34':
        this.ShowReturnType = true;
        break;
    }
    this.FillBooks(Number(event));
  }

  FillBooks(TransactionTypeID: number) {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [TransactionTypeID],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  bookrowSelectionChange(event: any) {
    this.booksselectedAccountsData = event;
  }

  accountRowSelectionChange(event: any) {
    this.selectedeAccountsData = event;
  }

  FillAccounts() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsData = response;
      this.filteraccountsData = response;
    });
  }

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsData.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }

  GenerateReport() {
    this.SelectedBookAccountID = [];
    this.SelectedAccountID = [];
    this.booksselectedAccountsData.forEach((element) => {
      this.SelectedBookAccountID.push(Number(element.account_Id));
    });

    this.selectedeAccountsData.forEach((element) => {
      this.SelectedAccountID.push(Number(element.account_Id));
    });

    let filters: DailyCollectionReportFilter = {
      reportType: this.ReportTypeControl.value,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      transactionTypeID: this.TransactionTypeIDControl.value,
      returnTypeID: this.ReturnTypeIDControl.value,
      selectedBookAccountID: this.SelectedBookAccountID,
      selectedAccountID: this.SelectedAccountID,
    };

    this.reportService
      .GetDailyCollectionReport(filters)
      .subscribe((response) => {
        debugger;
        var file = new Blob([response as Blob], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        this.dialog.open(PdfViewerDialogComponent, {
          data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
          minWidth: '80vw',
          minHeight: '90vh',
          maxWidth: '80vw',
          maxHeight: '90vh',
          panelClass: 'dialog-container',
          autoFocus: true,
        });
      });
  }

  //Controls
  get ReportTypeControl() {
    return this.collectionForm.get('ReportType') as FormControl;
  }

  get FromDateControl() {
    return this.collectionForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.collectionForm.get('ToDate') as FormControl;
  }

  get TransactionTypeIDControl() {
    return this.collectionForm.get('TransactionTypeID') as FormControl;
  }

  get TransactionTypeIDControlRequired() {
    return (
      this.TransactionTypeIDControl.hasError('required') &&
      this.TransactionTypeIDControl.touched
    );
  }

  get ReturnTypeIDControl() {
    return this.collectionForm.get('ReturnTypeID') as FormControl;
  }
}
