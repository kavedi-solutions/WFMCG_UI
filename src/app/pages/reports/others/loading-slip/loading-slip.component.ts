import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgModel,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  HeadFiltersDetail,
  LoadingSlipInvoiceFilter,
  LodingSlipFilter,
} from 'src/app/shared';
import { PdfViewerDialogComponent } from 'src/app/theme';
import * as defaultData from '../../../../data/index';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-loading-slip',
  templateUrl: './loading-slip.component.html',
  styleUrls: ['./loading-slip.component.scss'],
})
export class LoadingSlipComponent implements OnInit {
  PageTitle: string = 'Loading Slip';
  columns: MtxGridColumn[] = [];

  booksDropDown: accountsDropDownResponse[] = [];
  selectedData: HeadFiltersDetail[] = [];
  headerFilterData: HeadFiltersDetail[] = [];
  billDropDown: number[] = [];
  SelectedFromBill: number = 0;
  SelectedToBill: number = 0;
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  ItemCount: number = 0;

  loadingSlipForm = this.fb.group({    
    BookAccountID: ['', [Validators.required]],
    PrintInvoice: [false],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    FromNo: ['', [Validators.required]],
    ToNo: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private accountService: fromService.AccountsService,
    private reportService: fromService.OthersReportService
  ) {
    this.setColumns();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillBooksDropDown();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetLoadingSlipColumn();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 60,
      width: '60px',
      pinned: 'right',
      type: 'button',
      class: '',
      buttons: [
        {
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete Record',
          buttontype: 'button',
          pop: {
            title: 'Confirm Delete',
            description: 'Are you sure you want to Delete this Item.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.deleteItem(record),
        },
      ],
    });
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

  FromDateChange() {
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.ToMinDate = FromDate;
    this.FillBillDropDown(Number(this.BookAccountIDControl.value));
  }

  ToDateChange() {
    let ToDate = this.ToDateControl.value.format('YYYY-MM-DD');
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.FromMaxDate = ToDate;
    this.FillBillDropDown(Number(this.BookAccountIDControl.value));
    if (FromDate > ToDate) this.FromDateControl.setValue(moment(ToDate));
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [21],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  BookAccountIDSelectionChange(event: any) {
    this.FillBillDropDown(Number(event));
  }

  FillBillDropDown(BookAccountID: Number) {
    let filters: LoadingSlipInvoiceFilter = {
      bookAccountID: BookAccountID,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
    };

    this.reportService.GetinvoiceidsData(filters).subscribe((response) => {
      this.billDropDown = response;
      this.FromNoControl.setValue(this.billDropDown[0]);
      this.ToNoControl.setValue(
        this.billDropDown[this.billDropDown.length - 1]
      );
    });
  }

  AddtoList() {
    let ItemIndex = this.selectedData.findIndex(
      (a) => a.bookAccountID == this.BookAccountIDControl.value
    );
    if (ItemIndex != -1) {
      this.selectedData.splice(ItemIndex, 1);
    }
    this.selectedData.push({
      bookAccountID: this.BookAccountIDControl.value,
      bookAccountName: this.booksDropDown.find(
        (a) => a.account_Id == this.BookAccountIDControl.value
      )?.account_Name!,
      fromBillNo: this.FromNoControl.value,
      toBillNo: this.ToNoControl.value,
    });

    this.headerFilterData = [...this.selectedData];

    this.ItemCount = this.headerFilterData.length;

    this.BookAccountIDControl.setValue('');
    this.BookAccountIDControl.setErrors(null);
    this.FromNoControl.setValue('');
    this.FromNoControl.setErrors(null);
    this.ToNoControl.setValue('');
    this.ToNoControl.setErrors(null);
  }

  deleteItem(record: HeadFiltersDetail) {
    let ItemIndex = this.selectedData.findIndex(
      (a) => a.bookAccountID == record.bookAccountID
    );
    this.selectedData.splice(ItemIndex, 1);
    this.headerFilterData = [...this.selectedData];

    this.ItemCount = this.headerFilterData.length;
  }

  GenerateLoadingSlip() {
    let filter: LodingSlipFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      printInvoiceList: this.PrintInvoiceControl.value,
      headFilter: this.headerFilterData,
    };
    this.reportService.PrintLoadingSlip(filter).subscribe((response) => {
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

  ClearForm(form: FormGroup) {
    let control: AbstractControl;
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.selectedData = [];
    this.headerFilterData = [...this.selectedData];
  }

  get FromDateControl() {
    return this.loadingSlipForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.loadingSlipForm.get('ToDate') as FormControl;
  }

  get BookAccountIDControl() {
    return this.loadingSlipForm.get('BookAccountID') as FormControl;
  }

  get FromNoControl() {
    return this.loadingSlipForm.get('FromNo') as FormControl;
  }

  get ToNoControl() {
    return this.loadingSlipForm.get('ToNo') as FormControl;
  }

  get PrintInvoiceControl() {
    return this.loadingSlipForm.get('PrintInvoice') as FormControl;
  }
}
