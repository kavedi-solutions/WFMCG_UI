import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';
import {
  AccountLedgerFilter,
  accountsDropDownResponse,
  groupDownDownResponse,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerDialogComponent } from 'src/app/theme';
import { debounceTime, map, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-account-ledger',
  templateUrl: './account-ledger.component.html',
  styleUrls: ['./account-ledger.component.scss'],
})
export class AccountLedgerComponent implements OnInit {
  PageTitle: string = 'Sales Register';
  columns: MtxGridColumn[] = [];
  accountsData: accountsDropDownResponse[] = [];
  filteraccountsData: accountsDropDownResponse[] = [];
  selectedeAccountsData: accountsDropDownResponse[] = [];
  groupDropDown: groupDownDownResponse[] = [];
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  SearchAccounts: Subject<any> = new Subject();
  AccountName: string = '';

  registerForm = this.fb.group({
    GroupID: ['0'],
    AccountName: [''],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    OutputType: ['L'],
  });

  constructor(
    private fb: FormBuilder,
    private sessionService: fromService.LocalStorageService,
    private accountService: fromService.AccountsService,
    private financialService: fromService.FinancialService,
    private groupService: fromService.GroupService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.columns = defaultData.GetFinancialColumns();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillGroupDropDown();
    this.FillBooksDropDown(0);
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

  rowSelectionChange(event: any) {
    this.selectedeAccountsData = event;
  }

  FillGroupDropDown() {
    this.groupDropDown = [];
    this.groupService.GroupDropDown().subscribe((response) => {
      this.groupDropDown = response;
    });
  }

  groupSelectionChange(event: any) {
    this.FillBooksDropDown(event);
  }

  FillBooksDropDown(GroupID: number) {
    let groupids: number[] = [];
    if (GroupID != 0) {
      groupids.push(GroupID);
    }
    let filters = {
      GroupID: groupids,
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

  GenerateReport() {
    let accountsId: number[] = [];
    this.selectedeAccountsData.forEach((element) => {
      accountsId.push(parseInt(element.account_Id));
    });

    let filter: AccountLedgerFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      outputType: this.OutputTypeControl.value,
      accountsIds: accountsId,
    };

    this.financialService.PrintAccountLedger(filter).subscribe((response) => {
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

  onAccountNameKeyUp($event: any) {
    this.AccountName = $event.target.value.trim();
    this.SearchAccounts.next(this.AccountName);
  }

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsData.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
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

  get GroupIDControl() {
    return this.registerForm.get('GroupID') as FormControl;
  }

  get AccountNameControl() {
    return this.registerForm.get('AccountName') as FormControl;
  }
}
