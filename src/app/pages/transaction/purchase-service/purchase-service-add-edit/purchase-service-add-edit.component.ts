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
import * as fromService from '../../../../shared/index';
import {
  accountsDropDownResponse,
  accountTradeTypeResponse,
  ClosingStockbyItemID,
  Item,
  ItemFilter_DropDown,
  ItemGroupDownDownResponse,
  itemsDropDownResponse,
  PurchaseSItemDetail,
  PurchaseSItemPostRequest,
  PurchaseSItemPutRequest,
  PurchaseSPostRequest,
  PurchaseSPutRequest,
  PurchaseSResponse,
  Tax,
  TaxDownDownResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-purchase-service-add-edit',
  templateUrl: './purchase-service-add-edit.component.html',
  styleUrls: ['./purchase-service-add-edit.component.scss'],
})
export class PurchaseServiceAddEditComponent implements OnInit {
  PageTitle: string = 'Create Purchase (Service)';
  buttonText: string = 'Add New Purchase';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedPurchaseId: number;

  purchasePostRequest?: PurchaseSPostRequest;
  purchasePutRequest?: PurchaseSPutRequest;
  editPurchase?: PurchaseSResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  purchaseItemDetailsList: PurchaseSItemDetail[] = [];
  purchaseItemDetailsListData: PurchaseSItemDetail[] = [];
  CurrentItem?: Item;
  CurrentTax?: Tax;
  BillMinDate?: Date;
  BillMaxDate?: Date;
  DisableAddItemBtn: boolean = true;
  CompanyStateID: number = 0;
  AccountStateID: number = 0;
  IsIGSTInvoice: boolean = false;
  InvoiceType: string = '';
  columns: MtxGridColumn[] = [];

  IsDiscPerChange: boolean = false;
  IsSchPerChange: boolean = false;

  IsItemEditMode: boolean = false;
  ItemEdit?: PurchaseSItemDetail;
  ItemCount: number = 0;
  purchaseForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    TotalAmount: ['0'],
    TotalDiscAmount: ['0'],
    TotalTaxableAmount: ['0'],
    TotalCGSTAmount: ['0'],
    TotalSGSTAmount: ['0'],
    TotalIGSTAmount: ['0'],
    TotalCessAmount: ['0'],
    TotalTaxAmount: ['0'],
    TotalNetAmount: ['0'],
    RoundOffAmount: ['0'],
    NetAmount: ['0'],
    Items: this.fb.group({
      I_ItemID: [''],
      I_Amount: [0],
      I_DiscPer: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_DiscAmount: [0],
      I_TaxableAmount: [0],
      I_GSTTaxID: [''],
      I_CGSTAmount: [0],
      I_SGSTAmount: [0],
      I_IGSTAmount: [0],
      I_CessAmount: [0],
      I_TotalTaxAmount: [0],
      I_NetAmount: [0],
    }),
  });

  @ViewChild('AutoItemID') AutoItemID?: MatAutocomplete;
  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private purchaseService: fromService.PurchaseSService,
    private accountService: fromService.AccountsService,
    private itemService: fromService.ItemService,
    private taxService: fromService.TaxService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.setColumns();
    this.isEditMode = false;
    this.selectedPurchaseId = 0;
    this.itemGroupDropDown = [];
    this.taxDropDown = [];
    this.FillTaxDropDown();
    this.FillBooksDropDown();
    this.FillAccountDropDown();
    this.FillItemDropDown(1);
    this.SetMinMaxBillDate();
  }

  ngOnInit(): void {
    this.filteredaccountsDropDown = this.AccountIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.account_Name;
        return name
          ? this._filterAccount(name as string)
          : this.accountsDropDown.slice();
      })
    );

    this.filtereditemsDropDown = this.I_ItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterItems(name as string)
          : this.itemsDropDown.slice();
      })
    );

    if (!this.router.url.includes('quickmenu')) {
      this.route.params
        .pipe(
          tap((params) => {
            this.selectedPurchaseId = params['purchaseid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedPurchaseId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Purchase';
        this.getPurchaseByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetPurchaseSItemDetailColumns();
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

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/transaction/purchase-service/list']);
    } else {
      this.ResetForm(this.purchaseForm);
    }
  }

  getPurchaseByID() {
    this.purchaseService
      .GetPurchasebyID(this.selectedPurchaseId)
      .subscribe((response) => {
        this.editPurchase = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editPurchase?.accountID.toString()
        )[0];

        this.purchaseForm.patchValue({
          BookAccountID: this.editPurchase?.bookAccountID.toString(),
          BillNo: this.editPurchase?.billNo.toString(),
          RefNo: this.editPurchase?.refNo,
          AccountTradeTypeID: this.editPurchase?.accountTradeTypeID.toString(),
          TotalAmount: SetFormatCurrency(this.editPurchase?.totalAmount),
          TotalDiscAmount: SetFormatCurrency(
            this.editPurchase?.totalDiscAmount
          ),
          TotalTaxableAmount: SetFormatCurrency(
            this.editPurchase?.totalTaxableAmount
          ),
          TotalCGSTAmount: SetFormatCurrency(
            this.editPurchase?.totalCGSTAmount
          ),
          TotalSGSTAmount: SetFormatCurrency(
            this.editPurchase?.totalSGSTAmount
          ),
          TotalIGSTAmount: SetFormatCurrency(
            this.editPurchase?.totalIGSTAmount
          ),
          TotalCessAmount: SetFormatCurrency(
            this.editPurchase?.totalCessAmount
          ),
          TotalTaxAmount: SetFormatCurrency(this.editPurchase?.totalTaxAmount),
          TotalNetAmount: SetFormatCurrency(this.editPurchase?.totalNetAmount),
          RoundOffAmount: SetFormatCurrency(this.editPurchase?.roundOffAmount),
          NetAmount: SetFormatCurrency(this.editPurchase?.netAmount),
        });

        this.BillDateControl.setValue(moment(this.editPurchase?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);

        this.editPurchase!.details!.forEach((element) => {
          let ItemDetails: PurchaseSItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            ItemID: element.itemID,
            ItemName: element.itemName,
            Amount: element.amount,
            DiscPer: element.discPer,
            DiscAmount: element.discAmount,
            TaxableAmount: element.taxableAmount,
            GSTTaxID: element.gstTaxID,
            GSTTaxName: element.gstTaxName,
            CGSTAmount: element.cgstAmount,
            SGSTAmount: element.sgstAmount,
            IGSTAmount: element.igstAmount,
            CessAmount: element.cessAmount,
            TotalTaxAmount: element.totalTaxAmount,
            NetAmount: element.netAmount,
            IsAdd: false,
            IsModified: false,
            IsDeleted: false,
          };
          this.purchaseItemDetailsList.push(ItemDetails);
        });

        this.purchaseItemDetailsListData = [
          ...this.purchaseItemDetailsList.filter((a) => a.IsDeleted == false),
        ];
        this.ItemCount = this.purchaseItemDetailsListData.length;
      });
  }

  SaveUpdatePurchase(purchaseForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdatePurchase(purchaseForm);
    } else {
      this.SavePurchase(purchaseForm);
    }
  }

  SavePurchase(purchaseForm: FormGroup) {
    let PostRequestDetail: PurchaseSItemPostRequest[] = [];
    this.purchaseItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        itemID: element.ItemID,
        amount: element.Amount,
        discPer: element.DiscPer,
        discAmount: element.DiscAmount,
        taxableAmount: element.TaxableAmount,
        gSTTaxID: element.GSTTaxID,
        cGSTAmount: element.CGSTAmount,
        sGSTAmount: element.SGSTAmount,
        iGSTAmount: element.IGSTAmount,
        cessAmount: element.CessAmount,
        totalTaxAmount: element.TotalTaxAmount,
        netAmount: element.NetAmount,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.purchasePostRequest = {
      bookAccountID: Number(purchaseForm.value.BookAccountID),
      billNo: Number(purchaseForm.value.BillNo),
      refNo: purchaseForm.value.RefNo,
      billDate: purchaseForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(purchaseForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(purchaseForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(purchaseForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(purchaseForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(purchaseForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(purchaseForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(purchaseForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(purchaseForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(purchaseForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(purchaseForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(purchaseForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(purchaseForm.value.NetAmount),
      details: PostRequestDetail,
      isActive: true,
    };
    this.purchaseService
      .createPurchase(this.purchasePostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdatePurchase(purchaseForm: FormGroup) {
    let PutRequestDetail: PurchaseSItemPutRequest[] = [];
    this.purchaseItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        itemID: element.ItemID,
        amount: element.Amount,
        discPer: element.DiscPer,
        discAmount: element.DiscAmount,
        taxableAmount: element.TaxableAmount,
        gSTTaxID: element.GSTTaxID,
        cGSTAmount: element.CGSTAmount,
        sGSTAmount: element.SGSTAmount,
        iGSTAmount: element.IGSTAmount,
        cessAmount: element.CessAmount,
        totalTaxAmount: element.TotalTaxAmount,
        netAmount: element.NetAmount,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.purchasePutRequest = {
      bookAccountID: Number(purchaseForm.value.BookAccountID),
      billNo: Number(purchaseForm.value.BillNo),
      refNo: purchaseForm.value.RefNo,
      billDate: purchaseForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(purchaseForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(purchaseForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(purchaseForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(purchaseForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(purchaseForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(purchaseForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(purchaseForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(purchaseForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(purchaseForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(purchaseForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(purchaseForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(purchaseForm.value.NetAmount),
      details: PutRequestDetail,
      isActive: true,
    };
    this.purchaseService
      .updatePurchase(this.editPurchase!.autoID, this.purchasePutRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  SetMinMaxBillDate() {
    const currentYear = new Date().getFullYear();
    this.BillMinDate = new Date(currentYear - 20, 0, 1);
    this.BillMaxDate = new Date();
    this.BillDateControl.setValue(moment(new Date()));
  }

  //DropDowns
  FillTaxDropDown() {
    this.taxService.TaxDropDown().subscribe((response) => {
      this.taxDropDown = response;
    });
  }


  FillBooksDropDown() {
    let filters = {
      GroupID: 0,
      BalanceTransferToID: 0,
      AccountTypeID: 4,
      TransactionTypeID: TransactionTypeMaster.Purchase_Service,
      SalesTypeID: 0,
      AccountTradeTypeID: 0,
      AreaID: 0,
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  FillAccountDropDown() {
    let filters = {
      GroupID: 0,
      BalanceTransferToID: 0,
      AccountTypeID: 3,
      TransactionTypeID: 0,
      SalesTypeID: 0,
      AccountTradeTypeID: 0,
      AreaID: 0,
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
      this.AccountIDControl.setValue('');
    });
  }

  FillItemDropDown(AccountTradeTypeID: number) {
    let filters: ItemFilter_DropDown = {
      IsServiceItem: true,
      IsInventory: false,
      AccountTradeTypeID: AccountTradeTypeID,
    };
    this.itemService.ItemDropDown(filters).subscribe((response) => {
      this.itemsDropDown = response;
      this.I_ItemIDControl.setValue('');
    });
  }

  DisplayAccountName(accounts: accountsDropDownResponse) {
    return accounts && accounts.account_Name ? accounts.account_Name : '';
  }

  DisplayItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  //Events

  BillDateChange() {
    this.GetNewBillNo();
  }

  BillDateBlur() {
    this.GetNewBillNo();
  }

  BookAccountIDblur() {
    this.GetNewBillNo();
  }

  SelectedAccount(event: any) {
    this.AccountStateID = event.option.value.stateID;
    this.InvoiceType =
      this.AccountStateID != this.CompanyStateID
        ? 'IGST Invoice'
        : 'CGST/SGST Invoice';
    this.IsIGSTInvoice =
      this.AccountStateID != this.CompanyStateID ? true : false;
  }

  SelectedItem(event: any) {
    //check item exitst in item Detail

    let FoundItem = this.purchaseItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );
    if (FoundItem != -1) {
      this.ItemEdit = this.purchaseItemDetailsList[FoundItem];
      let ItemDetail: PurchaseSItemDetail = this.purchaseItemDetailsList.filter(
        (a) => a.ItemID == event.option.value.item_Id
      )[0];
      this.I_AmountControl.setValue(ItemDetail.Amount);
      this.I_DiscPerControl.setValue(ItemDetail.DiscPer);
      this.I_DiscAmountControl.setValue(ItemDetail.DiscAmount);
      this.I_GSTTaxIDControl.setValue(ItemDetail.GSTTaxID.toString());
      this.I_CGSTAmountControl.setValue(ItemDetail.CGSTAmount);
      this.I_SGSTAmountControl.setValue(ItemDetail.SGSTAmount);
      this.I_IGSTAmountControl.setValue(ItemDetail.IGSTAmount);
      this.I_CessAmountControl.setValue(ItemDetail.CessAmount);
      this.I_NetAmountControl.setValue(ItemDetail.NetAmount);
      this.CalculateTotals();
      this.IsItemEditMode = true;
    }
    this.itemService
      .GetItembyID(event.option.value.item_Id)
      .subscribe((response) => {
        this.CurrentItem = response;
        if (FoundItem == -1) {
          this.I_GSTTaxIDControl.setValue(
            this.CurrentItem?.gstTaxID.toString()
          );
        }
        this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID));
      });
  }

  GetCurrentTax(TaxID: number) {
    this.taxService.GetTaxbyID(TaxID).subscribe((response) => {
      this.CurrentTax = response;
    });
  }

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.purchaseItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.purchaseItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.purchaseItemDetailsList.length + 1;
    }

    let ItemDetails: PurchaseSItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.I_ItemIDControl.value.item_Id),
      ItemName: this.I_ItemIDControl.value.item_Name,
      Amount: CheckIsNumber(this.I_AmountControl.value),
      DiscPer: CheckIsNumber(this.I_DiscPerControl.value),
      DiscAmount: CheckIsNumber(this.I_DiscAmountControl.value),
      TaxableAmount: CheckIsNumber(this.I_TaxableAmountControl.value),
      GSTTaxID: CheckIsNumber(this.I_GSTTaxIDControl.value),
      GSTTaxName: this.CurrentTax?.taxName?.toString(),
      CGSTAmount: CheckIsNumber(this.I_CGSTAmountControl.value),
      SGSTAmount: CheckIsNumber(this.I_SGSTAmountControl.value),
      IGSTAmount: CheckIsNumber(this.I_IGSTAmountControl.value),
      CessAmount: CheckIsNumber(this.I_CessAmountControl.value),
      TotalTaxAmount: CheckIsNumber(this.I_TotalTaxAmountControl.value),
      NetAmount: CheckIsNumber(this.I_NetAmountControl.value),
      IsAdd: this.isEditMode ? (this.IsItemEditMode ? false : true) : true,
      IsModified: this.isEditMode
        ? this.IsItemEditMode
          ? true
          : false
        : false,
      IsDeleted: false,
    };
    if (this.IsItemEditMode == true) {
      this.purchaseItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.purchaseItemDetailsList.push(ItemDetails);
    }
    this.purchaseItemDetailsListData = [
      ...this.purchaseItemDetailsList.filter((a) => a.IsDeleted == false),
    ];

    this.ItemCount = this.purchaseItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: PurchaseSItemDetail) {
    let SeletedItem: itemsDropDownResponse;
    SeletedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_ItemID: SeletedItem,
      I_Amount: SetFormatCurrency(record.Amount),
      I_DiscPer: SetFormatCurrency(record.DiscPer),
      I_DiscAmount: SetFormatCurrency(record.DiscAmount),
      I_TaxableAmount: SetFormatCurrency(record.TaxableAmount),
      I_GSTTaxID: record.GSTTaxID.toString(),
      I_CGSTAmount: SetFormatCurrency(record.CGSTAmount),
      I_SGSTAmount: SetFormatCurrency(record.SGSTAmount),
      I_IGSTAmount: SetFormatCurrency(record.IGSTAmount),
      I_CessAmount: SetFormatCurrency(record.CessAmount),
      I_TotalTaxAmount: SetFormatCurrency(record.TotalTaxAmount),
      I_NetAmount: SetFormatCurrency(record.NetAmount),
    });
    this.IsItemEditMode = true;
    this.renderer.selectRootElement('#ItemName').focus();
    this.itemService.GetItembyID(record.ItemID).subscribe((response) => {
      this.CurrentItem = response;
      this.GetCurrentTax(Number(record.GSTTaxID));
    });
  }

  deleteItem(record: PurchaseSItemDetail) {
    let ItemIndex = this.purchaseItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.purchaseItemDetailsList[ItemIndex].AutoID > 0) {
      this.purchaseItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.purchaseItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.purchaseItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.purchaseItemDetailsListData = [
      ...this.purchaseItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.purchaseItemDetailsListData.length;
    this.CalculateFinalTotals();
  }

  ResetForm(form: FormGroup) {
    let control: AbstractControl;
    form.reset({
      BookAccountID: '',
      BillDate: '',
      BillNo: '',
      RefNo: '',
      AccountID: '',
      AccountTradeTypeID: '',
      TotalAmount: 0,
      TotalDiscAmount: 0,
      TotalTaxableAmount: 0,
      TotalCGSTAmount: 0,
      TotalSGSTAmount: 0,
      TotalIGSTAmount: 0,
      TotalCessAmount: 0,
      TotalTaxAmount: 0,
      TotalNetAmount: 0,
      RoundOffAmount: 0,
      NetAmount: 0,
      Items: {
        I_ItemID: '',
        I_Amount: 0,
        I_DiscPer: 0,
        I_DiscAmount: 0,
        I_TaxableAmount: 0,
        I_GSTTaxID: '',
        I_CGSTAmount: 0,
        I_SGSTAmount: 0,
        I_IGSTAmount: 0,
        I_CessAmount: 0,
        I_TotalTaxAmount: 0,
        I_NetAmount: 0,
      },
    });
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    this.purchaseItemDetailsList = [];
    this.purchaseItemDetailsListData = [...this.purchaseItemDetailsList];
    this.InvoiceType = '';
    this.I_ItemIDControl.setValue('');
    this.DisableAddItemBtn = true;
    this.SetMinMaxBillDate();
  }

  ResetItems() {
    this.ItemsControl.reset({
      I_ItemID: '',
      I_Amount: 0,
      I_DiscPer: 0,
      I_DiscAmount: 0,
      I_TaxableAmount: 0,
      I_GSTTaxID: '',
      I_CGSTAmount: 0,
      I_SGSTAmount: 0,
      I_IGSTAmount: 0,
      I_CessAmount: 0,
      I_TotalTaxAmount: 0,
      I_NetAmount: 0,
    });
    this.ItemsControl.markAsUntouched();
    this.renderer.selectRootElement('#ItemName').focus();
    this.CurrentItem = undefined;
    this.CurrentTax = undefined;
  }

  OnAccountBlur() {
    if (
      this.AutoAccountID?.isOpen == false &&
      this.AccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#AccountName').focus();
    }
  }

  OnItemblur() {
    if (this.AutoItemID?.isOpen == false) {
      if (
        this.I_ItemIDControl.value == '' &&
        this.purchaseItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName').focus();
      } else if (
        this.I_ItemIDControl.value == '' &&
        this.purchaseItemDetailsList.length > 0
      ) {
        // Need to Change
        this.renderer.selectRootElement('#OtherAddText').focus();
      }
    }
  }
  //Controls

  get BookAccountIDControl() {
    return this.purchaseForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.purchaseForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.purchaseForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.purchaseForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.purchaseForm.get('AccountID') as FormControl;
  }

  get AccountTradeTypeIDControl() {
    return this.purchaseForm.get('AccountTradeTypeID') as FormControl;
  }

  get TotalAmountControl() {
    return this.purchaseForm.get('TotalAmount') as FormControl;
  }
  get TotalDiscAmountControl() {
    return this.purchaseForm.get('TotalDiscAmount') as FormControl;
  }
  get TotalTaxableAmountControl() {
    return this.purchaseForm.get('TotalTaxableAmount') as FormControl;
  }
  get TotalCGSTAmountControl() {
    return this.purchaseForm.get('TotalCGSTAmount') as FormControl;
  }
  get TotalSGSTAmountControl() {
    return this.purchaseForm.get('TotalSGSTAmount') as FormControl;
  }
  get TotalIGSTAmountControl() {
    return this.purchaseForm.get('TotalIGSTAmount') as FormControl;
  }
  get TotalCessAmountControl() {
    return this.purchaseForm.get('TotalCessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.purchaseForm.get('TotalTaxAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.purchaseForm.get('TotalNetAmount') as FormControl;
  }
  get RoundOffAmountControl() {
    return this.purchaseForm.get('RoundOffAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.purchaseForm.get('NetAmount') as FormControl;
  }

  get ItemsControl() {
    return this.purchaseForm.get('Items') as FormControl;
  }

  get I_ItemIDControl() {
    return this.ItemsControl.get('I_ItemID') as FormControl;
  }
  get I_AmountControl() {
    return this.ItemsControl.get('I_Amount') as FormControl;
  }
  get I_DiscPerControl() {
    return this.ItemsControl.get('I_DiscPer') as FormControl;
  }
  get I_DiscAmountControl() {
    return this.ItemsControl.get('I_DiscAmount') as FormControl;
  }
  get I_TaxableAmountControl() {
    return this.ItemsControl.get('I_TaxableAmount') as FormControl;
  }
  get I_GSTTaxIDControl() {
    return this.ItemsControl.get('I_GSTTaxID') as FormControl;
  }
  get I_CGSTAmountControl() {
    return this.ItemsControl.get('I_CGSTAmount') as FormControl;
  }
  get I_SGSTAmountControl() {
    return this.ItemsControl.get('I_SGSTAmount') as FormControl;
  }
  get I_IGSTAmountControl() {
    return this.ItemsControl.get('I_IGSTAmount') as FormControl;
  }
  get I_CessAmountControl() {
    return this.ItemsControl.get('I_CessAmount') as FormControl;
  }
  get I_TotalTaxAmountControl() {
    return this.ItemsControl.get('I_TotalTaxAmount') as FormControl;
  }
  get I_NetAmountControl() {
    return this.ItemsControl.get('I_NetAmount') as FormControl;
  }

  //Others

  GetNewBillNo() {
    if (this.isEditMode == false) {
      let BookId = this.BookAccountIDControl.value;
      let BillDate = this.BillDateControl.value.format('YYYY-MM-DD');
      if (BookId != '' && BillDate != '') {
        this.purchaseService
          .GetNextBillNo(BookId, BillDate)
          .subscribe((response) => {
            this.BillNoControl.setValue(response);
          });
      }
    }
  }

  DiscPerChange(event: any) {
    if (event.keyCode != 9 && event.keyCode != 13) {
      this.IsDiscPerChange = true;
      this.CalculateTotals();
    }
  }

  SchPerChange(event: any) {
    if (event.keyCode != 9 && event.keyCode != 13) {
      this.IsSchPerChange = true;
      this.CalculateTotals();
    }
  }

  CalculateTotals() {
    let Amount = 0,
      DiscAmount = 0,
      TaxableAmount = 0,
      CGSTAmount = 0,
      SGSTAmount = 0,
      IGSTAmount = 0,
      CessAmount = 0,
      TotalTaxAmount = 0,
      GrossAmount = 0,
      SchAmount = 0,
      NetAmount = 0;

    Amount = Number(this.I_AmountControl.value);

    if (this.IsDiscPerChange) {
      DiscAmount = Amount * (Number(this.I_DiscPerControl.value) / 100);
    } else {
      DiscAmount = Number(this.I_DiscAmountControl.value);
    }

    TaxableAmount = Amount - DiscAmount;
    if (this.IsIGSTInvoice) {
      IGSTAmount = TaxableAmount * (Number(this.CurrentTax?.igstRate) / 100);
    } else {
      CGSTAmount = TaxableAmount * (Number(this.CurrentTax?.cgstRate) / 100);
      SGSTAmount = TaxableAmount * (Number(this.CurrentTax?.sgstRate) / 100);
    }

    if (Number(this.CurrentTax?.cessRate) > 0) {
      CessAmount = TaxableAmount * (Number(this.CurrentTax?.cessRate) / 100);
    }

    TotalTaxAmount = CGSTAmount + SGSTAmount + IGSTAmount + CessAmount;

    GrossAmount = TaxableAmount + TotalTaxAmount;

    NetAmount = GrossAmount - SchAmount;

    this.I_AmountControl.setValue(SetFormatCurrency(Amount));
    if (this.IsDiscPerChange == true) {
      this.I_DiscAmountControl.setValue(SetFormatCurrency(DiscAmount));
    }
    this.I_TaxableAmountControl.setValue(SetFormatCurrency(TaxableAmount));
    this.I_CGSTAmountControl.setValue(SetFormatCurrency(CGSTAmount));
    this.I_SGSTAmountControl.setValue(SetFormatCurrency(SGSTAmount));
    this.I_IGSTAmountControl.setValue(SetFormatCurrency(IGSTAmount));
    this.I_CessAmountControl.setValue(SetFormatCurrency(CessAmount));
    this.I_TotalTaxAmountControl.setValue(SetFormatCurrency(TotalTaxAmount));
    this.I_NetAmountControl.setValue(SetFormatCurrency(NetAmount));
    this.IsDiscPerChange = false;
    this.IsSchPerChange = false;
  }

  CalculateFinalTotals() {
    let TotalAmount = 0,
      TotalDiscAmount = 0,
      TotalTaxableAmount = 0,
      TotalCGSTAmount = 0,
      TotalSGSTAmount = 0,
      TotalIGSTAmount = 0,
      TotalCessAmount = 0,
      TotalTaxAmount = 0,
      TotalNetAmount = 0;

    this.purchaseItemDetailsList.forEach((element) => {
      if (element.IsDeleted == false) {
        TotalAmount = Number(TotalAmount) + Number(element.Amount);
        TotalDiscAmount = Number(TotalDiscAmount) + Number(element.DiscAmount);
        TotalTaxableAmount =
          Number(TotalTaxableAmount) + Number(element.TaxableAmount);
        TotalCGSTAmount = Number(TotalCGSTAmount) + Number(element.CGSTAmount);
        TotalSGSTAmount = Number(TotalSGSTAmount) + Number(element.SGSTAmount);
        TotalIGSTAmount = Number(TotalIGSTAmount) + Number(element.IGSTAmount);
        TotalCessAmount = Number(TotalCessAmount) + Number(element.CessAmount);
        TotalTaxAmount =
          Number(TotalTaxAmount) + Number(element.TotalTaxAmount);
        TotalNetAmount = Number(TotalNetAmount) + Number(element.NetAmount);
      }
    });

    this.TotalAmountControl.setValue(SetFormatCurrency(TotalAmount));
    this.TotalDiscAmountControl.setValue(SetFormatCurrency(TotalDiscAmount));
    this.TotalTaxableAmountControl.setValue(
      SetFormatCurrency(TotalTaxableAmount)
    );
    this.TotalCGSTAmountControl.setValue(SetFormatCurrency(TotalCGSTAmount));
    this.TotalSGSTAmountControl.setValue(SetFormatCurrency(TotalSGSTAmount));
    this.TotalIGSTAmountControl.setValue(SetFormatCurrency(TotalIGSTAmount));
    this.TotalCessAmountControl.setValue(SetFormatCurrency(TotalCessAmount));
    this.TotalTaxAmountControl.setValue(SetFormatCurrency(TotalTaxAmount));
    this.TotalNetAmountControl.setValue(SetFormatCurrency(TotalNetAmount));

    this.CalculateNetAmount();
  }

  CalculateNetAmount() {
    let RoundOffAmount = 0,
      NetAmount = 0,
      TotalNetAmount = 0;

    TotalNetAmount = Number(this.TotalNetAmountControl.value.replace(/,/g, ''));

    NetAmount = Math.round(Number(TotalNetAmount));
    RoundOffAmount = NetAmount - TotalNetAmount;

    this.RoundOffAmountControl.setValue(SetFormatCurrency(RoundOffAmount));
    this.NetAmountControl.setValue(SetFormatCurrency(NetAmount));
  }

  //Private Methods

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsDropDown.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }

  private _filterItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.itemsDropDown.filter((option) =>
      option.item_Name.toLowerCase().includes(filterValue)
    );
  }
}
