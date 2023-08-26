import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  PurchaseRegisterFilter,
  TransactionTypeMaster,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerDialogComponent } from 'src/app/theme';

@Component({
  selector: 'app-purchase-register',
  templateUrl: './purchase-register.component.html',
  styleUrls: ['./purchase-register.component.scss'],
})
export class PurchaseRegisterComponent implements OnInit {
  PageTitle: string = 'Purchase Register';
  columns: MtxGridColumn[] = [];
  accountsData: accountsDropDownResponse[] = [];
  selectedeAccountsData: accountsDropDownResponse[] = [];
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  registerForm = this.fb.group({
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    OutputType: ['S'],
    MonthWiseSummary: [false],
    ItemWiseSummary: [false],
  });

  constructor(
    private fb: FormBuilder,
    private sessionService: fromService.LocalStorageService,
    private accountService: fromService.AccountsService,
    private financialService: fromService.FinancialService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.columns = defaultData.GetFinancialColumns();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillBooksDropDown();
  }

  ngOnInit(): void {}

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

  rowSelectionChange(event: any) {
    this.selectedeAccountsData = event;
  }

  ChangeOutputType() {
    this.MonthWiseSummaryControl.setValue(false);
    this.ItemWiseSummaryControl.setValue(false);
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [
        TransactionTypeMaster.Purchase_Inventory,
        TransactionTypeMaster.Purchase_Assets,
        TransactionTypeMaster.Purchase_Service,
      ],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsData = response;
    });
  }

  GenerateReport() {
    let accountsId: number[] = [];
    this.selectedeAccountsData.forEach((element) => {
      accountsId.push(parseInt(element.account_Id));
    });

    let filter: PurchaseRegisterFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      outputType: this.OutputTypeControl.value,
      monthWiseSummary: this.MonthWiseSummaryControl.value,
      itemWiseSummary: this.ItemWiseSummaryControl.value,
      accountsIds: accountsId,
    };

    this.financialService
      .PrintPurchaseRegister(filter)
      .subscribe((response) => {
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

  get FromDateControl() {
    return this.registerForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.registerForm.get('ToDate') as FormControl;
  }

  get OutputTypeControl() {
    return this.registerForm.get('OutputType') as FormControl;
  }

  get MonthWiseSummaryControl() {
    return this.registerForm.get('MonthWiseSummary') as FormControl;
  }

  get ItemWiseSummaryControl() {
    return this.registerForm.get('ItemWiseSummary') as FormControl;
  }
}
