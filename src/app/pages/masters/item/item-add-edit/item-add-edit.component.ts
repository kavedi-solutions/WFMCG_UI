import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, Subject, tap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as fromService from '../../../../shared/index';
import {
  Item,
  ItemPostRequest,
  ItemGSTPostRequest,
  ItemPutRequest,
  ItemGroupDownDownResponse,
  ManufactureDownDownResponse,
  DD_UnitResponse,
  accountTradeTypeResponse,
  TaxDownDownResponse,
  Tax,
  HSNCodeDropDownResponse,
  ItemGSTDetails,
  ItemGSTPutRequest,
  ItemSoftwareDetails,
  ItemSoftwarePostRequest,
  ItemSoftwarePutRequest,
} from '../../../../shared/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import * as defaultData from '../../../../data/index';
import { MatDialog } from '@angular/material/dialog';
import { ItemSoftwareDetailsComponent, ItemTaxMappingComponent } from 'src/app/pages/dialogs';

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
  hsncodeDropDown: HSNCodeDropDownResponse[] = [];
  filteredhsncodeDropDown?: Observable<HSNCodeDropDownResponse[]>;
  editItem?: Item;
  isItemNameValid: boolean = false;
  ItemName: string = '';
  ItemNameExists: Subject<any> = new Subject();
  isFromQuickMenu: boolean = false;
  IsInventoryDisable: boolean = false;

  columns: MtxGridColumn[] = [];
  itemGSTDetailsList: ItemGSTDetails[] = [];
  itemGSTDetailsListData: ItemGSTDetails[] = [];

  itemSoftwareDetailsList: ItemSoftwareDetails[] = [];
  itemSoftwareDetailsListData: ItemSoftwareDetails[] = [];
  softwareColumns: MtxGridColumn[] = [];

  dialogRef: any;

  itemForm = this.fb.group({
    ItemName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/%]+[\s]*)+$/i),
      ],
    ],
    DisplayItemName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/%]+[\s]*)+$/i),
      ],
    ],
    HSNCodeId: [''],
    ItemType: ['1', [Validators.required]],
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
    AccountTradeTypeID: ['', [Validators.required]],
    MRP: [
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
    private hsnCodeService: fromService.HSNCodeService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.isEditMode = false;
    this.selectedItemId = 0;
    this.itemGroupDropDown = [];
    this.manufactureDropDown = [];
    this.unitDropDown = [];
    this.accountTradeTypeDropDown = [];
    this.FillChildItemGroup();
    this.FillManufacture();
    this.FillUnitsDropDown();
    this.FillHSNCodeDropDown('A');
    this.FillAccountTradeTypeDropDown('2');
    this.setColumns();
    this.setSoftwareColumns();
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Item';
    this.isFromQuickMenu = false;
    if (!this.router.url.includes('quickmenu')) {
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
    } else {
      this.isFromQuickMenu = true;
    }
    this.ItemNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckItemNameExists(this.ItemName);
    });

    this.filteredhsncodeDropDown = this.HSNCodeIdControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.hsN_SAC_Code;
        return name
          ? this._filterHSN(name as string)
          : this.hsncodeDropDown.slice();
      })
    );
  }

  private _filterHSN(name: string): HSNCodeDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.hsncodeDropDown.filter((option) =>
      option.hsN_SAC_Code.toLowerCase().includes(filterValue)
    );
  }

  DisplayHSNCode(items: HSNCodeDropDownResponse) {
    return items && items.hsN_SAC_Code ? items.hsN_SAC_Code : '';
  }

  setColumns() {
    this.columns = defaultData.GetItemTaxMappingColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 50,
      width: '90px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          iif: (record) => {
            if (record.status != 'CNL') return true;
            else return false;
          },
          click: (record) => this.EditGSTDetails(record),
        },
      ],
    });
  }

  setSoftwareColumns() {
    this.softwareColumns = defaultData.GetItemSoftwareColumns();
    this.softwareColumns.push({
      header: 'Action',
      field: 'action',
      minWidth: 50,
      width: '90px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          iif: (record) => {
            if (record.status != 'CNL') return true;
            else return false;
          },
          click: (record) => this.EditSoftwareDetails(record),
        },
      ],
    });
  }

  AddGSTDetails() {
    let obj: ItemGSTDetails = {
      autoID: 0,
      applicableDate: '',
      gstTaxID: 0,
      taxName: '',
      totalTaxRate: 0,
      purchaseRate: 0,
      purchaseRateWT: 0,
      salesRate: 0,
      salesRateWT: 0,
      margin: 0,
      isAdd: true,
      isModified: false,
    };
    this.OpenGSTDialog(obj, 'New');
  }

  EditGSTDetails(event: ItemGSTDetails) {
    this.OpenGSTDialog(event, 'Update');
  }

  OpenGSTDialog(obj: ItemGSTDetails, Type: string) {
    this.dialogRef = this.dialog.open(ItemTaxMappingComponent, {
      minWidth: '60vw',
      minHeight: '60vh',
      maxWidth: '60vw',
      maxHeight: '60vh',
      panelClass: 'dialog-container',
      autoFocus: true,
      hasBackdrop: true,
      disableClose: true,
      data: { objGSTDetails: obj, objType: Type },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result.CloseStatus == true) {
        if (result.RGSTDetails.isAdd == true) {
          this.itemGSTDetailsList.push(result.RGSTDetails);
        } else if (result.RGSTDetails.isModified == true) {
          let index = this.itemGSTDetailsList.findIndex(
            (a) => a.autoID == result.RGSTDetails.autoID
          );
          this.itemGSTDetailsList[index] = result.RGSTDetails;
        }
        this.itemGSTDetailsListData = [...this.itemGSTDetailsList];
      }
    });
  }

  AddSoftwareDetails() {
    let obj: ItemSoftwareDetails = {
      autoID: 0,
      softwareID: 0,
      softwareInit: '',
      itemName: '',
      isAdd: true,
      isModified: false,
      isDeleted: false,
    };
    this.OpenSoftwareDialog(obj, 'New');
  }

  EditSoftwareDetails(event: ItemSoftwareDetails) {
    this.OpenSoftwareDialog(event, 'Update');
  }

  OpenSoftwareDialog(obj: ItemSoftwareDetails, Type: string) {
    this.dialogRef = this.dialog.open(ItemSoftwareDetailsComponent, {
      minWidth: '40vw',
      minHeight: '60vh',
      maxWidth: '40vw',
      maxHeight: '60vh',
      panelClass: 'dialog-container',
      autoFocus: true,
      hasBackdrop: true,
      data: { SoftwareDetails: obj, objType: Type },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result.CloseStatus == true) {
        if (result.SoftwareDetails.isAdd == true) {
          this.itemSoftwareDetailsList.push(result.SoftwareDetails);
        } else if (result.SoftwareDetails.isModified == true) {
          let index = this.itemSoftwareDetailsList.findIndex(
            (a) => a.autoID == result.SoftwareDetails.autoID
          );
          this.itemSoftwareDetailsList[index] = result.SoftwareDetails;
        }
        this.itemSoftwareDetailsListData = [
          ...this.itemSoftwareDetailsList,
        ];
      }
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

  get DisplayItemNameControl() {
    return this.itemForm.get('DisplayItemName') as FormControl;
  }

  get DisplayItemNameControlRequired() {
    return (
      this.DisplayItemNameControl.hasError('required') &&
      this.DisplayItemNameControl.touched
    );
  }

  get DisplayItemNameControlInvalid() {
    return (
      this.DisplayItemNameControl.hasError('pattern') &&
      this.DisplayItemNameControl.touched
    );
  }

  get ItemTypeControl() {
    return this.itemForm.get('ItemType') as FormControl;
  }

  get ItemTypeControlRequired() {
    return (
      this.ItemTypeControl.hasError('required') && this.ItemTypeControl.touched
    );
  }

  get HSNCodeIdControl() {
    return this.itemForm.get('HSNCodeId') as FormControl;
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
      let SeletedHSN: HSNCodeDropDownResponse;
      SeletedHSN = this.hsncodeDropDown.filter(
        (a) => a.autoID == this.editItem?.hsnCodeID
      )[0];

      this.itemForm.patchValue({
        ItemName: this.editItem!.itemName,
        DisplayItemName: this.editItem!.displayItemName,
        ItemType: this.editItem!.itemType.toString(),
        ItemGroupID: this.editItem!.itemGroupID.toString(),
        ManufactureID: this.editItem!.manufactureID.toString(),
        Packing: this.editItem!.packing.toString(),
        Weight: this.editItem!.weight.toString(),
        MainUnit: this.editItem!.mainUnit.toString(),
        SubUnit: this.editItem!.subUnit.toString(),
        AccountTradeTypeID: this.editItem!.accountTradeTypeID.toString(),
        MRP: this.editItem!.mrp.toString(),
        isActive: this.editItem!.isActive,
      });
      this.HSNCodeIdControl.setValue(SeletedHSN);
      this.ItemTypeSelectionChange(this.editItem!.itemType.toString());

      this.editItem?.gstDetails?.forEach((element) => {
        let GSTDetails: ItemGSTDetails = {
          autoID: element.autoID,
          applicableDate: element.applicableDate,
          gstTaxID: element.gstTaxID,
          taxName: element.taxName,
          totalTaxRate: element.totalTaxRate,
          purchaseRate: element.purchaseRate,
          purchaseRateWT: element.purchaseRateWT,
          salesRate: element.salesRate,
          salesRateWT: element.salesRateWT,
          margin: element.margin,
          isAdd: false,
          isModified: false,
        };
        this.itemGSTDetailsList.push(GSTDetails);
      });

      this.itemGSTDetailsListData = [...this.itemGSTDetailsList];

      this.editItem?.softwareDetails?.forEach((element) => {
        let SoftwareDetails: ItemSoftwareDetails = {
          autoID: element.autoID,
          softwareID: element.softwareID,
          softwareInit: element.softwareInit,
          itemName: element.itemName,
          isAdd: false,
          isModified: false,
          isDeleted: false,
        };
        this.itemSoftwareDetailsList.push(SoftwareDetails);
      });

      this.itemSoftwareDetailsListData = [
        ...this.itemSoftwareDetailsList,
      ];
    });
  }

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/master/item/list']);
    } else {
      this.ResetItemForm(this.itemForm);
    }
  }

  ResetItemForm(form: FormGroup) {
    form.reset({
      ItemName: '',
      HSNCodeId: '',
      ItemType: 1,
      ItemGroupID: '',
      ManufactureID: '',
      Packing: '',
      Weight: '',
      MainUnit: '',
      SubUnit: '',
      AccountTradeTypeID: '',
      MRP: '',
      isActive: true,
    });
    let control: AbstractControl;
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });

    this.itemGSTDetailsListData = [...this.itemGSTDetailsList];

    this.itemSoftwareDetailsListData = [...this.itemSoftwareDetailsList];
  }

  SaveUpdateItem(itemForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateItem(itemForm);
    } else {
      this.SaveItem(itemForm);
    }
  }

  SaveItem(itemForm: FormGroup) {
    let PostRequestDetail: ItemGSTPostRequest[] = [];
    let PostSoftwareRequestDetail: ItemSoftwarePostRequest[] = [];
    if (this.itemGSTDetailsList.length > 0) {
      this.itemGSTDetailsList.forEach((element) => {
        PostRequestDetail.push({
          applicableDate: element.applicableDate,
          gstTaxID: element.gstTaxID,
          purchaseRate: element.purchaseRate,
          salesRate: element.salesRate,
          margin: element.margin,
          isAdd: element.isAdd,
          isModified: element.isModified,
        });
      });
    }

    //softwareDetails
    if (this.itemSoftwareDetailsList.length > 0) {
      this.itemSoftwareDetailsList.forEach((element) => {
        PostSoftwareRequestDetail.push({
          softwareID: element.softwareID,
          itemName: element.itemName,
          isAdd: element.isAdd,
          isModified: element.isModified,
          isDeleted: element.isDeleted,
        });
      });
    }

    this.itemPostRequest = {
      itemName: itemForm.value.ItemName,
      displayItemName: itemForm.value.DisplayItemName,
      hsnCodeId: itemForm.value.HSNCodeId.autoID,
      itemType: itemForm.value.ItemType,
      itemGroupID: Number(itemForm.value.ItemGroupID),
      manufactureID: Number(itemForm.value.ManufactureID),
      packing: Number(itemForm.value.Packing),
      weight: Number(itemForm.value.Weight.replace(/,/g, '')),
      mainUnit: Number(itemForm.value.MainUnit),
      subUnit: Number(itemForm.value.SubUnit),
      accountTradeTypeID: Number(itemForm.value.AccountTradeTypeID),
      mRP: Number(itemForm.value.MRP.replace(/,/g, '')),
      isActive: itemForm.value.isActive,
      gstDetails: PostRequestDetail,
      softwareDetails: PostSoftwareRequestDetail,
    };
    this.itemService.createItem(this.itemPostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateItem(itemForm: FormGroup) {
    let PutRequestDetail: ItemGSTPutRequest[] = [];
    let PutSoftwareRequestDetail: ItemSoftwarePutRequest[] = [];
    if (this.itemGSTDetailsList.length > 0) {
      this.itemGSTDetailsList.forEach((element) => {
        PutRequestDetail.push({
          autoID: element.autoID,
          applicableDate: element.applicableDate,
          gstTaxID: element.gstTaxID,
          purchaseRate: element.purchaseRate,
          salesRate: element.salesRate,
          margin: element.margin,
          isAdd: element.isAdd,
          isModified: element.isModified,
        });
      });
    }

    if (this.itemSoftwareDetailsList.length > 0) {
      this.itemSoftwareDetailsList.forEach((element) => {
        PutSoftwareRequestDetail.push({
          autoID: element.autoID,
          softwareID: element.softwareID,
          itemName: element.itemName,
          isAdd: element.isAdd,
          isModified: element.isModified,
          isDeleted: element.isDeleted,
        });
      });
    }

    this.itemPutRequest = {
      itemName: itemForm.value.ItemName,
      displayItemName: itemForm.value.DisplayItemName,
      hsnCodeId: itemForm.value.HSNCodeId.autoID,
      itemType: itemForm.value.ItemType,
      itemGroupID: Number(itemForm.value.ItemGroupID),
      manufactureID: Number(itemForm.value.ManufactureID),
      packing: Number(itemForm.value.Packing),
      weight: Number(itemForm.value.Weight.replace(/,/g, '')),
      mainUnit: Number(itemForm.value.MainUnit),
      subUnit: Number(itemForm.value.SubUnit),
      accountTradeTypeID: Number(itemForm.value.AccountTradeTypeID),
      mRP: Number(itemForm.value.MRP.replace(/,/g, '')),
      isActive: itemForm.value.isActive,
      gstDetails: PutRequestDetail,
      softwareDetails: PutSoftwareRequestDetail,
    };
    this.itemService
      .updateItem(this.selectedItemId, this.itemPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  FillHSNCodeDropDown(HSNSACType: string) {
    this.hsnCodeService.HSNCodeDropDown(HSNSACType).subscribe((response) => {
      this.hsncodeDropDown = response;
      this.HSNCodeIdControl.setValue('');
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

  ItemTypeSelectionChange(event: any) {
    if (event == '1') {
      this.FillAccountTradeTypeDropDown('2');
    } else {
      this.FillAccountTradeTypeDropDown('1');
    }
  }
}
