import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { debounceTime, Subject } from 'rxjs';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import {
  accountsIncentiveDropDown,
  areaDownDownResponse,
  IncentiveReportFilter,
  ManufactureDownDownResponse,
} from '../../../../shared/index';
import { PdfViewerDialogComponent } from 'src/app/theme';

@Component({
  selector: 'app-incentive-report',
  templateUrl: './incentive-report.component.html',
  styleUrls: ['./incentive-report.component.scss'],
})
export class IncentiveReportComponent implements OnInit {
  PageTitle: string = 'Incentive Report';
  columns: MtxGridColumn[] = [];

  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  AccountName: string = '';
  SearchAccounts: Subject<any> = new Subject();

  manufactureDropDown: ManufactureDownDownResponse[] = [];
  areaDropDown: areaDownDownResponse[] = [];
  SelectedValue: number[] = [];

  accountsData: accountsIncentiveDropDown[] = [];
  filteraccountsData: accountsIncentiveDropDown[] = [];
  selectedAccountsData: accountsIncentiveDropDown[] = [];

  incentiveForm = this.fb.group({
    ReportType: ['S'],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    ManufactureID: ['', [Validators.required]],
    AreaID: ['0'],
    AccountName: [''],
  });

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private sessionService: fromService.LocalStorageService,
    private manufactureService: fromService.ManufactureService,
    private areaService: fromService.AreaService,
    private reportService: fromService.OthersReportService
  ) {
    this.columns = defaultData.GetIncentiveAccountColumns();
    this.areaDropDown = [];
    this.manufactureDropDown = [];
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillManufacture();
    this.FillAreaDropDown();
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
    //this.FillBillDropDown(Number(this.BookAccountIDControl.value));
  }

  ToDateChange() {
    let ToDate = this.ToDateControl.value.format('YYYY-MM-DD');
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.FromMaxDate = ToDate;
    //this.FillBillDropDown(Number(this.BookAccountIDControl.value));
    if (FromDate > ToDate) this.FromDateControl.setValue(moment(ToDate));
  }

  FillManufacture() {
    this.manufactureService.ManufactureDropDown().subscribe((response) => {
      this.manufactureDropDown = response;
    });
  }

  FillAreaDropDown() {
    this.areaDropDown = [];
    this.areaService.AreaDropDown().subscribe((response) => {
      this.areaDropDown = response;
    });
  }

  onAccountNameKeyUp($event: any) {
    this.AccountName = $event.target.value.trim();
    this.SearchAccounts.next(this.AccountName);
  }

  ManufactureChange(event: any) {
    this.FillAccounts();
  }

  AreaChange(event: any) {
    this.FillAccounts();
  }

  FillAccounts() {
    let filters: IncentiveReportFilter = {
      reportType: this.ReportTypeControl.value,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      manufactureID: this.manufactureIDControl.value,
      areaID: this.areaIDControl.value,
    };

    this.reportService
      .GetIncentiveAccountData(filters)
      .subscribe((response) => {
        this.accountsData = response;
        this.filteraccountsData = response;
      });
  }

  private _filterAccount(name: string): accountsIncentiveDropDown[] {
    const filterValue = name.toLowerCase();

    return this.accountsData.filter((option) =>
      option.accountName.toLowerCase().includes(filterValue)
    );
  }

  rowSelectionChange(event: any) {
    this.selectedAccountsData = event;
  }

  GenerateReport() {
    this.selectedAccountsData.forEach((element) => {
      this.SelectedValue.push(Number(element.accountID));
    });

    let filters: IncentiveReportFilter = {
      reportType: this.ReportTypeControl.value,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      manufactureID: this.manufactureIDControl.value,
      areaID: this.areaIDControl.value,
      SelectedAccountID: this.SelectedValue,
    };

    this.reportService.GetIncentiveReport(filters).subscribe((response) => {
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

  get ReportTypeControl() {
    return this.incentiveForm.get('ReportType') as FormControl;
  }

  get FromDateControl() {
    return this.incentiveForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.incentiveForm.get('ToDate') as FormControl;
  }

  get areaIDControl() {
    return this.incentiveForm.get('AreaID') as FormControl;
  }

  get manufactureIDControl() {
    return this.incentiveForm.get('ManufactureID') as FormControl;
  }

  get manufactureIDControlRequired() {
    return (
      this.manufactureIDControl.hasError('required') &&
      this.manufactureIDControl.touched
    );
  }
}
