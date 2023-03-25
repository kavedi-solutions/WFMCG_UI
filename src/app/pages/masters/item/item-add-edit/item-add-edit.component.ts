import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import * as fromService from '../../../../shared/index';
import {
  Item,
  ItemPostRequest,
  ItemPutRequest,
  ItemGroupDownDownResponse,
  ManufactureDownDownResponse,
  DD_UnitResponse,
  accountTradeTypeResponse,
  TaxDownDownResponse,
  Tax,
} from '../../../../shared/index';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: ['./item-add-edit.component.scss'],
})
export class ItemAddEditComponent implements OnInit {
  PageTitle: string = 'Create Item Group';
  buttonText: string = 'Add New Item Group';
  isEditMode: boolean = false;
  selectedItemId: number;
  itemPostRequest?: ItemPostRequest;
  itemPutRequest?: ItemPutRequest;
  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  manufactureDropDown: ManufactureDownDownResponse[] = [];
  unitDropDown: DD_UnitResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  editItem?: Item;
  isItemNameValid: boolean = false;
  ItemName: string = '';
  ItemNameExists: Subject<any> = new Subject();
  TaxDetails?: Tax;
  itemForm = this.fb.group({
    ItemName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
      ],
    ],
    HSNCode: ['', [Validators.required]],
    IsServiceItem: [false],
    ItemGroupID: ['', [Validators.required]],
    ManufactureID: ['', [Validators.required]],
    Packing: [
      '',
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^([0-9])+$/i),
      ],
    ],
    Weight: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    MainUnit: ['', [Validators.required]],
    SubUnit: ['', [Validators.required]],
    GSTTaxID: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    MRP: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    PurchaseRate: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    PurchaseRateWT: [''],
    SalesRate: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    SalesRateWT: [''],
    Margin: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private itemService: fromService.ItemService,
    private itemGroupService: fromService.ItemgroupService,
    private manufactureService: fromService.ManufactureService,
    private commonService: fromService.CommonService,
    private taxService: fromService.TaxService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedItemId = 0;
    this.itemGroupDropDown = [];
    this.manufactureDropDown = [];
    this.unitDropDown = [];
    this.accountTradeTypeDropDown = [];
    this.taxDropDown = [];
    this.FillChildItemGroup();
    this.FillManufacture();
    this.FillUnitsDropDown();
    this.FillTaxDropDown();
    this.FillAccountTradeTypeDropDown('2');
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Item';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedItemId = params['itemid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedItemId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Item';
      this.getItemByID();
    } else {
      this.isEditMode = false;
    }
    this.ItemNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckItemNameExists(this.ItemName);
    });
  }

  //Controls

  get ItemNameControl() {
    return this.itemForm.get('ItemName') as FormControl;
  }

  get ItemNameControlRequired() {
    return (
      this.ItemNameControl.hasError('required') && this.ItemNameControl.touched
    );
  }

  get ItemNameControlInvalid() {
    return (
      this.ItemNameControl.hasError('pattern') && this.ItemNameControl.touched
    );
  }

  get HSNCodeControl() {
    return this.itemForm.get('HSNCode') as FormControl;
  }

  get HSNCodeControlRequired() {
    return (
      this.HSNCodeControl.hasError('required') && this.HSNCodeControl.touched
    );
  }

  get ItemGroupIDControl() {
    return this.itemForm.get('ItemGroupID') as FormControl;
  }

  get ItemGroupIDControlRequired() {
    return (
      this.ItemGroupIDControl.hasError('required') &&
      this.ItemGroupIDControl.touched
    );
  }

  get ManufactureIDControl() {
    return this.itemForm.get('ManufactureID') as FormControl;
  }

  get ManufactureIDControlRequired() {
    return (
      this.ManufactureIDControl.hasError('required') &&
      this.ManufactureIDControl.touched
    );
  }

  get PackingControl() {
    return this.itemForm.get('Packing') as FormControl;
  }

  get PackingControlRequired() {
    return (
      this.PackingControl.hasError('required') && this.PackingControl.touched
    );
  }

  get PackingControlInvalid() {
    return (
      this.PackingControl.hasError('pattern') && this.PackingControl.touched
    );
  }

  get PackingControlMin() {
    return this.PackingControl.hasError('min') && this.PackingControl.touched;
  }

  get WeightControl() {
    return this.itemForm.get('Weight') as FormControl;
  }

  get WeightControlRequired() {
    return (
      this.WeightControl.hasError('required') && this.WeightControl.touched
    );
  }

  get WeightControlInvalid() {
    return this.WeightControl.hasError('pattern') && this.WeightControl.touched;
  }

  get WeightControlMin() {
    return this.WeightControl.hasError('min') && this.WeightControl.touched;
  }

  get MainUnitControl() {
    return this.itemForm.get('MainUnit') as FormControl;
  }

  get MainUnitControlRequired() {
    return (
      this.MainUnitControl.hasError('required') && this.MainUnitControl.touched
    );
  }

  get SubUnitControl() {
    return this.itemForm.get('SubUnit') as FormControl;
  }

  get SubUnitControlRequired() {
    return (
      this.SubUnitControl.hasError('required') && this.SubUnitControl.touched
    );
  }

  get GSTTaxIDControl() {
    return this.itemForm.get('GSTTaxID') as FormControl;
  }

  get GSTTaxIDControlRequired() {
    return (
      this.GSTTaxIDControl.hasError('required') && this.GSTTaxIDControl.touched
    );
  }

  get AccountTradeTypeIDControl() {
    return this.itemForm.get('AccountTradeTypeID') as FormControl;
  }

  get AccountTradeTypeIDControlRequired() {
    return (
      this.AccountTradeTypeIDControl.hasError('required') &&
      this.AccountTradeTypeIDControl.touched
    );
  }

  get MRPControl() {
    return this.itemForm.get('MRP') as FormControl;
  }

  get MRPControlRequired() {
    return this.MRPControl.hasError('required') && this.MRPControl.touched;
  }

  get MRPControlInvalid() {
    return this.MRPControl.hasError('pattern') && this.MRPControl.touched;
  }

  get MRPControlMin() {
    return this.MRPControl.hasError('min') && this.MRPControl.touched;
  }

  get PurchaseRateControl() {
    return this.itemForm.get('PurchaseRate') as FormControl;
  }

  get PurchaseRateControlRequired() {
    return (
      this.PurchaseRateControl.hasError('required') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateControlInvalid() {
    return (
      this.PurchaseRateControl.hasError('pattern') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateControlMin() {
    return (
      this.PurchaseRateControl.hasError('min') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateWTControl() {
    return this.itemForm.get('PurchaseRateWT') as FormControl;
  }

  get SalesRateControl() {
    return this.itemForm.get('SalesRate') as FormControl;
  }

  get SalesRateControlRequired() {
    return (
      this.SalesRateControl.hasError('required') &&
      this.SalesRateControl.touched
    );
  }

  get SalesRateControlInvalid() {
    return (
      this.SalesRateControl.hasError('pattern') && this.SalesRateControl.touched
    );
  }

  get SalesRateControlMin() {
    return (
      this.SalesRateControl.hasError('min') && this.SalesRateControl.touched
    );
  }

  get SalesRateWTControl() {
    return this.itemForm.get('SalesRateWT') as FormControl;
  }

  get MarginControl() {
    return this.itemForm.get('Margin') as FormControl;
  }

  get MarginControlRequired() {
    return (
      this.MarginControl.hasError('required') && this.MarginControl.touched
    );
  }

  get MarginControlInvalid() {
    return this.MarginControl.hasError('pattern') && this.MarginControl.touched;
  }

  get MarginControlMin() {
    return this.MarginControl.hasError('min') && this.MarginControl.touched;
  }

  //Controls

  getItemNameValidation() {
    if (this.isItemNameValid) {
      this.itemForm.controls.ItemName.setErrors({
        isItemNameValid: true,
      });
    } else {
      this.itemForm.controls.ItemName.updateValueAndValidity();
    }
    return this.isItemNameValid;
  }

  onItemNameKeyUp($event: any) {
    this.ItemName = $event.target.value.trim();
    this.ItemNameExists.next(this.ItemName);
  }

  CheckItemNameExists(ItemName: string) {
    if (ItemName != '') {
      this.itemService
        .CheckItemNameExists(this.selectedItemId, ItemName)
        .subscribe((response) => {
          this.isItemNameValid = response;
        });
    }
  }

  getItemByID() {
    this.itemService.GetItembyID(this.selectedItemId).subscribe((response) => {
      this.editItem = response;
      this.itemForm.patchValue({
        ItemName: this.editItem!.itemName,
        HSNCode: this.editItem!.hsnCode,
        IsServiceItem: this.editItem!.isServiceItem,
        ItemGroupID: this.editItem!.itemGroupID.toString(),
        ManufactureID: this.editItem!.manufactureID.toString(),
        Packing: this.editItem!.packing.toString(),
        Weight: this.editItem!.weight.toString(),
        MainUnit: this.editItem!.mainUnit.toString(),
        SubUnit: this.editItem!.subUnit.toString(),
        GSTTaxID: this.editItem!.gstTaxID.toString(),
        AccountTradeTypeID: this.editItem!.accountTradeTypeID.toString(),
        MRP: this.editItem!.mrp.toString(),
        PurchaseRate: this.editItem!.purchaseRate.toString(),
        SalesRate: this.editItem!.salesRate.toString(),
        Margin: this.editItem!.margin.toString(),
        isActive: this.editItem!.isActive,
      });
      this.GSTTaxIDSelectionChange(this.editItem!.gstTaxID.toString());
    });
  }

  BacktoList() {
    this.router.navigate(['/master/item/list']);
  }

  SaveUpdateItem(itemForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateItem(itemForm);
    } else {
      this.SaveItem(itemForm);
    }
  }

  SaveItem(itemForm: FormGroup) {
    this.itemPostRequest = {
      itemName: itemForm.value.ItemName,
      hSNCode: itemForm.value.HSNCode,
      isServiceItem: itemForm.value.IsServiceItem,
      itemGroupID: Number(itemForm.value.ItemGroupID),
      manufactureID: Number(itemForm.value.ManufactureID),
      packing: Number(itemForm.value.Packing),
      weight: Number(itemForm.value.Weight.replace(/,/g, '')),
      mainUnit: Number(itemForm.value.MainUnit),
      subUnit: Number(itemForm.value.SubUnit),
      gSTTaxID: Number(itemForm.value.GSTTaxID),
      accountTradeTypeID: Number(itemForm.value.AccountTradeTypeID),
      mRP: Number(itemForm.value.MRP.replace(/,/g, '')),
      purchaseRate: Number(itemForm.value.PurchaseRate.replace(/,/g, '')),
      salesRate: Number(itemForm.value.SalesRate.replace(/,/g, '')),
      margin: Number(itemForm.value.Margin.replace(/,/g, '')),
      isActive: itemForm.value.isActive,
    };
    this.itemService.createItem(this.itemPostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateItem(itemForm: FormGroup) {
    this.itemPutRequest = {
      itemName: itemForm.value.ItemName,
      hSNCode: itemForm.value.HSNCode,
      isServiceItem: itemForm.value.IsServiceItem,
      itemGroupID: Number(itemForm.value.ItemGroupID),
      manufactureID: Number(itemForm.value.ManufactureID),
      packing: Number(itemForm.value.Packing),
      weight: Number(itemForm.value.Weight.replace(/,/g, '')),
      mainUnit: Number(itemForm.value.MainUnit),
      subUnit: Number(itemForm.value.SubUnit),
      gSTTaxID: Number(itemForm.value.GSTTaxID),
      accountTradeTypeID: Number(itemForm.value.AccountTradeTypeID),
      mRP: Number(itemForm.value.MRP.replace(/,/g, '')),
      purchaseRate: Number(itemForm.value.PurchaseRate.replace(/,/g, '')),
      salesRate: Number(itemForm.value.SalesRate.replace(/,/g, '')),
      margin: Number(itemForm.value.Margin.replace(/,/g, '')),
      isActive: itemForm.value.isActive,
    };
    this.itemService
      .updateItem(this.selectedItemId, this.itemPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  FillChildItemGroup() {
    this.itemGroupService.ItemGroupDropDown('Child').subscribe((response) => {
      this.itemGroupDropDown = response;
    });
  }

  FillManufacture() {
    this.manufactureService.ManufactureDropDown().subscribe((response) => {
      this.manufactureDropDown = response;
    });
  }

  FillUnitsDropDown() {
    this.commonService.UnitDropDown().subscribe((response) => {
      this.unitDropDown = response;
    });
  }

  FillAccountTradeTypeDropDown(AccountType: string) {
    this.accountTradeTypeDropDown = [];
    this.commonService
      .AccountTradeTypeDropDown()
      .subscribe((response: accountTradeTypeResponse[]) => {
        this.accountTradeTypeDropDown = response.filter((a) =>
          a.accountTypeID.includes(AccountType)
        );
      });
  }

  FillTaxDropDown() {
    this.taxService.TaxDropDown().subscribe((response) => {
      this.taxDropDown = response;
    });
  }

  ChangeServiceItem(event: any) {
    if (event.checked == true) {
      this.FillAccountTradeTypeDropDown('1');
    } else {
      this.FillAccountTradeTypeDropDown('2');
    }
  }

  onBlurWeight() {
    let Value = this.WeightControl.value;
    this.WeightControl.setValue(formatNumber(Value, 'en-IN', '0.3-3'));
  }

  onFocusWeight() {
    let Value = Number(this.WeightControl.value);
    this.WeightControl.setValue(Value > 0 ? Value : '');
  }

  onBlurMRP() {
    let Value = this.MRPControl.value;
    this.MRPControl.setValue(formatNumber(Value, 'en-IN', '0.2-2'));
  }

  onFocusMRP() {
    let Value = Number(this.MRPControl.value);
    this.MRPControl.setValue(Value > 0 ? Value : '');
  }

  onBlurPurchaseRate() {
    let Value = this.PurchaseRateControl.value;
    this.PurchaseRateControl.setValue(formatNumber(Value, 'en-IN', '0.2-2'));
  }

  onFocusPurchaseRate() {
    let Value = Number(this.PurchaseRateControl.value.replace(/,/g, ''));
    this.PurchaseRateControl.setValue(Value > 0 ? Value : '');
  }

  onBlurSalesRate() {
    let Value = this.SalesRateControl.value;
    this.SalesRateControl.setValue(formatNumber(Value, 'en-IN', '0.2-2'));
  }

  onFocusSalesRate() {
    let Value = Number(this.SalesRateControl.value.replace(/,/g, ''));
    this.SalesRateControl.setValue(Value > 0 ? Value : '');
  }

  GSTTaxIDSelectionChange(event: any) {
    this.taxService.GetTaxbyID(Number(event)).subscribe((response) => {
      this.TaxDetails = response;
      this.CalculateRates();
    });
  }

  CalculateRates() {
    let PurchaseRate = Number(this.PurchaseRateControl.value.replace(/,/g, ''));
    let SalesRate = Number(this.SalesRateControl.value.replace(/,/g, ''));
    let TotalTaxRate = this.TaxDetails!.totalTaxRate;
    let PurchaseRateWT = PurchaseRate + PurchaseRate * (TotalTaxRate / 100);
    let SalesRateWT = SalesRate + SalesRate * (TotalTaxRate / 100);
    this.PurchaseRateWTControl.setValue(
      formatNumber(PurchaseRateWT, 'en-IN', '0.2-2')
    );
    this.SalesRateWTControl.setValue(
      formatNumber(SalesRateWT, 'en-IN', '0.2-2')
    );
    let Profit = SalesRate - PurchaseRate;
    let margin = (Profit / PurchaseRate) * 100;
    this.MarginControl.setValue(formatNumber(margin, 'en-IN', '0.2-2'));
  }
}
