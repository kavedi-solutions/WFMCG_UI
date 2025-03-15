import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, startWith, tap } from 'rxjs';
import {
  ClosingStockbyItemID,
  GTMTItemResponse,
  Item,
  ItemFilter_DropDown,
  itemsDropDownResponse,
  NotificationComponent,
  Tax,
  TransactionTypeMaster,
  TransferGTMTItemDetail,
  TransferGTMTItemPostRequest,
  TransferGTMTItemPutRequest,
  TransferGTMTPostRequest,
  TransferGTMTPutRequest,
  TransferGTMTResponse,
} from 'src/app/shared';
import { CheckIsNumber, GetCrt, GetPcs } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-transfer-gtmtadd-edit',
  templateUrl: './transfer-gtmtadd-edit.component.html',
  styleUrls: ['./transfer-gtmtadd-edit.component.scss'],
})
export class TransferGTMTAddEditComponent implements OnInit {
  PageTitle: string = 'Create Transfer GT to MT';
  buttonText: string = 'Add New Transfer GT to MT';
  isEditMode: boolean = false;
  selectedTransferId: number;
  isFromQuickMenu: boolean = false;
  TransferMinDate?: Date;
  TransferMaxDate?: Date;
  TransferID: number = 0;

  transferPostRequest?: TransferGTMTPostRequest;
  transferPutRequest?: TransferGTMTPutRequest;

  CurrentFromItem?: Item;
  CurrentTax?: Tax;
  CurrentStock?: ClosingStockbyItemID;

  DisableAddItemBtn: boolean = true;

  fromItemsDropDown: itemsDropDownResponse[] = [];
  filteredFromitemsDropDown?: Observable<itemsDropDownResponse[]>;
  toItemName: string = '';

  ItemEdit?: TransferGTMTItemDetail;
  IsItemEditMode: boolean = false;
  ItemCount: number = 0;

  transferItemDetailsList: TransferGTMTItemDetail[] = [];
  transferItemDetailsListData: TransferGTMTItemDetail[] = [];

  columns: MtxGridColumn[] = [];

  editTransfer?: TransferGTMTResponse;

  transferForm = this.fb.group({
    TransferDate: ['', [Validators.required]],
    TransferNo: ['', [Validators.required]],
    Items: this.fb.group({
      I_FromItemID: [''],
      I_ToItemID: [''],
      I_Crt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Pcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Qty: [0],
    }),
  });

  @ViewChild('AutoFromItemID') AutoFromItemID?: MatAutocomplete;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private renderer: Renderer2,
    private transferGtMtService: fromService.TransferGTMTService,
    private itemService: fromService.ItemService,
    private stockService: fromService.StockService,
    public notification: NotificationComponent
  ) {
    this.isEditMode = false;
    this.setColumns();
    this.selectedTransferId = 0;
    this.SetMinMaxBillDate();
    this.FillFromItemDropDown(2);
  }

  ngOnInit(): void {
    this.filteredFromitemsDropDown = this.I_FromItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterFromItems(name as string)
          : this.fromItemsDropDown.slice();
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
      this.PageTitle = 'Update Transfer MT to GT';
      this.getTransferByID();
    } else {
      this.isEditMode = false;
    }
  }

  //DropDowns

  FillFromItemDropDown(AccountTradeTypeID: number) {
    let filters: ItemFilter_DropDown = {
      ItemType: 1,
      AccountTradeTypeID: AccountTradeTypeID,
      TransactionTypeID: TransactionTypeMaster.TransferStockGTtoMT,
      InvoiceID: this.TransferID,
    };
    this.itemService.ItemDropDown(filters).subscribe((response) => {
      this.fromItemsDropDown = response;
      this.I_FromItemIDControl.setValue('');
    });
  }

  setColumns() {
    this.columns = defaultData.GetTransferGTMTDetailColumns();
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

  get ItemsControl() {
    return this.transferForm.get('Items') as FormControl;
  }

  get I_FromItemIDControl() {
    return this.ItemsControl.get('I_FromItemID') as FormControl;
  }

  get I_ToItemIDControl() {
    return this.ItemsControl.get('I_ToItemID') as FormControl;
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
      this.router.navigate(['/transaction/transfergtmt/list']);
    } else {
      //this.ResetForm(this.transferForm);
    }
  }

  ResetItems() {
    this.ItemsControl.reset({
      I_FromItemID: '',
      I_ToItemID: '',
      I_Crt: 0,
      I_Pcs: 0,
      I_Qty: 0,
    });
    this.ItemsControl.markAsUntouched();
    this.renderer.selectRootElement('#FromItemName', true).focus();
    this.CurrentFromItem = undefined;
    this.CurrentStock = undefined;
    this.CurrentTax = undefined;
    this.toItemName = '';
    this.IsItemEditMode = false;
  }

  getTransferByID() {
    this.transferGtMtService
      .GetTransferGTMTbyID(this.selectedTransferId)
      .subscribe((response) => {
        this.editTransfer = response;

        this.TransferID = this.editTransfer!.autoID!;
        this.transferForm.patchValue({
          TransferNo: this.editTransfer?.transferNo.toString(),
        });

        this.TransferDateControl.setValue(
          moment(this.editTransfer?.transferDate)
        );
        this.editTransfer!.details!.forEach((element) => {
          let ItemDetails: TransferGTMTItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            FromItemID: element.fromItemID,
            FromItemName: element.fromItemName,
            ToItemID: element.toItemID,
            ToItemName: element.toItemName,
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
        I_FromItemID: '',
        I_ToItemID: '',
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
    this.I_FromItemIDControl.setValue('');
    this.I_ToItemIDControl.setValue('');
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
        this.transferGtMtService
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
        (a) => a.FromItemID == Number(this.I_FromItemIDControl.value.item_Id)
      );
      SrNo = this.transferItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.transferItemDetailsList.length + 1;
    }

    let ItemDetails: TransferGTMTItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      FromItemID: Number(this.I_FromItemIDControl.value.item_Id),
      FromItemName: this.I_FromItemIDControl.value.item_Name,
      ToItemID: Number(this.I_ToItemIDControl.value),
      ToItemName: this.toItemName,
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
      Number(this.I_CrtControl.value) * Number(this.CurrentFromItem?.packing) +
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

  SelectedFromItem(event: any) {
    let FoundItem = this.transferItemDetailsList.findIndex(
      (a) => a.FromItemID == event.option.value.item_Id
    );

    this.itemService
      .GetItemTransactionByID(
        event.option.value.item_Id,
        this.TransferDateControl.value.format('YYYY-MM-DD')
      )
      .subscribe((response) => {
        this.CurrentFromItem = response;
        this.GetToItem(this.CurrentFromItem!.itemID);
        if (FoundItem == -1) {
          this.GetCurrentStock(Number(this.CurrentFromItem?.itemID), 0);
        } else {
          this.ItemEdit = this.transferItemDetailsList[FoundItem];
          let ItemDetail: TransferGTMTItemDetail =
            this.transferItemDetailsList.filter(
              (a) => a.FromItemID == event.option.value.item_Id
            )[0];
          this.GetCurrentStock(
            Number(this.CurrentFromItem?.itemID),
            ItemDetail.Qty
          );
          this.I_CrtControl.setValue(ItemDetail.Crt);
          this.I_PcsControl.setValue(ItemDetail.Pcs);
          this.IsItemEditMode = true;
        }
      });
  }

  GetToItem(FromItemId: number) {
    this.itemService
      .getItemNameFromGTMT(FromItemId, 'MT')
      .subscribe((response: GTMTItemResponse) => {
        this.toItemName = response.itemName;
        this.I_ToItemIDControl.setValue(response.mtItemID);
      });
  }

  DisplayFromItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  GetCurrentStock(ItemID: number, EditQty: number) {
    //stockService
    this.stockService.GetClosingByItemID(ItemID, 1).subscribe((response) => {
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

  editItem(record: TransferGTMTItemDetail) {
    let SelectedFromItem: itemsDropDownResponse;
    SelectedFromItem = this.fromItemsDropDown.filter(
      (a) => a.item_Id == record.FromItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_FromItemID: SelectedFromItem,
      I_ToItemID: record.ToItemID,
      I_Crt: record.Crt,
      I_Pcs: record.Pcs,
      I_Qty: record.Qty,
    });
    this.IsItemEditMode = true;
    this.GetToItem(record.FromItemID);
    this.renderer.selectRootElement('#FromItemName', true).focus();
    this.itemService
      .GetItemTransactionByID(
        record.FromItemID,
        this.TransferDateControl.value.format('YYYY-MM-DD')
      )
      .subscribe((response) => {
        this.CurrentFromItem = response;
        this.GetCurrentStock(Number(this.CurrentFromItem?.itemID), record.Qty);
      });
  }

  deleteItem(record: TransferGTMTItemDetail) {
    let ItemIndex = this.transferItemDetailsList.findIndex(
      (a) =>
        a.FromItemID == Number(record.FromItemID) &&
        a.ToItemID == Number(record.ToItemID)
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

  private _filterFromItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.fromItemsDropDown.filter((option) =>
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
    let PostRequestDetail: TransferGTMTItemPostRequest[] = [];

    this.transferItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        fromItemID: element.FromItemID,
        toItemID: element.ToItemID,
        quantity: element.Qty,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.transferPostRequest = {
      transferNo: Number(transferForm.value.TransferNo),
      transferDate: transferForm.value.TransferDate.format('YYYY-MM-DD'),
      details: PostRequestDetail,
      isActive: true,
    };
    this.transferGtMtService
      .createTransferGTMT(this.transferPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateTransfer(transferForm: FormGroup) {
    let PutRequestDetail: TransferGTMTItemPutRequest[] = [];

    this.transferItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        fromItemID: element.FromItemID,
        toItemID: element.ToItemID,
        quantity: element.Qty,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.transferPutRequest = {
      transferNo: Number(transferForm.value.TransferNo),
      transferDate: transferForm.value.TransferDate.format('YYYY-MM-DD'),
      details: PutRequestDetail,
      isActive: true,
    };
    this.transferGtMtService
      .updateTransferGTMT(this.editTransfer!.autoID, this.transferPutRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
