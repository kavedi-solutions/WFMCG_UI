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
  AccountTypeMaster,
  ClosingStockbyItemID,
  Item,
  ItemFilter_DropDown,
  ItemGroupDownDownResponse,
  itemsDropDownResponse,
  PurchaseReturnItemDetail,
  PurchaseReturnItemPostRequest,
  PurchaseReturnItemPutRequest,
  PurchaseReturnPostRequest,
  PurchaseReturnPutRequest,
  PurchaseReturnResponse,
  returnTypeResponse,
  Tax,
  TaxDownDownResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import {
  CheckIsNumber,
  SetFormatCurrency,
  RoundOffAmount,
} from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-purchase-return-add-edit',
  templateUrl: './purchase-return-add-edit.component.html',
  styleUrls: ['./purchase-return-add-edit.component.scss'],
})
export class PurchaseReturnAddEditComponent implements OnInit {
  PageTitle: string = 'Create Purchase Return';
  buttonText: string = 'Add New Purchase Return';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedPurchaseReturnId: number;
  AccountTradeTypeID: Number = 0;
  ReturnTypeID: Number = 0;
  InvoiceID: number = 0;
  purchaseReturnPostRequest?: PurchaseReturnPostRequest;
  purchaseReturnPutRequest?: PurchaseReturnPutRequest;
  editPurchaseReturn?: PurchaseReturnResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  purchaseReturnItemDetailsList: PurchaseReturnItemDetail[] = [];
  purchaseReturnItemDetailsListData: PurchaseReturnItemDetail[] = [];
  CurrentItem?: Item;
  CurrentTax?: Tax;
  CurrentStock?: ClosingStockbyItemID;
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
  ItemEdit?: PurchaseReturnItemDetail;
  ItemCount: number = 0;
  purchaseReturnForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    ReturnTypeID: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    TotalAmount: ['0'],
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
      I_Crt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Pcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Qty: [0],
      I_Rate: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Amount: [0],
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
    private purchaseReturnService: fromService.PurchaseReturnService,
    private accountService: fromService.AccountsService,
    private itemService: fromService.ItemService,
    private commonService: fromService.CommonService,
    private taxService: fromService.TaxService,
    private stockService: fromService.StockService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.setColumns();
    //this.AddTempItems();
    this.isEditMode = false;
    this.selectedPurchaseReturnId = 0;
    this.itemGroupDropDown = [];
    this.accountTradeTypeDropDown = [];
    this.taxDropDown = [];
    this.FillTaxDropDown();
    this.FillReturnTypeDropDown();
    this.FillAccountTradeTypeDropDown('2');
    this.FillBooksDropDown();
    this.FillAccountDropDown();
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
            this.selectedPurchaseReturnId = params['purchaseReturnid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedPurchaseReturnId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Purchase Return';
        this.getPurchaseReturnByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetPurchaseReturnItemDetailColumns();
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
      this.router.navigate(['/transaction/purchase-return/list']);
    } else {
      this.ResetForm(this.purchaseReturnForm);
    }
  }

  getPurchaseReturnByID() {
    this.purchaseReturnService
      .GetPurchaseReturnbyID(this.selectedPurchaseReturnId)
      .subscribe((response) => {
        this.editPurchaseReturn = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editPurchaseReturn?.accountID.toString()
        )[0];
        this.InvoiceID = this.editPurchaseReturn!.autoID!;

        this.purchaseReturnForm.patchValue({
          BookAccountID: this.editPurchaseReturn?.bookAccountID.toString(),
          BillNo: this.editPurchaseReturn?.billNo.toString(),
          RefNo: this.editPurchaseReturn?.refNo,
          AccountTradeTypeID:
            this.editPurchaseReturn?.accountTradeTypeID.toString(),
          ReturnTypeID: this.editPurchaseReturn?.returnTypeID.toString(),
          TotalAmount: SetFormatCurrency(this.editPurchaseReturn?.totalAmount),
          TotalCGSTAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalCGSTAmount
          ),
          TotalSGSTAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalSGSTAmount
          ),
          TotalIGSTAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalIGSTAmount
          ),
          TotalCessAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalCessAmount
          ),
          TotalTaxAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalTaxAmount
          ),
          TotalNetAmount: SetFormatCurrency(
            this.editPurchaseReturn?.totalNetAmount
          ),
          RoundOffAmount: SetFormatCurrency(
            this.editPurchaseReturn?.roundOffAmount
          ),
          NetAmount: SetFormatCurrency(this.editPurchaseReturn?.netAmount),
        });

        this.BillDateControl.setValue(
          moment(this.editPurchaseReturn?.billDate)
        );
        this.AccountIDControl.setValue(SeletedAccount);

        this.AccountTradeTypeChange(
          this.editPurchaseReturn?.accountTradeTypeID.toString()
        );

        this.ReturnTypeChange(this.editPurchaseReturn?.returnTypeID.toString());

        this.editPurchaseReturn!.details!.forEach((element) => {
          let ItemDetails: PurchaseReturnItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            ItemID: element.itemID,
            ItemName: element.itemName,
            Crt: element.crt,
            Pcs: element.pcs,
            Qty: element.quantity,
            Rate: element.rate,
            Amount: element.amount,
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
          this.purchaseReturnItemDetailsList.push(ItemDetails);
        });

        this.purchaseReturnItemDetailsListData = [
          ...this.purchaseReturnItemDetailsList.filter(
            (a) => a.IsDeleted == false
          ),
        ];
        this.ItemCount = this.purchaseReturnItemDetailsListData.length;
      });
  }

  SaveUpdatePurchaseReturn(purchaseReturnForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdatePurchaseReturn(purchaseReturnForm);
    } else {
      this.SavePurchaseReturn(purchaseReturnForm);
    }
  }

  SavePurchaseReturn(purchaseReturnForm: FormGroup) {
    let PostRequestDetail: PurchaseReturnItemPostRequest[] = [];
    this.purchaseReturnItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        rate: element.Rate,
        amount: element.Amount,
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
    this.purchaseReturnPostRequest = {
      bookAccountID: Number(purchaseReturnForm.value.BookAccountID),
      billNo: Number(purchaseReturnForm.value.BillNo),
      refNo: purchaseReturnForm.value.RefNo,
      billDate: purchaseReturnForm.value.BillDate.format('YYYY-MM-DD'),
      returnTypeID: Number(purchaseReturnForm.value.ReturnTypeID),
      accountID: Number(purchaseReturnForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(purchaseReturnForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(purchaseReturnForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(purchaseReturnForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(purchaseReturnForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(purchaseReturnForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(purchaseReturnForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(purchaseReturnForm.value.NetAmount),
      details: PostRequestDetail,
      isActive: true,
    };
    this.purchaseReturnService
      .createPurchaseReturn(this.purchaseReturnPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdatePurchaseReturn(purchaseReturnForm: FormGroup) {
    let PutRequestDetail: PurchaseReturnItemPutRequest[] = [];
    this.purchaseReturnItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        rate: element.Rate,
        amount: element.Amount,
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
    this.purchaseReturnPutRequest = {
      bookAccountID: Number(purchaseReturnForm.value.BookAccountID),
      billNo: Number(purchaseReturnForm.value.BillNo),
      refNo: purchaseReturnForm.value.RefNo,
      billDate: purchaseReturnForm.value.BillDate.format('YYYY-MM-DD'),
      returnTypeID: Number(purchaseReturnForm.value.ReturnTypeID),
      accountID: Number(purchaseReturnForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(purchaseReturnForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(purchaseReturnForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(purchaseReturnForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(purchaseReturnForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(purchaseReturnForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(purchaseReturnForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(purchaseReturnForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(purchaseReturnForm.value.NetAmount),
      details: PutRequestDetail,
      isActive: true,
    };
    this.purchaseReturnService
      .updatePurchaseReturn(
        this.editPurchaseReturn!.autoID,
        this.purchaseReturnPutRequest
      )
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

  FillReturnTypeDropDown() {
    this.returnTypeDropDown = [];
    this.commonService
      .ReutnTypeDropDown()
      .subscribe((response: returnTypeResponse[]) => {
        this.returnTypeDropDown = response;
      });
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [TransactionTypeMaster.Purchase_Return],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  FillAccountDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Supplier],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
      this.AccountIDControl.setValue('');
    });
  }

  FillItemDropDown() {
    if (this.AccountTradeTypeID != 0 && this.ReturnTypeID != 0) {
      let filters: ItemFilter_DropDown = {
        ItemType: 1,
        AccountTradeTypeID: this.AccountTradeTypeID,
        TransactionTypeID: TransactionTypeMaster.Purchase_Return,
        ReturnTypeID: this.ReturnTypeID,
        InvoiceID: this.InvoiceID,
      };
      this.itemService.ItemDropDown(filters).subscribe((response) => {
        this.itemsDropDown = response;
        this.I_ItemIDControl.setValue('');
      });
    }
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

  AccountTradeTypeChange(event: any) {
    this.AccountTradeTypeID = Number(event);
    this.FillItemDropDown();
  }

  ReturnTypeChange(event: any) {
    this.ReturnTypeID = Number(event);
    this.FillItemDropDown();
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

    let FoundItem = this.purchaseReturnItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );
    this.itemService
      .GetItembyID(event.option.value.item_Id)
      .subscribe((response) => {
        this.CurrentItem = response;
        this.GetCurrentStock(Number(this.CurrentItem?.itemID));
        if (FoundItem == -1) {
          this.I_RateControl.setValue(
            SetFormatCurrency(this.CurrentItem?.purchaseRate)
          );
          this.I_GSTTaxIDControl.setValue(
            this.CurrentItem?.gstTaxID.toString()
          );
          this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID), false);
        } else {
          this.ItemEdit = this.purchaseReturnItemDetailsList[FoundItem];
          let ItemDetail: PurchaseReturnItemDetail =
            this.purchaseReturnItemDetailsList.filter(
              (a) => a.ItemID == event.option.value.item_Id
            )[0];

          this.I_CrtControl.setValue(ItemDetail.Crt);
          this.I_PcsControl.setValue(ItemDetail.Pcs);
          this.I_QtyControl.setValue(ItemDetail.Qty);
          this.I_RateControl.setValue(ItemDetail.Rate);
          this.I_AmountControl.setValue(ItemDetail.Amount);
          this.I_GSTTaxIDControl.setValue(ItemDetail.GSTTaxID.toString());
          this.I_CGSTAmountControl.setValue(ItemDetail.CGSTAmount);
          this.I_SGSTAmountControl.setValue(ItemDetail.SGSTAmount);
          this.I_IGSTAmountControl.setValue(ItemDetail.IGSTAmount);
          this.I_CessAmountControl.setValue(ItemDetail.CessAmount);
          this.I_NetAmountControl.setValue(ItemDetail.NetAmount);
          this.GetCurrentTax(Number(ItemDetail.GSTTaxID), true);
          this.IsItemEditMode = true;
        }
      });
  }

  GSTTaxChange(event: any) {
    this.GetCurrentTax(Number(event.value), true);
  }

  GetCurrentTax(TaxID: number, calculateTotal: boolean) {
    this.taxService.GetTaxbyID(TaxID).subscribe((response) => {
      this.CurrentTax = response;
      if (calculateTotal == true) this.CalculateTotals();
    });
  }

  GetCurrentStock(ItemID: number) {
    //stockService
    let ReturnTypeID = Number(this.ReturnTypeIDControl.value);
    this.stockService
      .GetClosingByItemID(ItemID, ReturnTypeID)
      .subscribe((response) => {
        this.CurrentStock = response;
      });
  }

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.purchaseReturnItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.purchaseReturnItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.purchaseReturnItemDetailsList.length + 1;
    }

    let ItemDetails: PurchaseReturnItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.I_ItemIDControl.value.item_Id),
      ItemName: this.I_ItemIDControl.value.item_Name,
      Crt: CheckIsNumber(this.I_CrtControl.value),
      Pcs: CheckIsNumber(this.I_PcsControl.value),
      Qty: CheckIsNumber(this.I_QtyControl.value),
      Rate: CheckIsNumber(this.I_RateControl.value),
      Amount: CheckIsNumber(this.I_AmountControl.value),
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
      this.purchaseReturnItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.purchaseReturnItemDetailsList.push(ItemDetails);
    }
    this.purchaseReturnItemDetailsListData = [
      ...this.purchaseReturnItemDetailsList.filter((a) => a.IsDeleted == false),
    ];

    this.ItemCount = this.purchaseReturnItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: PurchaseReturnItemDetail) {
    let SeletedItem: itemsDropDownResponse;
    SeletedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_ItemID: SeletedItem,
      I_Crt: record.Crt,
      I_Pcs: record.Pcs,
      I_Qty: record.Qty,
      I_Rate: SetFormatCurrency(record.Rate),
      I_Amount: SetFormatCurrency(record.Amount),
      I_GSTTaxID: record.GSTTaxID.toString(),
      I_CGSTAmount: SetFormatCurrency(record.CGSTAmount),
      I_SGSTAmount: SetFormatCurrency(record.SGSTAmount),
      I_IGSTAmount: SetFormatCurrency(record.IGSTAmount),
      I_CessAmount: SetFormatCurrency(record.CessAmount),
      I_TotalTaxAmount: SetFormatCurrency(record.TotalTaxAmount),
      I_NetAmount: SetFormatCurrency(record.NetAmount),
    });
    this.IsItemEditMode = true;
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.itemService.GetItembyID(record.ItemID).subscribe((response) => {
      this.CurrentItem = response;
      this.GetCurrentStock(Number(this.CurrentItem?.itemID));
      this.I_RateControl.setValue(
        SetFormatCurrency(this.CurrentItem?.purchaseRate)
      );
      this.GetCurrentTax(Number(record.GSTTaxID), false);
    });
  }

  deleteItem(record: PurchaseReturnItemDetail) {
    let ItemIndex = this.purchaseReturnItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.purchaseReturnItemDetailsList[ItemIndex].AutoID > 0) {
      this.purchaseReturnItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.purchaseReturnItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.purchaseReturnItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.purchaseReturnItemDetailsListData = [
      ...this.purchaseReturnItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.purchaseReturnItemDetailsListData.length;
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
      TotalGrossAmount: 0,
      TotalSchAmount: 0,
      TotalNetAmount: 0,
      OtherAddText: '',
      OtherAddAmount: 0,
      OtherLessText: '',
      OtherLessAmount: 0,
      RoundOffAmount: 0,
      NetAmount: 0,
      Items: {
        I_ItemID: '',
        I_Crt: 0,
        I_Pcs: 0,
        I_Qty: 0,
        I_Rate: 0,
        I_Amount: 0,
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
    this.purchaseReturnItemDetailsList = [];
    this.purchaseReturnItemDetailsListData = [
      ...this.purchaseReturnItemDetailsList,
    ];
    this.InvoiceType = '';
    this.I_ItemIDControl.setValue('');
    this.DisableAddItemBtn = true;
    this.SetMinMaxBillDate();
    this.renderer.selectRootElement('#BookAccountName', true).focus();
  }

  ResetItems() {
    this.ItemsControl.reset({
      I_ItemID: '',
      I_Crt: 0,
      I_Pcs: 0,
      I_Qty: 0,
      I_Rate: 0,
      I_Amount: 0,
      I_GSTTaxID: '',
      I_CGSTAmount: 0,
      I_SGSTAmount: 0,
      I_IGSTAmount: 0,
      I_CessAmount: 0,
      I_TotalTaxAmount: 0,
      I_NetAmount: 0,
    });
    this.ItemsControl.markAsUntouched();
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.CurrentItem = undefined;
    this.CurrentStock = undefined;
    this.CurrentTax = undefined;
  }

  OnAccountBlur() {
    if (
      this.AutoAccountID?.isOpen == false &&
      this.AccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#AccountName', true).focus();
    }
  }

  OnItemblur() {
    if (this.AutoItemID?.isOpen == false) {
      if (
        this.I_ItemIDControl.value == '' &&
        this.purchaseReturnItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName', true).focus();
      } else if (
        this.I_ItemIDControl.value == '' &&
        this.purchaseReturnItemDetailsList.length > 0
      ) {
        if (this.isEditMode == true) {
          this.renderer.selectRootElement('#UpdatePurchase', true).focus();
        } else {
          this.renderer.selectRootElement('#SavePurchase', true).focus();
        }
      }
    }
  }
  //Controls

  get BookAccountIDControl() {
    return this.purchaseReturnForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.purchaseReturnForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.purchaseReturnForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.purchaseReturnForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.purchaseReturnForm.get('AccountID') as FormControl;
  }

  get ReturnTypeIDControl() {
    return this.purchaseReturnForm.get('ReturnTypeID') as FormControl;
  }

  get AccountTradeTypeIDControl() {
    return this.purchaseReturnForm.get('AccountTradeTypeID') as FormControl;
  }

  get TotalAmountControl() {
    return this.purchaseReturnForm.get('TotalAmount') as FormControl;
  }
  get TotalCGSTAmountControl() {
    return this.purchaseReturnForm.get('TotalCGSTAmount') as FormControl;
  }
  get TotalSGSTAmountControl() {
    return this.purchaseReturnForm.get('TotalSGSTAmount') as FormControl;
  }
  get TotalIGSTAmountControl() {
    return this.purchaseReturnForm.get('TotalIGSTAmount') as FormControl;
  }
  get TotalCessAmountControl() {
    return this.purchaseReturnForm.get('TotalCessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.purchaseReturnForm.get('TotalTaxAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.purchaseReturnForm.get('TotalNetAmount') as FormControl;
  }
  get RoundOffAmountControl() {
    return this.purchaseReturnForm.get('RoundOffAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.purchaseReturnForm.get('NetAmount') as FormControl;
  }

  get ItemsControl() {
    return this.purchaseReturnForm.get('Items') as FormControl;
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
  get I_RateControl() {
    return this.ItemsControl.get('I_Rate') as FormControl;
  }
  get I_AmountControl() {
    return this.ItemsControl.get('I_Amount') as FormControl;
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
      let BookInit = this.booksDropDown.find(
        (a) => a.account_Id == BookId
      )?.bookInit;
      let BillDate = this.BillDateControl.value.format('YYYY-MM-DD');
      if (BookId != '' && BillDate != '') {
        this.purchaseReturnService
          .GetNextBillNo(BookId, BillDate)
          .subscribe((response) => {
            this.BillNoControl.setValue(response);
            let RefNo = BookInit + '-' + response;
            this.RefNoControl.setValue(RefNo);
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
    let Rate = 0,
      RatePerPcs = 0,
      Qty = 0,
      Amount = 0,
      CGSTAmount = 0,
      SGSTAmount = 0,
      IGSTAmount = 0,
      CessAmount = 0,
      TotalTaxAmount = 0,
      NetAmount = 0;

    Rate = CheckIsNumber(this.I_RateControl.value);
    RatePerPcs = Rate / Number(this.CurrentItem?.packing);
    Qty =
      Number(this.I_CrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.I_PcsControl.value);

    this.DisableAddItemBtn = true;
    if (Qty > 0) {
      this.DisableAddItemBtn = false;
    }
    Amount = RoundOffAmount(
      Number(this.I_CrtControl.value) * Rate +
        Number(this.I_PcsControl.value) * RatePerPcs,
      2
    );

    if (this.IsIGSTInvoice) {
      IGSTAmount = RoundOffAmount(
        Amount * (Number(this.CurrentTax?.igstRate) / 100),
        2
      );
    } else {
      CGSTAmount = RoundOffAmount(
        Amount * (Number(this.CurrentTax?.cgstRate) / 100),
        2
      );

      SGSTAmount = RoundOffAmount(
        Amount * (Number(this.CurrentTax?.sgstRate) / 100),
        2
      );
    }

    if (Number(this.CurrentTax?.cessRate) > 0) {
      CessAmount = RoundOffAmount(
        Amount * (Number(this.CurrentTax?.cessRate) / 100),
        2
      );
    }

    TotalTaxAmount = CGSTAmount + SGSTAmount + IGSTAmount + CessAmount;

    NetAmount = Amount + TotalTaxAmount;

    this.I_QtyControl.setValue(Qty);
    this.I_AmountControl.setValue(SetFormatCurrency(Amount));
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
      TotalCGSTAmount = 0,
      TotalSGSTAmount = 0,
      TotalIGSTAmount = 0,
      TotalCessAmount = 0,
      TotalTaxAmount = 0,
      TotalNetAmount = 0;

    this.purchaseReturnItemDetailsList.forEach((element) => {
      if (element.IsDeleted == false) {
        TotalAmount = Number(TotalAmount) + Number(element.Amount);
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
