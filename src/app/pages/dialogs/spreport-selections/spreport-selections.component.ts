import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, Subject } from 'rxjs';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  ItemFilter_DropDown,
  ItemFilter_DropDownReport,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';

@Component({
  selector: 'app-spreport-selections',
  templateUrl: './spreport-selections.component.html',
  styleUrls: ['./spreport-selections.component.scss'],
})
export class SPReportSelectionsComponent implements OnInit {
  DialogTitle: string = '';
  DataFor: string = '';
  TransactionType: number = 0;
  ReturnTypeId: number = 0;
  SelectedValue: number[] = [];
  selectedData: any[] = [];

  columns: MtxGridColumn[] = [];
  SelectionData: any[] = [];
  filterData: any[] = [];
  SearchData: Subject<any> = new Subject();
  SearchValue: string = '';
  constructor(
    public dialogRef: MatDialogRef<SPReportSelectionsComponent>,
    private accountService: fromService.AccountsService,
    private areaService: fromService.AreaService,
    private itemGroupService: fromService.ItemgroupService,
    private manufactureService: fromService.ManufactureService,
    private itemService: fromService.ItemService
  ) {}

  ngOnInit(): void {
    this.GetListData();
    this.SetColumns();
    this.SearchData.pipe(debounceTime(300)).subscribe(() => {
      this.filterData = this._filterAccount(this.SearchValue);
    });
  }

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.SelectionData.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onSearchKeyUp($event: any) {
    this.SearchValue = $event.target.value.trim();
    this.SearchData.next(this.SearchValue);
  }

  GetListData() {
    switch (this.DataFor) {
      case 'Book':
        this.FillBooksDropDown();
        break;
      case 'Area':
        this.FillAreaDropDown();
        break;
      case 'Account':
        this.FillAccountDropDown();
        break;
      case 'Manufacture':
        this.FillManufactureDropDown();
        break;
      case 'ParentItemGroup':
        this.FillParentItemGroupDropDown();
        break;
      case 'ChildItemGroup':
        this.FillChildItemGroupDropDown();
        break;
      case 'Item':
        this.FillItemDropDown();
        break;
    }
  }

  onClickOk() {
    this.selectedData.forEach((element) => {
      this.SelectedValue.push(Number(element.autoId));
    });
    this.dialogRef.close({
      CloseStatus: true,
      SelectedData: this.SelectedValue,
    });
  }

  onClickCancel() {
    this.dialogRef.close({
      CloseStatus: false,
      SelectedData: [],
    });
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [this.TransactionType],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.SelectionData = [];
      response.forEach((element: { account_Name: any; account_Id: any }) => {
        this.SelectionData.push({
          autoId: element.account_Id,
          name: element.account_Name,
        });
      });
      this.filterData = this.SelectionData;
    });
  }

  FillAreaDropDown() {
    this.SelectionData = [];
    this.areaService.AreaDropDown().subscribe((response) => {
      response.forEach((element: { area_Name: any; area_Id: any }) => {
        this.SelectionData.push({
          autoId: element.area_Id,
          name: element.area_Name,
        });
      });
      this.filterData = this.SelectionData;
    });
  }

  FillAccountDropDown() {
    let AccountTypeID: number = 0;
    switch (this.TransactionType) {
      case 11:
      case 12:
      case 13:
      case 31:
      case 34:
        AccountTypeID = AccountTypeMaster.Supplier;
        break;
      case 21:
      case 22:
      case 23:
      case 32:
      case 33:
        AccountTypeID = AccountTypeMaster.Customer;
        break;
    }

    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeID],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.SelectionData = [];
      response.forEach((element: { account_Name: any; account_Id: any }) => {
        this.SelectionData.push({
          autoId: element.account_Id,
          name: element.account_Name,
        });
      });
      this.filterData = this.SelectionData;
    });
  }

  FillManufactureDropDown() {
    this.manufactureService.ManufactureDropDown().subscribe((response) => {
      response.forEach(
        (element: { manufacture_Name: any; manufacture_Id: any }) => {
          this.SelectionData.push({
            autoId: element.manufacture_Id,
            name: element.manufacture_Name,
          });
        }
      );
      this.filterData = this.SelectionData;
    });
  }

  FillChildItemGroupDropDown() {
    this.itemGroupService.ItemGroupDropDown('Child').subscribe((response) => {
      response.forEach(
        (element: { itemGroup_Name: any; itemGroup_Id: any }) => {
          this.SelectionData.push({
            autoId: element.itemGroup_Id,
            name: element.itemGroup_Name,
          });
        }
      );
      this.filterData = this.SelectionData;
    });
  }

  FillParentItemGroupDropDown() {
    this.itemGroupService.ItemGroupDropDown('Child').subscribe((response) => {
      response.forEach(
        (element: { itemGroup_Name: any; itemGroup_Id: any }) => {
          this.SelectionData.push({
            autoId: element.itemGroup_Id,
            name: element.itemGroup_Name,
          });
        }
      );
      this.filterData = this.SelectionData;
    });
  }

  FillItemDropDown() {
    let itemType: number = 1;

    switch (this.TransactionType) {
      case 11:
      case 21:
      case 31:
      case 32:
        itemType = 1;
        break;
      case 12:
      case 22:
      case 33:
      case 34:
        itemType = 2;
        break;
      case 13:
      case 23:
        itemType = 3;
        break;
    }

    let filters: ItemFilter_DropDownReport = {
      ItemType: itemType,
      TransactionTypeID: this.TransactionType,      
    };
    this.itemService.ItemDropDownReport(filters).subscribe((response) => {
      response.forEach((element: { item_Name: any; item_Id: any }) => {
        this.SelectionData.push({
          autoId: element.item_Id,
          name: element.item_Name,
        });
      });
      this.filterData = this.SelectionData;
    });
  }

  rowSelectionChange(event: any) {
    this.selectedData = event;
  }

  SetColumns() {
    this.columns.push(
      {
        header: 'Auto ID',
        field: 'autoId',
        hide: true,
      },
      {
        header: 'Name(s)',
        field: 'name',
        sortable: false,
        disabled: false,
      }
    );
  }
}
