import { Component, OnInit } from '@angular/core';
import * as fromService from '../../../../shared/index';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import {
  FilterList,
  returnTypeResponse,
  SalesPurchaseReportFilter,
  SalesPurchaseReportResponse,
  transactionTypeResponse,
} from '../../../../shared/index';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import { MatDialog } from '@angular/material/dialog';
import { SPReportSelectionsComponent } from 'src/app/pages/dialogs';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-sales-purchase-report',
  templateUrl: './sales-purchase-report.component.html',
  styleUrls: ['./sales-purchase-report.component.scss'],
})
export class SalesPurchaseReportComponent implements OnInit {
  PageTitle: string = 'Sales Purchase Report';
  dialogRef: any;
  columns: MtxGridColumn[] = [];
  DataResponse: SalesPurchaseReportResponse[] = [];
  FilterList: FilterList[] = [];
  FilterList1: FilterList[] = [];
  FilterList2: FilterList[] = [];
  FilterList3: FilterList[] = [];
  FilterList4: FilterList[] = [];
  FilterList5: FilterList[] = [];
  FilterList6: FilterList[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  SelectedBookAccountID: number[] = [];
  SelectedFirstID: number[] = [];
  SelectedSecondID: number[] = [];
  SelectedThirdID: number[] = [];
  SelectedFourthID: number[] = [];
  SelectedFifthID: number[] = [];
  SelectedSixthID: number[] = [];

  SelectedFirstName: string = '';
  SelectedSecondName: string = '';
  SelectedThirdName: string = '';
  SelectedFourthName: string = '';
  SelectedFifthName: string = '';
  SelectedSixthName: string = '';

  ShowQty: boolean = true;
  ShowDiscountAmount: boolean = false;
  ShowTaxableAmount: boolean = false;
  ShowGrossAmount: boolean = false;
  ShowSchemeAmount: boolean = false;
  ShowReturnType: boolean = true;

  SalesPurchaseReportForm = this.fb.group({
    TransactionTypeID: ['21', [Validators.required]],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    SelectedFirstName: ['None'],
    SelectedSecondName: ['None'],
    SelectedThirdName: ['None'],
    SelectedFourthName: ['None'],
    SelectedFifthName: ['None'],
    SelectedSixthName: ['None'],
    ReturnTypeID: ['1'],
    MonthWise: [false],
    ShowInvoiceNo: [false],
    ShowInvoiceDate: [false],
    ShowQuantity: [false],
    ShowAmount: [true],
    ShowDiscountAmount: [false],
    ShowTaxableAmount: [false],
    ShowTaxAmount: [true],
    ShowGrossAmount: [false],
    ShowSchemeAmount: [false],
    ShowNetAmount: [true],
  });

  constructor(
    private reportService: fromService.OthersReportService,
    private commonService: fromService.CommonService,
    private sessionService: fromService.LocalStorageService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.FillTransactionType();
    this.FillFilterList();
    this.FillReturnTypeDropDown();
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
  }

  ngOnInit(): void {}

  get TransactionTypeIDControl() {
    return this.SalesPurchaseReportForm.get('TransactionTypeID') as FormControl;
  }

  get TransactionTypeIDControlRequired() {
    return (
      this.TransactionTypeIDControl.hasError('required') &&
      this.TransactionTypeIDControl.touched
    );
  }

  get ReturnTypeIDControl() {
    return this.SalesPurchaseReportForm.get('ReturnTypeID') as FormControl;
  }

  // get ReturnTypeIDControlRequired() {
  //   return (
  //     this.ReturnTypeIDControl.hasError('required') &&
  //     this.ReturnTypeIDControl.touched
  //   );
  // }

  get FromDateControl() {
    return this.SalesPurchaseReportForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.SalesPurchaseReportForm.get('ToDate') as FormControl;
  }

  get SelectedFirstNameControl() {
    return this.SalesPurchaseReportForm.get('SelectedFirstName') as FormControl;
  }

  get SelectedSecondNameControl() {
    return this.SalesPurchaseReportForm.get(
      'SelectedSecondName'
    ) as FormControl;
  }

  get SelectedThirdNameControl() {
    return this.SalesPurchaseReportForm.get('SelectedThirdName') as FormControl;
  }

  get SelectedFourthNameControl() {
    return this.SalesPurchaseReportForm.get(
      'SelectedFourthName'
    ) as FormControl;
  }

  get SelectedFifthNameControl() {
    return this.SalesPurchaseReportForm.get('SelectedFifthName') as FormControl;
  }

  get SelectedSixthNameControl() {
    return this.SalesPurchaseReportForm.get('SelectedSixthName') as FormControl;
  }

  get MonthWiseControl() {
    return this.SalesPurchaseReportForm.get('MonthWise') as FormControl;
  }

  get ShowInvoiceNoControl() {
    return this.SalesPurchaseReportForm.get('ShowInvoiceNo') as FormControl;
  }

  get ShowInvoiceDateControl() {
    return this.SalesPurchaseReportForm.get('ShowInvoiceDate') as FormControl;
  }

  get ShowQuantityControl() {
    return this.SalesPurchaseReportForm.get('ShowQuantity') as FormControl;
  }

  get ShowAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowAmount') as FormControl;
  }

  get ShowDiscountAmountControl() {
    return this.SalesPurchaseReportForm.get(
      'ShowDiscountAmount'
    ) as FormControl;
  }

  get ShowTaxableAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowTaxableAmount') as FormControl;
  }

  get ShowTaxAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowTaxAmount') as FormControl;
  }

  get ShowGrossAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowGrossAmount') as FormControl;
  }

  get ShowSchemeAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowSchemeAmount') as FormControl;
  }

  get ShowNetAmountControl() {
    return this.SalesPurchaseReportForm.get('ShowNetAmount') as FormControl;
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

  FillFilterList() {
    this.FilterList.push(
      {
        SelType: 'None',
        SelName: 'None',
        IsSeleted: false,
      },
      {
        SelType: 'Area',
        SelName: 'Area',
        IsSeleted: false,
      },
      {
        SelType: 'Account',
        SelName: 'Account',
        IsSeleted: false,
      },
      {
        SelType: 'Manufacture',
        SelName: 'Manufacture',
        IsSeleted: false,
      },
      {
        SelType: 'ParentItemGroup',
        SelName: 'Parent Item Group',
        IsSeleted: false,
      },
      {
        SelType: 'ChildItemGroup',
        SelName: 'Child Item Group',
        IsSeleted: false,
      },
      {
        SelType: 'Item',
        SelName: 'Item',
        IsSeleted: false,
      }
    );
    this.FilterList1 = this.FilterList;
    this.FilterList2.push({
      SelType: 'None',
      SelName: 'None',
      IsSeleted: false,
    });
    this.FilterList3.push({
      SelType: 'None',
      SelName: 'None',
      IsSeleted: false,
    });
    this.FilterList4.push({
      SelType: 'None',
      SelName: 'None',
      IsSeleted: false,
    });
    this.FilterList5.push({
      SelType: 'None',
      SelName: 'None',
      IsSeleted: false,
    });
    this.FilterList6.push({
      SelType: 'None',
      SelName: 'None',
      IsSeleted: false,
    });
  }

  SetFilters() {
    this.FilterList1 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedFirstName
    );
    this.FilterList2 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedSecondName
    );
    this.FilterList3 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedThirdName
    );
    this.FilterList4 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedFourthName
    );
    this.FilterList5 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedFifthName
    );
    this.FilterList6 = this.FilterList.filter(
      (x) => x.IsSeleted == false || x.SelType == this.SelectedSixthName
    );

    let ItemIndex = this.FilterList.findIndex(
      (x) => x.IsSeleted == true && x.SelType == 'Item'
    );
    if (ItemIndex != -1) {
      this.ShowQty = false;
    } else {
      this.ShowQty = true;
      this.ShowQuantityControl.setValue(false);
    }
  }

  MonthWiseToggleChange(event: any) {
    if (event.checked == true) {
      this.ShowInvoiceNoControl.setValue(false);
      this.ShowInvoiceDateControl.setValue(false);
    }
  }

  TransactionTypeSelectionChange(event: any) {
    this.ShowDiscountAmount = false;
    this.ShowTaxableAmount = false;
    this.ShowGrossAmount = false;
    this.ShowSchemeAmount = false;
    this.ShowReturnType = false;
    switch (event) {
      case '11':
      case '21':
        this.ShowReturnType = true;
        break;
      case '12':
      case '13':
      case '22':
      case '23':
        this.ShowGrossAmount = true;
        this.ShowSchemeAmount = true;
        this.ShowReturnType = true;
        break;
      case '31':
      case '32':
        this.ShowDiscountAmount = true;
        this.ShowTaxableAmount = true;
        this.ShowGrossAmount = true;
        this.ShowSchemeAmount = true;
        break;
      case '33':
      case '34':
        this.ShowDiscountAmount = true;
        this.ShowTaxableAmount = true;
        this.ShowGrossAmount = true;
        this.ShowSchemeAmount = true;
        this.ShowReturnType = true;
        break;
    }
  }

  SelectedFirstNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedFirstName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedFirstName = '';
      this.SelectedFirstID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedFirstName = event;
    } else {
      this.SelectedSecondNameControl.setValue('None');
      this.SelectedSecondNameSelectionChange('None');
    }
    this.SetFilters();
  }

  SelectedSecondNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedSecondName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedSecondName = '';
      this.SelectedSecondID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedSecondName = event;
    } else {
      this.SelectedThirdNameControl.setValue('None');
      this.SelectedThirdNameSelectionChange('None');
    }
    this.SetFilters();
  }

  SelectedThirdNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedThirdName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedThirdName = '';
      this.SelectedThirdID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedThirdName = event;
    } else {
      this.SelectedFourthNameControl.setValue('None');
      this.SelectedFourthNameSelectionChange('None');
    }
    this.SetFilters();
  }

  SelectedFourthNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedFourthName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedFourthName = '';
      this.SelectedFourthID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedFourthName = event;
    } else {
      this.SelectedFifthNameControl.setValue('None');
      this.SelectedFifthNameSelectionChange('None');
    }
    this.SetFilters();
  }

  SelectedFifthNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedFifthName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedFifthName = '';
      this.SelectedFifthID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedFifthName = event;
    } else {
      this.SelectedSixthNameControl.setValue('None');
      this.SelectedSixthNameSelectionChange('None');
    }
    this.SetFilters();
  }

  SelectedSixthNameSelectionChange(event: any) {
    let index = this.FilterList.findIndex(
      (a) => a.SelType == this.SelectedSixthName
    );
    if (index != -1) {
      this.FilterList[index].IsSeleted = false;
      this.SelectedSixthName = '';
      this.SelectedSixthID = [];
    }
    if (event != 'None') {
      let index = this.FilterList.findIndex((a) => a.SelType == event);
      this.FilterList[index].IsSeleted = true;
      this.SelectedSixthName = event;
    }
    this.SetFilters();
  }

  EnableDisable(Type: string) {
    let ReturnValue: boolean = true;
    switch (Type) {
      case '2':
        if (this.SelectedFirstName != '') {
          ReturnValue = false;
        }
        break;
      case '3':
        if (this.SelectedSecondName != '') {
          ReturnValue = false;
        }
        break;
      case '4':
        if (this.SelectedThirdName != '') {
          ReturnValue = false;
        }
        break;
      case '5':
        if (this.SelectedFourthName != '') {
          ReturnValue = false;
        }
        break;
      case '6':
        if (this.SelectedFifthName != '') {
          ReturnValue = false;
        }
        break;
    }
    return ReturnValue;
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

  OpenDialog(Type: string) {
    let DataFor: string = '';

    switch (Type) {
      case 'Book':
        DataFor = 'Book';
        break;
      case 'First':
        DataFor = this.SelectedFirstName;
        break;
      case 'Second':
        DataFor = this.SelectedSecondName;
        break;
      case 'Third':
        DataFor = this.SelectedThirdName;
        break;
      case 'Fourth':
        DataFor = this.SelectedFourthName;
        break;
      case 'Fifth':
        DataFor = this.SelectedFifthName;
        break;
      case 'Sixth':
        DataFor = this.SelectedSixthName;
        break;
    }

    this.dialogRef = this.dialog.open(SPReportSelectionsComponent, {
      minWidth: '50vw',
      minHeight: '30vh',
      maxWidth: '50vw',
      panelClass: 'dialog-container',
      autoFocus: true,
    });

    this.dialogRef.componentInstance.DialogTitle = 'Select ' + DataFor + '(s)';
    this.dialogRef.componentInstance.DataFor = DataFor;
    this.dialogRef.componentInstance.TransactionType = Number(
      this.TransactionTypeIDControl.value
    );
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result.CloseStatus == true) {
        switch (Type) {
          case 'Book':
            this.SelectedBookAccountID = result.SelectedData;
            break;
          case 'First':
            this.SelectedFirstID = result.SelectedData;
            break;
          case 'Second':
            this.SelectedSecondID = result.SelectedData;
            break;
          case 'Third':
            this.SelectedThirdID = result.SelectedData;
            break;
          case 'Fourth':
            this.SelectedFourthID = result.SelectedData;
            break;
          case 'Fifth':
            this.SelectedFifthID = result.SelectedData;
            break;
          case 'Sixth':
            this.SelectedSixthID = result.SelectedData;
            break;
        }
      }
    });
  }

  GenerateReport() {
    this.CreateGridColumns();
    let filters: SalesPurchaseReportFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      transactionTypeID: this.TransactionTypeIDControl.value,
      returnTypeID: this.ReturnTypeIDControl.value,
      hasBookSelected: this.SelectedBookAccountID.length != 0 ? true : false,
      selectedBookAccountID: this.SelectedBookAccountID,
      hasFirstSelected: this.SelectedFirstName != '' ? true : false,
      selectedFirstName: this.SelectedFirstName,
      selectedFirstID: this.SelectedFirstID,
      hasSecondSelected: this.SelectedSecondName != '' ? true : false,
      selectedSecondName: this.SelectedSecondName,
      selectedSecondID: this.SelectedSecondID,
      hasThirdSelected: this.SelectedThirdName != '' ? true : false,
      selectedThirdName: this.SelectedThirdName,
      selectedThirdID: this.SelectedThirdID,
      hasFourthSelected: this.SelectedFourthName != '' ? true : false,
      selectedFourthName: this.SelectedFourthName,
      selectedFourthID: this.SelectedFourthID,
      hasFifthSelected: this.SelectedFifthName != '' ? true : false,
      selectedFifthName: this.SelectedFifthName,
      selectedFifthID: this.SelectedFirstID,
      hasSixthSelected: this.SelectedSixthName != '' ? true : false,
      selectedSixthName: this.SelectedSixthName,
      selectedSixthID: this.SelectedSixthID,
      monthWise: this.MonthWiseControl.value,
      showInvoiceNo: this.ShowInvoiceNoControl.value,
      showInvoiceDate: this.ShowInvoiceDateControl.value,
      showQuantity: this.ShowQuantityControl.value,
      showAmount: this.ShowAmountControl.value,
      showDiscountAmount: this.ShowDiscountAmountControl.value,
      showTaxableAmount: this.ShowTaxableAmountControl.value,
      showTaxAmount: this.ShowTaxAmountControl.value,
      showGrossAmount: this.ShowGrossAmountControl.value,
      showSchemeAmount: this.ShowSchemeAmountControl.value,
      showNetAmount: this.ShowNetAmountControl.value,
      sortFirst: this.SelectedFirstName,
      sortSecond: this.SelectedSecondName,
      sortThird: this.SelectedThirdName,
      sortFourth: this.SelectedFourthName,
      sortFifth: this.SelectedFifthName,
      sortSixth: this.SelectedSixthName,
    };

    this.reportService.GetsalespurchaseData(filters).subscribe((response) => {
      this.DataResponse = response;
    });
  }

  ExportReport() {
    let filters: SalesPurchaseReportFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      transactionTypeID: this.TransactionTypeIDControl.value,
      returnTypeID: this.ReturnTypeIDControl.value,
      hasBookSelected: this.SelectedBookAccountID.length != 0 ? true : false,
      selectedBookAccountID: this.SelectedBookAccountID,
      hasFirstSelected: this.SelectedFirstName != '' ? true : false,
      selectedFirstName: this.SelectedFirstName,
      selectedFirstID: this.SelectedFirstID,
      hasSecondSelected: this.SelectedSecondName != '' ? true : false,
      selectedSecondName: this.SelectedSecondName,
      selectedSecondID: this.SelectedSecondID,
      hasThirdSelected: this.SelectedThirdName != '' ? true : false,
      selectedThirdName: this.SelectedThirdName,
      selectedThirdID: this.SelectedThirdID,
      hasFourthSelected: this.SelectedFourthName != '' ? true : false,
      selectedFourthName: this.SelectedFourthName,
      selectedFourthID: this.SelectedFourthID,
      hasFifthSelected: this.SelectedFifthName != '' ? true : false,
      selectedFifthName: this.SelectedFifthName,
      selectedFifthID: this.SelectedFirstID,
      hasSixthSelected: this.SelectedSixthName != '' ? true : false,
      selectedSixthName: this.SelectedSixthName,
      selectedSixthID: this.SelectedSixthID,
      monthWise: this.MonthWiseControl.value,
      showInvoiceNo: this.ShowInvoiceNoControl.value,
      showInvoiceDate: this.ShowInvoiceDateControl.value,
      showQuantity: this.ShowQuantityControl.value,
      showAmount: this.ShowAmountControl.value,
      showDiscountAmount: this.ShowDiscountAmountControl.value,
      showTaxableAmount: this.ShowTaxableAmountControl.value,
      showTaxAmount: this.ShowTaxAmountControl.value,
      showGrossAmount: this.ShowGrossAmountControl.value,
      showSchemeAmount: this.ShowSchemeAmountControl.value,
      showNetAmount: this.ShowNetAmountControl.value,
      sortFirst: this.SelectedFirstName,
      sortSecond: this.SelectedSecondName,
      sortThird: this.SelectedThirdName,
      sortFourth: this.SelectedFourthName,
      sortFifth: this.SelectedFifthName,
      sortSixth: this.SelectedSixthName,
    };

    this.reportService.ExportsalespurchaseData(filters).subscribe((response) => {
      const blob = new Blob([response as Blob], {
        type: 'application/vnd.ms.excel',
      });
      const file = new File([blob], 'SalesPurchaseReport.xlsx', {
        type: 'application/vnd.ms.excel',
      });
      saveAs(file);
    });
  }

  CreateGridColumns() {
    this.columns = [];
    this.columns.push({
      header: 'Book Name',
      field: 'bookName',
      sortable: false,
      disabled: true,
      minWidth: 250,
      width: '250px',
    });

    if (this.SelectedFirstName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedFirstName
        )[0].SelName,
        field: 'firstColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.SelectedSecondName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedSecondName
        )[0].SelName,
        field: 'secondColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.SelectedThirdName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedThirdName
        )[0].SelName,
        field: 'thirdColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.SelectedFourthName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedFourthName
        )[0].SelName,
        field: 'fourthColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.SelectedFifthName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedFifthName
        )[0].SelName,
        field: 'fifthColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.SelectedSixthName != '') {
      this.columns.push({
        header: this.FilterList.filter(
          (a) => a.SelType == this.SelectedSixthName
        )[0].SelName,
        field: 'sixthColVal',
        sortable: false,
        disabled: true,
        minWidth: 250,
        width: '250px',
      });
    }
    if (this.MonthWiseControl.value == true) {
      this.columns.push({
        header: 'Month Year',
        field: 'monthYear',
        sortable: false,
        disabled: true,
        minWidth: 120,
        width: '120px',
      });
    }
    if (this.ShowInvoiceNoControl.value == true) {
      this.columns.push({
        header: 'Ref No',
        field: 'invoiceNo',
        sortable: false,
        disabled: true,
        minWidth: 200,
        width: '200px',
      });
    }
    if (this.ShowInvoiceDateControl.value == true) {
      this.columns.push({
        header: 'Bill Date',
        field: 'invoiceDate',
        sortable: false,
        disabled: true,
        type: 'date',
        typeParameter: { format: 'dd-MM-yyyy' },
        minWidth: 100,
        width: '100px',
      });
    }

    if (this.ShowQuantityControl.value == true) {
      this.columns.push(
        {
          header: 'Crt',
          field: 'crt',
          sortable: false,
          disabled: true,
          minWidth: 60,
          width: '60px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Pcs',
          field: 'pcs',
          sortable: false,
          disabled: true,
          minWidth: 60,
          width: '60px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Free Crt',
          field: 'fCrt',
          sortable: false,
          disabled: true,
          minWidth: 50,
          width: '50px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Free Pcs',
          field: 'fPcs',
          sortable: false,
          disabled: true,
          minWidth: 50,
          width: '50px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Total Crt',
          field: 'tCrt',
          sortable: false,
          disabled: true,
          minWidth: 50,
          width: '50px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Total Pcs',
          field: 'tPcs',
          sortable: false,
          disabled: true,
          minWidth: 50,
          width: '50px',
          type: 'number',
          typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        }
      );
    }

    if (this.ShowAmountControl.value == true) {
      this.columns.push({
        header: 'Amount',
        field: 'amount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }
    if (this.ShowDiscountAmountControl.value == true) {
      this.columns.push({
        header: 'Discount Amount',
        field: 'discountAmount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }

    if (this.ShowTaxableAmountControl.value == true) {
      this.columns.push({
        header: 'Taxable Amount',
        field: 'taxableAmount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }
    if (this.ShowTaxAmountControl.value == true) {
      this.columns.push(
        {
          header: 'IGST Amount',
          field: 'igstAmount',
          sortable: false,
          disabled: true,
          minWidth: 130,
          width: '130px',
          type: 'number',
          typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'CGST Amount',
          field: 'cgstAmount',
          sortable: false,
          disabled: true,
          minWidth: 130,
          width: '130px',
          type: 'number',
          typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'SGST Amount',
          field: 'sgstAmount',
          sortable: false,
          disabled: true,
          minWidth: 130,
          width: '130px',
          type: 'number',
          typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Cess Amount',
          field: 'cessAmount',
          sortable: false,
          disabled: true,
          minWidth: 130,
          width: '130px',
          type: 'number',
          typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        },
        {
          header: 'Total Tax Amount',
          field: 'totalTaxAmount',
          sortable: false,
          disabled: true,
          minWidth: 130,
          width: '130px',
          type: 'number',
          typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
          class: 'right-mat-header-cell right-mat-cell',
        }
      );
    }
    if (this.ShowGrossAmountControl.value == true) {
      this.columns.push({
        header: 'Gross Amount',
        field: 'grossAmount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }
    if (this.ShowSchemeAmountControl.value == true) {
      this.columns.push({
        header: 'Scheme Amount',
        field: 'schemeAmount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }
    if (this.ShowNetAmountControl.value == true) {
      this.columns.push({
        header: 'Net Amount',
        field: 'netAmount',
        sortable: false,
        disabled: true,
        minWidth: 130,
        width: '130px',
        type: 'number',
        typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
        class: 'right-mat-header-cell right-mat-cell',
      });
    }
  }
}
