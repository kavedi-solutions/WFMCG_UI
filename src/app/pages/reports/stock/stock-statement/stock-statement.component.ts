import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import {
  accountTradeTypeResponse,
  ItemGroup,
  returnTypeResponse,
  StockStatementFilter,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-stock-statement',
  templateUrl: './stock-statement.component.html',
  styleUrls: ['./stock-statement.component.scss'],
})
export class StockStatementComponent implements OnInit {
  PageTitle: string = 'Stock Statement';
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  columns: MtxGridColumn[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  showAmountDetail: boolean = false;
  itemGroupListData: ItemGroup[] = [];
  selecteditemGroupData: ItemGroup[] = [];
  ItemGroupType: string = 'Parent';

  stockStatementForm = this.fb.group({
    ReturnTypeID: ['', Validators.required],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    WithAmount: [false],
    AmountCalculatedOn: [''],
    WithAllAmount: [false],
    IsChildGroups: [false],
  });

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private commonService: fromService.CommonService,
    private itemGroupService: fromService.ItemgroupService
  ) {
    this.columns = defaultData.GetStockStatementItemGroupColumns();
    this.accountTradeTypeDropDown = [];
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillAccountTradeTypeDropDown('2');
    this.AmountCalculatedOnControl.setValue('1');
    this.FillItemGroupList();
    this.FillReturnTypeDropDown();
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

  FillAccountTradeTypeDropDown(AccountType: string) {
    this.accountTradeTypeDropDown = [];
    this.commonService
      .AccountTradeTypeDropDown()
      .subscribe((response: accountTradeTypeResponse[]) => {
        this.accountTradeTypeDropDown = response.filter((a) =>
          a.accountTypeID.includes(AccountType)
        );
        this.AccountTradeTypeIDControl.setValue(
          this.accountTradeTypeDropDown[0].accountTradeTypeID.toString()
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

  ChangeWithAmount() {
    this.showAmountDetail = this.WithAmountOnControl.value;
  }

  ChangeChildGroups() {
    this.ItemGroupType =
      this.IsChildGroupsControl.value == false ? 'Parent' : 'Child';
    this.FillItemGroupList();
  }

  FillReturnTypeDropDown() {
    this.returnTypeDropDown = [];
    this.commonService
      .ReutnTypeDropDown()
      .subscribe((response: returnTypeResponse[]) => {
        this.returnTypeDropDown = response;
        this.ReturnTypeIDControl.setValue(
          this.returnTypeDropDown[0].returnTypeID.toString()
        );
      });
  }

  FillItemGroupList() {
    this.itemGroupService
      .ItemGroupDropDown(this.ItemGroupType)
      .subscribe((response) => {
        this.itemGroupListData = response;
      });
  }

  rowSelectionChange(event: any) {
    this.selecteditemGroupData = event;
  }

  GenerateStatement() {
    let itemGroupIds: number[] = [];

    this.selecteditemGroupData.forEach((element) => {
      itemGroupIds.push(element.itemGroupID);
    });

    let filter: StockStatementFilter = {
      returnTypeID: this.ReturnTypeIDControl.value,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      accountTradeTypeID: this.AccountTradeTypeIDControl.value,
      withAmount: this.WithAmountOnControl.value,
      withAllAmount: this.WithAllAmountOnControl.value,
      amountCalculatedOn: this.AmountCalculatedOnControl.value,
      isChildGroups: this.IsChildGroupsControl.value,
      itemGroups: itemGroupIds,
    };
  }

  get ReturnTypeIDControl() {
    return this.stockStatementForm.get('ReturnTypeID') as FormControl;
  }

  get FromDateControl() {
    return this.stockStatementForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.stockStatementForm.get('ToDate') as FormControl;
  }

  get AccountTradeTypeIDControl() {
    return this.stockStatementForm.get('AccountTradeTypeID') as FormControl;
  }

  get AccountTradeTypeIDControlRequired() {
    return (
      this.AccountTradeTypeIDControl.hasError('required') &&
      this.AccountTradeTypeIDControl.touched
    );
  }

  get WithAmountOnControl() {
    return this.stockStatementForm.get('WithAmount') as FormControl;
  }

  get AmountCalculatedOnControl() {
    return this.stockStatementForm.get('AmountCalculatedOn') as FormControl;
  }

  get WithAllAmountOnControl() {
    return this.stockStatementForm.get('WithAllAmount') as FormControl;
  }

  get IsChildGroupsControl() {
    return this.stockStatementForm.get('IsChildGroups') as FormControl;
  }
}
