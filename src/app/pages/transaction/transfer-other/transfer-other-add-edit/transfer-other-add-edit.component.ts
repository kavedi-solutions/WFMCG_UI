import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, startWith, tap } from 'rxjs';
import {
  ClosingStockbyItemID,
  Item,
  ItemFilter_DropDown,
  itemsDropDownResponse,
  ItemTransaction,
  NotificationComponent,
  returnTypeResponse,
  Tax,
  TransactionTypeMaster,
  TransferOtherItemDetail,
  TransferOtherItemPostRequest,
  TransferOtherItemPutRequest,
  TransferOtherPostRequest,
  TransferOtherPutRequest,
  TransferOtherResponse,
} from 'src/app/shared';
import { CheckIsNumber, GetCrt, GetPcs } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-transfer-other-add-edit',
  templateUrl: './transfer-other-add-edit.component.html',
  styleUrls: ['./transfer-other-add-edit.component.scss'],
})
export class TransferOtherAddEditComponent implements OnInit {
  PageTitle: string = 'Create Transfer to Other';
  buttonText: string = 'Add New Transfer to Other';
  isEditMode: boolean = false;
  selectedTransferId: number;
  isFromQuickMenu: boolean = false;
  TransferMinDate?: Date;
  TransferMaxDate?: Date;
  TransferID: number = 0;
  ReturnTypeID: number = 0;

  transferPostRequest?: TransferOtherPostRequest;
  transferPutRequest?: TransferOtherPutRequest;

  CurrentItem?: ItemTransaction;
  CurrentTax?: Tax;
  CurrentStock?: ClosingStockbyItemID;

  DisableAddItemBtn: boolean = true;

  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;

  ItemEdit?: TransferOtherItemDetail;
  IsItemEditMode: boolean = false;
  ItemCount: number = 0;

  transferItemDetailsList: TransferOtherItemDetail[] = [];
  transferItemDetailsListData: TransferOtherItemDetail[] = [];

  columns: MtxGridColumn[] = [];

  editTransfer?: TransferOtherResponse;

  returnTypeDropDown: returnTypeResponse[] = [];

  transferForm = this.fb.group({
    TransferDate: ['', [Validators.required]],
    TransferNo: ['', [Validators.required]],
    ReturnTypeID: ['', [Validators.required]],
    Items: this.fb.group({
      I_ItemID: [''],
      I_Crt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Pcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Qty: [0],
    }),
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private renderer: Renderer2,
    private transferOtherService: fromService.TransferOtherService,
    private itemService: fromService.ItemService,
    private stockService: fromService.StockService,
    public notification: NotificationComponent,
    private commonService: fromService.CommonService
  ) {
    this.isEditMode = false;
    this.setColumns();
    this.selectedTransferId = 0;
    this.SetMinMaxBillDate();
    this.FillReturnTypeDropDown();
  }

  ngOnInit(): void {
    this.filtereditemsDropDown = this.I_ItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterItems(name as string)
          : this.itemsDropDown.slice();
      })
    );

    this.route.params
      .pipe(
        tap((params) => {
          this.selectedTransferId = params['transferid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedTransferId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Transfer to Other';
      this.getTransferByID();
    } else {
      this.isEditMode = false;
    }
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
    if (this.ReturnTypeID != 0) {
      let filters: ItemFilter_DropDown = {
        ItemType: 1,
        AccountTradeTypeID: 0,
        TransactionTypeID: TransactionTypeMaster.TransferStocktoOther,
        InvoiceID: this.TransferID,
        ReturnTypeID: this.ReturnTypeID,
      };
      this.itemService.ItemDropDown(filters).subscribe((response) => {
        this.itemsDropDown = response;
        this.I_ItemIDControl.setValue('');
      });
    }
  }

  setColumns() {
    this.columns = defaultData.GetTransferOtherDetailColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 120,
      width: '120px',
      pinned: 'right',
      type: 'button',
      class: '',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          pop: {
            title: 'Confirm Edit',
            description: 'Are you sure you want to Edit this Item.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.editItem(record),
        },
        {
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete Record',
          buttontype: 'button',
          pop: {
            title: 'Confirm Delete',
            description: 'Are you sure you want to Delete this Item.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.deleteItem(record),
        },
      ],
    });
  }

  //Controls
  get TransferDateControl() {
    return this.transferForm.get('TransferDate') as FormControl;
  }

  get TransferNoControl() {
    return this.transferForm.get('TransferNo') as FormControl;
  }

  get ReturnTypeIDControl() {
    return this.transferForm.get('ReturnTypeID') as FormControl;
  }

  get ItemsControl() {
    return this.transferForm.get('Items') as FormControl;
  }

  get I_ItemIDControl() {
    return this.ItemsControl.get('I_ItemID') as FormControl;
  }

  get I_CrtControl() {
    return this.ItemsControl.get('I_Crt') as FormControl;
  }
  get I_PcsControl() {
    return this.ItemsControl.get('I_Pcs') as FormControl;
  }
  get I_QtyControl() {
    return this.ItemsControl.get('I_Qty') as FormControl;
  }

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/transaction/transferother/list']);
    } else {
      //this.ResetForm(this.transferForm);
    }
  }

  ResetItems() {
    this.ItemsControl.reset({
      I_ItemID: '',
      I_Crt: 0,
      I_Pcs: 0,
      I_Qty: 0,
    });
    this.ItemsControl.markAsUntouched();
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.CurrentItem = undefined;
    this.CurrentStock = undefined;
    this.CurrentTax = undefined;
    this.IsItemEditMode = false;
  }

  getTransferByID() {
    this.transferOtherService
      .GetTransferOtherbyID(this.selectedTransferId)
      .subscribe((response) => {
        this.editTransfer = response;

        this.TransferID = this.editTransfer!.autoID!;
        this.transferForm.patchValue({
          TransferNo: this.editTransfer?.transferNo.toString(),
          ReturnTypeID: this.editTransfer?.returnTypeID.toString(),
        });

        this.ReturnTypeChange(this.editTransfer?.returnTypeID.toString());

        this.TransferDateControl.setValue(
          moment(this.editTransfer?.transferDate)
        );
        this.editTransfer!.details!.forEach((element) => {
          let ItemDetails: TransferOtherItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            ItemID: element.itemID,
            ItemName: element.itemName,
            Crt: element.crt,
            Pcs: element.pcs,
            Qty: element.quantity,
            IsAdd: false,
            IsModified: false,
            IsDeleted: false,
          };
          this.transferItemDetailsList.push(ItemDetails);
        });

        this.transferItemDetailsListData = [
          ...this.transferItemDetailsList.filter((a) => a.IsDeleted == false),
        ];
        this.ItemCount = this.transferItemDetailsListData.length;
      });
  }

  ResetForm(form: FormGroup) {
    let control: AbstractControl;
    form.reset({
      TransferDate: '',
      TransferNo: '',
      Items: {
        I_ItemID: '',
        I_Crt: 0,
        I_Pcs: 0,
        I_Qty: 0,
      },
    });
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    this.transferItemDetailsList = [];
    this.transferItemDetailsListData = [...this.transferItemDetailsList];
    this.I_ItemIDControl.setValue('');
    this.DisableAddItemBtn = true;
    this.SetMinMaxBillDate();
    this.renderer.selectRootElement('#TransferDate', true).focus();
  }

  //events

  SetMinMaxBillDate() {
    const currentYear = new Date().getFullYear();
    this.TransferMinDate = new Date(currentYear - 20, 0, 1);
    this.TransferMaxDate = new Date();
    this.TransferDateControl.setValue(moment(new Date()));
    this.GetNewTransferNo();
  }

  TransferDateChange() {
    this.GetNewTransferNo();
  }

  TransferDateBlur() {
    this.GetNewTransferNo();
  }

  GetNewTransferNo() {
    if (this.isEditMode == false) {
      let TransferDate = this.TransferDateControl.value.format('YYYY-MM-DD');
      if (TransferDate != '') {
        this.transferOtherService
          .GetNextTransferNo(TransferDate)
          .subscribe((response) => {
            this.TransferNoControl.setValue(response);
          });
      }
    }
  }

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.transferItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.transferItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.transferItemDetailsList.length + 1;
    }

    let ItemDetails: TransferOtherItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.I_ItemIDControl.value.item_Id),
      ItemName: this.I_ItemIDControl.value.item_Name,
      Crt: CheckIsNumber(this.I_CrtControl.value),
      Pcs: CheckIsNumber(this.I_PcsControl.value),
      Qty: CheckIsNumber(this.I_QtyControl.value),

      IsModified: this.isEditMode
        ? this.IsItemEditMode
          ? true
          : false
        : false,
      IsDeleted: false,
      IsAdd: this.isEditMode ? (this.IsItemEditMode ? false : true) : true,
    };
    if (this.IsItemEditMode == true) {
      this.transferItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.transferItemDetailsList.push(ItemDetails);
    }
    this.transferItemDetailsListData = [
      ...this.transferItemDetailsList.filter((a) => a.IsDeleted == false),
    ];

    this.ItemCount = this.transferItemDetailsListData.length;
    this.ResetItems();
    this.IsItemEditMode = false;
  }

  CheckStocks(event: Event, Field: string) {
    event.stopPropagation();
    event.preventDefault();
    let TotalQty = Number(this.I_QtyControl.value);
    if (TotalQty > this.CurrentStock!.closing) {
      this.notification.openStockErrorBar(
        'Quantity is more then stock',
        'Error',
        'red-snackbar'
      );
      this.renderer.selectRootElement('#' + Field, true).focus();
      if (Field == 'Crt') {
        this.I_CrtControl.setErrors({ Validate: true });
      }
      if (Field == 'Pcs') {
        this.I_PcsControl.setErrors({ Validate: true });
      }
    } else {
      if (Field == 'Crt') {
        this.I_CrtControl.setErrors(null);
      }
      if (Field == 'Pcs') {
        this.I_PcsControl.setErrors(null);
      }
    }
  }

  CalculateTotals() {
    let Qty = 0;
    Qty =
      Number(this.I_CrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.I_PcsControl.value);
    this.DisableAddItemBtn = true;
    if (Qty > 0) {
      if (Qty > this.CurrentStock!.closing) {
        this.DisableAddItemBtn = true;
      } else {
        this.DisableAddItemBtn = false;
      }
    }
    this.I_QtyControl.setValue(Qty);
  }

  ReturnTypeChange(event: any) {
    this.ReturnTypeID = Number(event);
    this.FillItemDropDown();
  }

  SelectedItem(event: any) {
    let FoundItem = this.transferItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );

    this.itemService
      .GetItemTransactionByID(
        event.option.value.item_Id,
        this.TransferDateControl.value.format('YYYY-MM-DD')
      )
      .subscribe((response) => {
        this.CurrentItem = response;
        if (FoundItem == -1) {
          this.GetCurrentStock(Number(this.CurrentItem?.itemID), 0);
        } else {
          this.ItemEdit = this.transferItemDetailsList[FoundItem];
          let ItemDetail: TransferOtherItemDetail =
            this.transferItemDetailsList.filter(
              (a) => a.ItemID == event.option.value.item_Id
            )[0];
          this.GetCurrentStock(
            Number(this.CurrentItem?.itemID),
            ItemDetail.Qty
          );
          this.I_CrtControl.setValue(ItemDetail.Crt);
          this.I_PcsControl.setValue(ItemDetail.Pcs);
          this.IsItemEditMode = true;
        }
      });
  }

  DisplayItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  GetCurrentStock(ItemID: number, EditQty: number) {
    //stockService
    this.stockService
      .GetClosingByItemID(ItemID, this.ReturnTypeID)
      .subscribe((response) => {
        this.CurrentStock = response;
        if (EditQty > 0 && this.isEditMode == true) {
          this.CurrentStock!.closing =
            this.CurrentStock!.closing + Number(EditQty);
          this.CurrentStock!.closingCrt = GetCrt(
            this.CurrentStock!.closing,
            this.CurrentStock!.packing
          );
          this.CurrentStock!.closingPcs = GetPcs(
            this.CurrentStock!.closing,
            this.CurrentStock!.packing
          );
        }
        this.CalculateTotals();
      });
  }

  editItem(record: TransferOtherItemDetail) {
    let SelectedItem: itemsDropDownResponse;
    SelectedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_ItemID: SelectedItem,
      I_Crt: record.Crt,
      I_Pcs: record.Pcs,
      I_Qty: record.Qty,
    });
    this.IsItemEditMode = true;
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.itemService
      .GetItemTransactionByID(
        record.ItemID,
        this.TransferDateControl.value.format('YYYY-MM-DD')
      )
      .subscribe((response) => {
        this.CurrentItem = response;
        this.GetCurrentStock(Number(this.CurrentItem?.itemID), record.Qty);
      });
  }

  deleteItem(record: TransferOtherItemDetail) {
    let ItemIndex = this.transferItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.transferItemDetailsList[ItemIndex].AutoID > 0) {
      this.transferItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.transferItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.transferItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.transferItemDetailsListData = [
      ...this.transferItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.transferItemDetailsListData.length;
  }

  private _filterItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.itemsDropDown.filter((option) =>
      option.item_Name.toLowerCase().includes(filterValue)
    );
  }

  SaveUpdateTransfer(transferForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateTransfer(transferForm);
    } else {
      this.SaveTransfer(transferForm);
    }
  }

  SaveTransfer(transferForm: FormGroup) {
    let PostRequestDetail: TransferOtherItemPostRequest[] = [];

    this.transferItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.transferPostRequest = {
      transferNo: Number(transferForm.value.TransferNo),
      transferDate: transferForm.value.TransferDate.format('YYYY-MM-DD'),
      returnTypeID: Number(transferForm.value.ReturnTypeID),
      details: PostRequestDetail,
      isActive: true,
    };
    this.transferOtherService
      .createTransferOther(this.transferPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateTransfer(transferForm: FormGroup) {
    let PutRequestDetail: TransferOtherItemPutRequest[] = [];

    this.transferItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.transferPutRequest = {
      transferNo: Number(transferForm.value.TransferNo),
      transferDate: transferForm.value.TransferDate.format('YYYY-MM-DD'),
      returnTypeID: Number(transferForm.value.ReturnTypeID),
      details: PutRequestDetail,
      isActive: true,
    };
    this.transferOtherService
      .updateTransferOther(this.editTransfer!.autoID, this.transferPutRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
