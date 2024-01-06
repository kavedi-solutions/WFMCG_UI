import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  BulkPrintFilter,
  BulkPrintResponse,
  CompanySettingResponse,
  TransactionTypeMaster,
  transactionTypeResponse,
  VoucherPrintFilter,
  VoucherPrintResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PdfViewerDialogComponent } from 'src/app/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-voucher-print',
  templateUrl: './voucher-print.component.html',
  styleUrls: ['./voucher-print.component.scss'],
})
export class VoucherPrintComponent implements OnInit {
  PageTitle: string = 'Voucher Print';
  bulkPrintData: VoucherPrintResponse[] = [];
  selectedBulkPrintData: VoucherPrintResponse[] = [];
  columns: MtxGridColumn[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  bulkPrintForm = this.fb.group({
    VoucherType: ['', [Validators.required]],
    BookAccountID: ['', [Validators.required]],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    NoOfCopy: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.max(9),
        Validators.pattern('^([0-9()/+ -]*)$'),
      ],
    ],
  });

  constructor(
    private reportService: fromService.OthersReportService,
    private commonService: fromService.CommonService,
    private accountService: fromService.AccountsService,
    private settingsService: fromService.CompanySettingsService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.columns = defaultData.GetVoucherPrintColumn();
    this.GetCompanySettings();
    this.FillBooksDropDown();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
  }

  ngOnInit(): void {}

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

  GetCompanySettings() {
    this.settingsService
      .GetCompanySettingsbyID()
      .subscribe((response: CompanySettingResponse) => {
        this.NoOfCopyControl.setValue(response.invoiceCopy);
      });
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [
        TransactionTypeMaster.Bank,
        TransactionTypeMaster.Cash,
      ],
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
    let filters: VoucherPrintFilter = {
      voucherType: this.VoucherTypeControl.value,
      bookAccountID: this.BookAccountIDControl.value,
      FromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      ToDate: this.ToDateControl.value.format('YYYY-MM-DD'),
    };
    this.reportService.GetVoucherPrintData(filters).subscribe((response) => {
      this.bulkPrintData = response;
    });
  }

  PrintVoucher() {
    let InvoiceIDs: number[] = [];
    let NoofCopy = Number(this.NoOfCopyControl.value);
    let VoucherType = this.VoucherTypeControl.value;

    this.selectedBulkPrintData.forEach((element) => {
      InvoiceIDs.push(element.autoID);
    });

    this.reportService
      .PrintVouchers(VoucherType, NoofCopy, InvoiceIDs)
      .subscribe((response) => {
        var file = new Blob([response as Blob], {
          type: 'application/pdf',
        });
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

  rowSelectionChange(event: any) {
    this.selectedBulkPrintData = event;
  }

  get BookAccountIDControl() {
    return this.bulkPrintForm.get('BookAccountID') as FormControl;
  }

  get FromDateControl() {
    return this.bulkPrintForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.bulkPrintForm.get('ToDate') as FormControl;
  }

  get VoucherTypeControl() {
    return this.bulkPrintForm.get('VoucherType') as FormControl;
  }

  get VoucherTypeControlRequired() {
    return (
      this.VoucherTypeControl.hasError('required') &&
      this.VoucherTypeControl.touched
    );
  }

  get NoOfCopyControl() {
    return this.bulkPrintForm.get('NoOfCopy') as FormControl;
  }

  get NoOfCopyControlRequired() {
    return (
      this.NoOfCopyControl.hasError('required') && this.NoOfCopyControl.touched
    );
  }

  get NoOfCopyControlInvalid() {
    return (
      this.NoOfCopyControl.hasError('pattern') && this.NoOfCopyControl.touched
    );
  }
  get NoOfCopyControlMinValue() {
    return this.NoOfCopyControl.hasError('min') && this.NoOfCopyControl.touched;
  }
  get NoOfCopyControlMaxValue() {
    return this.NoOfCopyControl.hasError('max') && this.NoOfCopyControl.touched;
  }
}
