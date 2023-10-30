import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  OpeningItemPutRequest,
  ItemOpeningResponse,
  itemsDropDownResponse,
  PaginationHeaders,
  FilterValues,
  ItemOpening,
  ItemFilter_DropDown,
  returnTypeResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-item-opening',
  templateUrl: './item-opening.component.html',
  styleUrls: ['./item-opening.component.scss'],
})
export class ItemOpeningComponent implements OnInit {
  PageTitle: string = 'Opening Stock';
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  itemsDropDown: itemsDropDownResponse[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];
  balanceListData: ItemOpening[] = [];
  itemData?: ItemOpening;
  balancePutRequest?: OpeningItemPutRequest;
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  latestSortingOrder?: string;
  latestSearchText?: string;
  pageSizeOptions = defaultData.pageSizeOptions;
  currentItemID: number;

  balanceForm = this.fb.group({
    ItemID: ['', [Validators.required]],
    ReturnTypeID: ['', [Validators.required]],
    AccountTradeTypeName: [''],
    Packing: [''],
    Opening: [0],
    OpeningCrt: ['', [Validators.pattern(/^([0-9,-/+])+$/i)]],
    OpeningPcs: ['', [Validators.pattern(/^([0-9,-/+])+$/i)]],
  });

  constructor(
    private itemService: fromService.ItemService,
    private commonService: fromService.CommonService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.currentItemID = 0;
    this.accRights = this.route.snapshot.data['userRights'];
    this.latestSearchText = '';
    this.filterValues = [];
    this.itemsDropDown = [];
    this.latestSortingOrder = 'itemName';
    this.setColumns();
    this.GetItemOpening();
    this.FillItemDropDown();
    this.FillReturnTypeDropDown();
  }

  ngOnInit(): void {}

  get ItemIDControl() {
    return this.balanceForm.get('ItemID') as FormControl;
  }

  get ItemIDControlRequired() {
    return (
      this.ItemIDControl.hasError('required') && this.ItemIDControl.touched
    );
  }

  get ReturnTypeIDControl() {
    return this.balanceForm.get('ReturnTypeID') as FormControl;
  }

  get ReturnTypeIDControlRequired() {
    return (
      this.ReturnTypeIDControl.hasError('required') &&
      this.ReturnTypeIDControl.touched
    );
  }

  get OpeningControl() {
    return this.balanceForm.get('Opening') as FormControl;
  }

  get PackingControl() {
    return this.balanceForm.get('Packing') as FormControl;
  }

  get OpeningCrtControl() {
    return this.balanceForm.get('OpeningCrt') as FormControl;
  }

  get OpeningCrtControlInvalid() {
    return (
      this.OpeningCrtControl.hasError('pattern') &&
      this.OpeningCrtControl.touched
    );
  }

  get OpeningPcsControl() {
    return this.balanceForm.get('OpeningPcs') as FormControl;
  }

  get OpeningPcsControlInvalid() {
    return (
      this.OpeningPcsControl.hasError('pattern') &&
      this.OpeningPcsControl.touched
    );
  }

  setColumns() {
    this.columns = defaultData.GetItemOpeningColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 70,
      width: '70px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          iif: (record) => {
            return this.accRights!.canEdit;
          },
          click: (record) => this.edit(record),
        },
      ],
    });
  }

  GetItemOpening() {
    this.itemService
      .GetItemOpeningList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.balanceListData = response.body;
        this.pagination = response.headers;
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

  FillItemDropDown() {
    let filters: ItemFilter_DropDown = {
      ItemType: 1,
      AccountTradeTypeID: 0,
      OnlyStockItems: false,
      ReturnTypeID: 1,
    };
    this.itemService.ItemDropDown(filters).subscribe((response) => {
      this.itemsDropDown = response;
    });
  }

  edit(value: any) {
    this.EditRecord(Number(value.itemID), Number(value.returnTypeID));
  }

  UpdateBalance(balanceForm: FormGroup) {
    this.balancePutRequest = {
      returnTypeID: this.ReturnTypeIDControl.value,
      opening:
        this.ReturnTypeIDControl.value == 1 ? this.OpeningControl.value : 0,
      openingSpoiled:
        this.ReturnTypeIDControl.value == 1 ? 0 : this.OpeningControl.value,
    };
    this.itemService
      .updateItemOpening(balanceForm.value.ItemID, this.balancePutRequest)
      .subscribe((response) => {
        this.ResetForms(balanceForm);
        this.GetItemOpening();
      });
  }

  ResetForms(balanceForm: FormGroup) {
    let control: AbstractControl;
    balanceForm.reset();
    balanceForm.markAsUntouched();
    Object.keys(balanceForm.controls).forEach((name) => {
      control = balanceForm.controls[name];
      control.setErrors(null);
      control.setValue('');
    });
  }

  CalculateOpening() {
    let OpeningCrt = Number(this.OpeningCrtControl.value.replace(/,/g, ''));
    let OpeningPcs = Number(this.OpeningPcsControl.value.replace(/,/g, ''));
    let Packing = Number(this.PackingControl.value.replace(/,/g, ''));
    let Opening = OpeningCrt * Packing + OpeningPcs;
    this.OpeningControl.setValue(Opening);
  }

  ItemIDSelectionChange(event: any) {
    this.getItemDetails(Number(event));
  }

  ReturnTypeIDSelectionChange(event: any) {
    this.getOpeningDetail(this.currentItemID, Number(event));
  }

  getOpeningDetail(ItemID: number, ReturnTypeId: number) {
    this.itemData = this.balanceListData.find(
      (a) => a.itemID == ItemID && a.returnTypeID == ReturnTypeId
    );
    if (this.itemData) {
      this.balanceForm.patchValue({
        OpeningCrt: this.itemData!.openingCrt.toString(),
        OpeningPcs: this.itemData!.openingPcs.toString(),
      });
      this.CalculateOpening();
    } else {
      this.balanceForm.patchValue({
        OpeningCrt: '0',
        OpeningPcs: '0',
      });
    }
  }

  EditRecord(ItemID: number, ReturnTypeId: number) {
    this.itemData = this.balanceListData.find(
      (a) => a.itemID == ItemID && a.returnTypeID == ReturnTypeId
    );
    if (this.itemData) {
      this.balanceForm.patchValue({
        ItemID: ItemID.toString(),
        AccountTradeTypeName: this.itemData!.accountTradeTypeName,
        Packing: this.itemData!.packing.toString(),
        ReturnTypeID: this.itemData!.returnTypeID.toString(),
        OpeningCrt: this.itemData!.openingCrt.toString(),
        OpeningPcs: this.itemData!.openingPcs.toString(),
      });
      this.CalculateOpening();
    }
  }

  getItemDetails(ItemID: number) {
    this.currentItemID = ItemID;
    let Item = this.itemsDropDown.find((a) => Number(a.item_Id) == ItemID);
    this.balanceForm.patchValue({
      ItemID: ItemID.toString(),
      AccountTradeTypeName: Item!.accountTradeTypeName,
      Packing: Item!.packing.toString(),
    });
  }
}
