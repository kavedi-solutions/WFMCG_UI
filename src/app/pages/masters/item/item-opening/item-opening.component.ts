import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import {
  AccessRights,
  OpeningItemPutRequest,
  ItemOpeningResponse,
  itemsDropDownResponse,
  PaginationHeaders,
  FilterValues,
  ItemOpening,
  ItemFilter_DropDown,
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
  balanceListData: ItemOpening[] = [];
  itemData?: ItemOpening;
  balancePutRequest?: OpeningItemPutRequest;
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  latestSortingOrder?: string;
  latestSearchText?: string;

  balanceForm = this.fb.group({
    ItemID: ['', [Validators.required]],
    AccountTradeTypeName: [''],
    Packing: [''],
    Opening: [0],
    OpeningCrt: ['', [Validators.pattern(/^([0-9,-/+])+$/i)]],
    OpeningPcs: ['', [Validators.pattern(/^([0-9,-/+])+$/i)]],
  });

  constructor(
    private itemService: fromService.ItemService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.latestSearchText = '';
    this.filterValues = [];
    this.itemsDropDown = [];
    this.latestSortingOrder = 'itemName';
    this.setColumns();
    this.GetItemOpening();
    this.FillItemDropDown();
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

  FillItemDropDown() {
    let filters: ItemFilter_DropDown = {
      IsServiceItem: false,
      AccountTradeTypeID: 0,
    };
    this.itemService.ItemDropDown(filters).subscribe((response) => {
      this.itemsDropDown = response;
    });
  }

  edit(value: any) {
    this.EditRecord(Number(value.itemID));
  }

  UpdateBalance(balanceForm: FormGroup) {
    this.balancePutRequest = {
      opening: this.OpeningControl.value,
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
    this.EditRecord(Number(event));
  }

  EditRecord(ItemID: number) {
    this.itemData = this.balanceListData.find((a) => a.itemID == ItemID);
    this.balanceForm.patchValue({
      ItemID: ItemID.toString(),
      AccountTradeTypeName: this.itemData!.accountTradeTypeName,
      Packing: this.itemData!.packing.toString(),
      OpeningCrt: this.itemData!.openingCrt.toString(),
      OpeningPcs: this.itemData!.openingPcs.toString(),
    });
    this.CalculateOpening();
  }
}
