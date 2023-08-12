import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  eInvoiceFilter,
  eInvoiceResponse,
  e_invoice_api_balance_response,
  transactionTypeResponse,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import * as moment from 'moment';

@Component({
  selector: 'app-generate-einvoice',
  templateUrl: './generate-einvoice.component.html',
  styleUrls: ['./generate-einvoice.component.scss'],
})
export class GenerateEInvoiceComponent implements OnInit {
  PageTitle: string = 'Generate e Invoice';
  eInvoiceAPIBalance?: e_invoice_api_balance_response;
  eInvoiceData: eInvoiceResponse[] = [];
  selectedeInvoiceData: eInvoiceResponse[] = [];
  columns: MtxGridColumn[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  apiBalance: number = 0;
  apiExpDate?: string;
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  eInvoiceForm = this.fb.group({
    TransactionTypeID: ['', [Validators.required]],
    BookAccountID: ['', [Validators.required]],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
  });

  constructor(
    private commonService: fromService.CommonService,
    private accountService: fromService.AccountsService,
    private eInvoiceService: fromService.EInvoiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.columns = defaultData.GeteInvoiceColumn();
    this.geteInvoiceAPIBalance();
    this.FillTransactionType();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
  }

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    this.FromMinDate = new Date(currentYear - 20, 0, 1);
    this.FromMaxDate = new Date();
    this.FromDateControl.setValue(moment(new Date()));
  }

  SetMinMaxToDate() {
    const currentYear = new Date().getFullYear();
    this.ToMinDate = new Date(currentYear - 20, 0, 1);
    this.ToMaxDate = new Date();
    this.ToDateControl.setValue(moment(new Date()));
  }

  FillTransactionType() {
    this.transactionTypeDropDown = [];
    this.commonService
      .TransactionTypeDropDown()
      .subscribe((response: transactionTypeResponse[]) => {
        this.transactionTypeDropDown = response.filter(
          (a) => a.alloweInvoice == true
        );
      });
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

  TransactionTypeIDSelectionChange(event: any) {
    this.FillBooksDropDown(Number(event));
  }

  rowSelectionChange(event: any) {
    this.selectedeInvoiceData = event;
  }

  geteInvoiceAPIBalance() {
    this.apiBalance = 0;
    this.eInvoiceService.GetAPIBalance().subscribe((response) => {
      this.eInvoiceAPIBalance = response;
      debugger;
      if (this.eInvoiceAPIBalance?.status) {
        this.apiBalance = this.eInvoiceAPIBalance.success.ewbApiBal;
        this.apiExpDate = moment(this.eInvoiceAPIBalance.success.ewbApiBalExpDt).format("DD-MMM-YYYY");
        //2023-10-01T16:33:56
      }
    });
  }

  FillBooksDropDown(TransactionTypeID: number) {
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

  GetList() {
    let filters: eInvoiceFilter = {
      transactionTypeID: this.TransactionTypeIDControl.value,
      bookAccountID: this.BookAccountIDControl.value,
      FromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      ToDate: this.ToDateControl.value.format('YYYY-MM-DD'),
    };
    this.eInvoiceService.GeteInvoiceData(filters).subscribe((response) => {
      this.eInvoiceData = response;
    });
  }

  Generate_eInvoice() {
    // let InvoiceIDs: number[] = [];
    // let NoofCopy = Number(this.NoOfCopyControl.value);
    // this.selectedBulkPrintData.forEach((element) => {
    //   InvoiceIDs.push(element.autoID);
    // });
    // this.reportService
    //   .PrintInvoiceInventory(NoofCopy, InvoiceIDs)
    //   .subscribe((response) => {
    //     var file = new Blob([response as Blob], { type: 'application/pdf' });
    //     var fileURL = URL.createObjectURL(file);
    //     this.dialog.open(PdfViewerDialogComponent, {
    //       data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
    //       minWidth: '80vw',
    //       minHeight: '90vh',
    //       maxWidth: '80vw',
    //       maxHeight: '90vh',
    //       panelClass: 'dialog-container',
    //       autoFocus: true,
    //     });
    //   });
  }

  get BookAccountIDControl() {
    return this.eInvoiceForm.get('BookAccountID') as FormControl;
  }

  get FromDateControl() {
    return this.eInvoiceForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.eInvoiceForm.get('ToDate') as FormControl;
  }

  get TransactionTypeIDControl() {
    return this.eInvoiceForm.get('TransactionTypeID') as FormControl;
  }

  get TransactionTypeIDControlRequired() {
    return (
      this.TransactionTypeIDControl.hasError('required') &&
      this.TransactionTypeIDControl.touched
    );
  }
}
