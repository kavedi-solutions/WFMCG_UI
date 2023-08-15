import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  eInvoiceFilter,
  eInvoiceResponse,
  e_InvoiceRequest,
  e_InvoiceRequestDetails,
  e_invoice_api_balance_response,
  transactionTypeResponse,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import * as moment from 'moment';

@Component({
  selector: 'app-get-einvoice-errors',
  templateUrl: './get-einvoice-errors.component.html',
  styleUrls: ['./get-einvoice-errors.component.scss'],
})
export class GetEInvoiceErrorsComponent implements OnInit {
  PageTitle: string = 'Get e Invoice Errors';
  eInvoiceAPIBalance?: e_invoice_api_balance_response;
  eInvoiceData: eInvoiceResponse[] = [];
  columns: MtxGridColumn[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  ErrorDetails: string = '';

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
    this.columns = defaultData.GeteInvoiceErrorColumn();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 60,
      width: '60px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'remove_red_eye',
          tooltip: 'view error',
          buttontype: 'button',
          click: (record) => this.ViewError(record),
        },
      ],
    });
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
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      eistatus: true,
    };
    this.eInvoiceService.GeteInvoiceErrorData(filters).subscribe((response) => {
      debugger;
      this.eInvoiceData = response;
    });
  }

  ViewError(record: eInvoiceResponse) {
    this.ErrorDetails = record.eiErrorDetails;
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
