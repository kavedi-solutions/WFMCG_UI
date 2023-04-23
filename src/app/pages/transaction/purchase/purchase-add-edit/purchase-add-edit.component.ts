import { formatNumber } from '@angular/common';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
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
  PurchaseItemDetail,
  Tax,
  TaxDownDownResponse,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
@Component({
  selector: 'app-purchase-add-edit',
  templateUrl: './purchase-add-edit.component.html',
  styleUrls: ['./purchase-add-edit.component.scss'],
})
export class PurchaseAddEditComponent implements OnInit {
  PageTitle: string = 'Create Purchase';
  buttonText: string = 'Add New Purchase';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedPurchaseId: number;
  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  purchaseItemDetailsList: PurchaseItemDetail[] = [];
  purchaseItemDetailsListData: PurchaseItemDetail[] = [];
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
  ItemEdit?: PurchaseItemDetail;
  ItemCount: number = 0;
  purchaseForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    TotalAmount: [0],
    TotalDiscAmount: [0],
    TotalCGSTAmount: [0],
    TotalSGSTAmount: [0],
    TotalIGSTAmount: [0],
    TotalCessAmount: [0],
    TotalGrossAmount: [0],
    TotalSchAmount: [0],
    TotalNetAmount: [0],
    OtherAddText: [
      '',
      Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
    ],
    OtherAddAmount: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
    OtherLessText: [
      '',
      Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
    ],
    OtherLessAmount: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
    RoundOffAmount: [0],
    NetAmount: [0],
    Items: this.fb.group({
      ItemID: [''],
      Crt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      Pcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      Qty: [0],
      FreeCrt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      FreePcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      FreeQty: [0],
      TotalQty: [0],
      Rate: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      Amount: [0],
      DiscPer: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      DiscAmount: [0],
      GSTTaxID: [''],
      CGSTAmount: [0],
      SGSTAmount: [0],
      IGSTAmount: [0],
      CessAmount: [0],
      TotalTaxAmount: [0],
      GrossAmount: [0],
      SchPer: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      SchAmount: [0],
      NetAmount: [0],
    }),
  });

  @ViewChild('AutoItemID') AutoItemID?: MatAutocomplete;
  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private purchaseService: fromService.PurchaseService,
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
    this.selectedPurchaseId = 0;
    this.itemGroupDropDown = [];
    this.accountTradeTypeDropDown = [];
    this.taxDropDown = [];
    this.FillTaxDropDown();
    this.FillAccountTradeTypeDropDown('2');
    this.FillBooksDropDown();
    this.FillAccountDropDown();
    this.SetMinMaxBillDate();
  }

  ngOnInit(): void {
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
        //this.getAccountByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }

    this.filteredaccountsDropDown = this.AccountIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.account_Name;
        return name
          ? this._filterAccount(name as string)
          : this.accountsDropDown.slice();
      })
    );

    this.filtereditemsDropDown = this.ItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterItems(name as string)
          : this.itemsDropDown.slice();
      })
    );
  }

  setColumns() {
    this.columns = defaultData.GetPurchaseItemDetailColumns();
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
      this.router.navigate(['/transaction/purchase/list']);
    }
  }

  SaveUpdatePurchase(purchaseForm: FormGroup) {}

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

  FillBooksDropDown() {
    let filters = {
      GroupID: 0,
      BalanceTransferToID: 0,
      AccountTypeID: 4,
      TransactionTypeID: 6,
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
      IsServiceItem: false,
      AccountTradeTypeID: AccountTradeTypeID,
    };
    this.itemService.ItemDropDown(filters).subscribe((response) => {
      this.itemsDropDown = response;
      this.ItemIDControl.setValue('');
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

  AccountTradeTypeChange(event: any) {
    this.FillItemDropDown(Number(event));
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
      let ItemDetail: PurchaseItemDetail = this.purchaseItemDetailsList.filter(
        (a) => a.ItemID == event.option.value.item_Id
      )[0];
      this.CrtControl.setValue(ItemDetail.Crt);
      this.PcsControl.setValue(ItemDetail.Pcs);
      this.QtyControl.setValue(ItemDetail.Qty);
      this.FreeCrtControl.setValue(ItemDetail.FCrt);
      this.FreePcsControl.setValue(ItemDetail.FPcs);
      this.FreeQtyControl.setValue(ItemDetail.FQty);
      this.TotalQtyControl.setValue(ItemDetail.TQty);

      this.RateControl.setValue(ItemDetail.Rate);
      this.AmountControl.setValue(ItemDetail.Amount);
      this.DiscPerControl.setValue(ItemDetail.DiscPer);
      this.DiscAmountControl.setValue(ItemDetail.DiscAmount);
      this.GSTTaxIDControl.setValue(ItemDetail.GSTTaxID.toString());
      this.CGSTAmountControl.setValue(ItemDetail.CGSTAmount);
      this.SGSTAmountControl.setValue(ItemDetail.SGSTAmount);
      this.IGSTAmountControl.setValue(ItemDetail.IGSTAmount);
      this.CessAmountControl.setValue(ItemDetail.CessAmount);
      this.GrossAmountControl.setValue(ItemDetail.GrossAmount);
      this.SchPerControl.setValue(ItemDetail.SchPer);
      this.SchAmountControl.setValue(ItemDetail.SchAmount);
      this.ItemNetAmountControl.setValue(ItemDetail.NetAmount);
      this.CalculateTotals();
      this.IsItemEditMode = true;
    } else {
      this.itemService
        .GetItembyID(event.option.value.item_Id)
        .subscribe((response) => {
          this.CurrentItem = response;
          this.GetCurrentStock(Number(this.CurrentItem?.itemID));
          this.RateControl.setValue(
            SetFormatCurrency(this.CurrentItem?.purchaseRate)
          );
          this.GSTTaxIDControl.setValue(this.CurrentItem?.gstTaxID.toString());
          this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID));
        });
    }
  }

  GetCurrentTax(TaxID: number) {
    this.taxService.GetTaxbyID(TaxID).subscribe((response) => {
      this.CurrentTax = response;
    });
  }

  GetCurrentStock(ItemID: number) {
    //stockService
    this.stockService.GetClosingByItemID(ItemID).subscribe((response) => {
      this.CurrentStock = response;
    });
  }

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.purchaseItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.ItemIDControl.value.item_Id)
      );
      SrNo = this.purchaseItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.purchaseItemDetailsList.length + 1;
    }

    let ItemDetails: PurchaseItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.ItemIDControl.value.item_Id),
      ItemName: this.ItemIDControl.value.item_Name,
      Crt: CheckIsNumber(this.CrtControl.value),
      Pcs: CheckIsNumber(this.PcsControl.value),
      Qty: CheckIsNumber(this.QtyControl.value),
      FCrt: CheckIsNumber(this.FreeCrtControl.value),
      FPcs: CheckIsNumber(this.FreePcsControl.value),
      FQty: CheckIsNumber(this.FreeQtyControl.value),
      TQty: CheckIsNumber(this.TotalQtyControl.value),
      Rate: CheckIsNumber(this.RateControl.value),
      Amount: CheckIsNumber(this.AmountControl.value),
      DiscPer: CheckIsNumber(this.DiscPerControl.value),
      DiscAmount: CheckIsNumber(this.DiscAmountControl.value),
      GSTTaxID: CheckIsNumber(this.GSTTaxIDControl.value),
      GSTTaxName: this.CurrentTax?.taxName?.toString(),
      CGSTAmount: CheckIsNumber(this.CGSTAmountControl.value),
      SGSTAmount: CheckIsNumber(this.SGSTAmountControl.value),
      IGSTAmount: CheckIsNumber(this.IGSTAmountControl.value),
      CessAmount: CheckIsNumber(this.CessAmountControl.value),
      TotalTaxAmount: CheckIsNumber(this.TotalTaxAmountControl.value),
      GrossAmount: CheckIsNumber(this.GrossAmountControl.value),
      SchPer: CheckIsNumber(this.SchPerControl.value),
      SchAmount: CheckIsNumber(this.SchAmountControl.value),
      NetAmount: CheckIsNumber(this.ItemNetAmountControl.value),
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
    this.purchaseItemDetailsListData = [...this.purchaseItemDetailsList];

    this.ItemCount = this.purchaseItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: PurchaseItemDetail) {
    let SeletedItem: itemsDropDownResponse;
    SeletedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemsControl.patchValue({
      ItemID: SeletedItem,
      Crt: record.Crt,
      Pcs: record.Pcs,
      Qty: record.Qty,
      FreeCrt: record.FQty,
      FreePcs: record.FPcs,
      FreeQty: record.FQty,
      TotalQty: record.TQty,
      Rate: SetFormatCurrency(record.Rate),
      Amount: SetFormatCurrency(record.Amount),
      DiscPer: SetFormatCurrency(record.DiscPer),
      DiscAmount: SetFormatCurrency(record.DiscAmount),
      GSTTaxID: record.GSTTaxID.toString(),
      CGSTAmount: SetFormatCurrency(record.CGSTAmount),
      SGSTAmount: SetFormatCurrency(record.SGSTAmount),
      IGSTAmount: SetFormatCurrency(record.IGSTAmount),
      CessAmount: SetFormatCurrency(record.CessAmount),
      TotalTaxAmount: record.TotalTaxAmount,
      GrossAmount: SetFormatCurrency(record.GrossAmount),
      SchPer: SetFormatCurrency(record.SchPer),
      SchAmount: SetFormatCurrency(record.SchAmount),
      NetAmount: SetFormatCurrency(record.NetAmount),
    });
    this.IsItemEditMode = true;
    this.renderer.selectRootElement('#ItemName').focus();
    this.itemService.GetItembyID(record.ItemID).subscribe((response) => {
      this.CurrentItem = response;
      this.GetCurrentStock(Number(this.CurrentItem?.itemID));
      this.RateControl.setValue(
        SetFormatCurrency(this.CurrentItem?.purchaseRate)
      );
      this.GetCurrentTax(Number(record.GSTTaxID));
    });
  }

  deleteItem(record: PurchaseItemDetail) {
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

    this.purchaseItemDetailsListData = [...this.purchaseItemDetailsList];
    this.ItemCount = this.purchaseItemDetailsListData.length;
    this.CalculateFinalTotals();
  }

  ResetItems() {
    this.ItemsControl.reset();
    this.ItemsControl.markAsUntouched();
    this.ItemIDControl.setValue('');
    this.CrtControl.setValue(0);
    this.PcsControl.setValue(0);
    this.QtyControl.setValue(0);
    this.FreeCrtControl.setValue(0);
    this.FreePcsControl.setValue(0);
    this.FreeQtyControl.setValue(0);
    this.TotalQtyControl.setValue(0);
    this.RateControl.setValue(0);
    this.AmountControl.setValue(0);
    this.DiscPerControl.setValue(0);
    this.DiscAmountControl.setValue(0);
    this.GSTTaxIDControl.setValue('');
    this.CGSTAmountControl.setValue(0);
    this.SGSTAmountControl.setValue(0);
    this.IGSTAmountControl.setValue(0);
    this.CessAmountControl.setValue(0);
    this.TotalTaxAmountControl.setValue(0);
    this.GrossAmountControl.setValue(0);
    this.SchPerControl.setValue(0);
    this.SchAmountControl.setValue(0);
    this.ItemNetAmountControl.setValue(0);
    this.renderer.selectRootElement('#ItemName').focus();
    this.CurrentItem = undefined;
    this.CurrentStock = undefined;
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
        this.ItemIDControl.value == '' &&
        this.purchaseItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName').focus();
      } else if (
        this.ItemIDControl.value == '' &&
        this.purchaseItemDetailsList.length > 0
      ) {
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
  get TotalGrossAmountControl() {
    return this.purchaseForm.get('TotalGrossAmount') as FormControl;
  }
  get TotalSchAmountControl() {
    return this.purchaseForm.get('TotalSchAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.purchaseForm.get('TotalNetAmount') as FormControl;
  }
  get OtherAddTextControl() {
    return this.purchaseForm.get('OtherAddText') as FormControl;
  }
  get OtherAddAmountControl() {
    return this.purchaseForm.get('OtherAddAmount') as FormControl;
  }
  get OtherLessTextControl() {
    return this.purchaseForm.get('OtherLessText') as FormControl;
  }
  get OtherLessAmountControl() {
    return this.purchaseForm.get('OtherLessAmount') as FormControl;
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

  get ItemIDControl() {
    return this.ItemsControl.get('ItemID') as FormControl;
  }

  get CrtControl() {
    return this.ItemsControl.get('Crt') as FormControl;
  }
  get PcsControl() {
    return this.ItemsControl.get('Pcs') as FormControl;
  }
  get QtyControl() {
    return this.ItemsControl.get('Qty') as FormControl;
  }
  get FreeCrtControl() {
    return this.ItemsControl.get('FreeCrt') as FormControl;
  }
  get FreePcsControl() {
    return this.ItemsControl.get('FreePcs') as FormControl;
  }
  get FreeQtyControl() {
    return this.ItemsControl.get('FreeQty') as FormControl;
  }
  get TotalQtyControl() {
    return this.ItemsControl.get('TotalQty') as FormControl;
  }
  get RateControl() {
    return this.ItemsControl.get('Rate') as FormControl;
  }
  get AmountControl() {
    return this.ItemsControl.get('Amount') as FormControl;
  }
  get DiscPerControl() {
    return this.ItemsControl.get('DiscPer') as FormControl;
  }
  get DiscAmountControl() {
    return this.ItemsControl.get('DiscAmount') as FormControl;
  }
  get GSTTaxIDControl() {
    return this.ItemsControl.get('GSTTaxID') as FormControl;
  }
  get CGSTAmountControl() {
    return this.ItemsControl.get('CGSTAmount') as FormControl;
  }
  get SGSTAmountControl() {
    return this.ItemsControl.get('SGSTAmount') as FormControl;
  }
  get IGSTAmountControl() {
    return this.ItemsControl.get('IGSTAmount') as FormControl;
  }
  get CessAmountControl() {
    return this.ItemsControl.get('CessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.ItemsControl.get('TotalTaxAmount') as FormControl;
  }
  get GrossAmountControl() {
    return this.ItemsControl.get('GrossAmount') as FormControl;
  }
  get SchPerControl() {
    return this.ItemsControl.get('SchPer') as FormControl;
  }
  get SchAmountControl() {
    return this.ItemsControl.get('SchAmount') as FormControl;
  }
  get ItemNetAmountControl() {
    return this.ItemsControl.get('NetAmount') as FormControl;
  }

  //Others

  GetNewBillNo() {
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
      FreeQty = 0,
      TotalQty = 0,
      Amount = 0,
      DiscAmount = 0,
      TaxableAmount = 0,
      CGSTAmount = 0,
      SGSTAmount = 0,
      IGSTAmount = 0,
      CessAmount = 0,
      GrossAmount = 0,
      SchAmount = 0,
      NetAmount = 0;

    Rate = CheckIsNumber(this.RateControl.value);
    RatePerPcs = Rate / Number(this.CurrentItem?.packing);
    Qty =
      Number(this.CrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.PcsControl.value);
    FreeQty =
      Number(this.FreeCrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.FreePcsControl.value);

    TotalQty = Qty + FreeQty;
    this.DisableAddItemBtn = true;
    if (TotalQty > 0) {
      this.DisableAddItemBtn = false;
    }
    Amount =
      Number(this.CrtControl.value) * Rate +
      Number(this.PcsControl.value) * RatePerPcs;

    if (this.IsDiscPerChange) {
      DiscAmount = Amount * (Number(this.DiscPerControl.value) / 100);
    } else {
      DiscAmount = Number(this.DiscAmountControl.value);
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

    GrossAmount =
      TaxableAmount + CGSTAmount + SGSTAmount + IGSTAmount + CessAmount;

    if (this.IsSchPerChange) {
      SchAmount = GrossAmount * (Number(this.SchPerControl.value) / 100);
    } else {
      SchAmount = Number(this.SchAmountControl.value);
    }

    NetAmount = GrossAmount - SchAmount;

    this.QtyControl.setValue(Qty);
    this.FreeQtyControl.setValue(FreeQty);
    this.TotalQtyControl.setValue(TotalQty);
    this.AmountControl.setValue(SetFormatCurrency(Amount));
    if (this.IsDiscPerChange == true) {
      this.DiscAmountControl.setValue(SetFormatCurrency(DiscAmount));
    }
    this.CGSTAmountControl.setValue(SetFormatCurrency(CGSTAmount));
    this.SGSTAmountControl.setValue(SetFormatCurrency(SGSTAmount));
    this.IGSTAmountControl.setValue(SetFormatCurrency(IGSTAmount));
    this.CessAmountControl.setValue(SetFormatCurrency(CessAmount));
    this.GrossAmountControl.setValue(SetFormatCurrency(GrossAmount));
    if (this.IsSchPerChange == true) {
      this.SchAmountControl.setValue(SetFormatCurrency(SchAmount));
    }
    this.ItemNetAmountControl.setValue(SetFormatCurrency(NetAmount));
    this.IsDiscPerChange = false;
    this.IsSchPerChange = false;
  }

  CalculateFinalTotals() {
    let TotalAmount = 0,
      TotalDiscAmount = 0,
      TotalCGSTAmount = 0,
      TotalSGSTAmount = 0,
      TotalIGSTAmount = 0,
      TotalCessAmount = 0,
      TotalGrossAmount = 0,
      TotalSchAmount = 0,
      TotalNetAmount = 0;

    this.purchaseItemDetailsList.forEach((element) => {
      TotalAmount = Number(TotalAmount) + Number(element.Amount);
      TotalDiscAmount = Number(TotalDiscAmount) + Number(element.DiscAmount);
      TotalCGSTAmount = Number(TotalCGSTAmount) + Number(element.CGSTAmount);
      TotalSGSTAmount = Number(TotalSGSTAmount) + Number(element.SGSTAmount);
      TotalIGSTAmount = Number(TotalIGSTAmount) + Number(element.IGSTAmount);
      TotalCessAmount = Number(TotalCessAmount) + Number(element.CessAmount);
      TotalGrossAmount = Number(TotalGrossAmount) + Number(element.GrossAmount);
      TotalSchAmount = Number(TotalSchAmount) + Number(element.SchAmount);
      TotalNetAmount = Number(TotalNetAmount) + Number(element.NetAmount);
    });

    this.TotalAmountControl.setValue(SetFormatCurrency(TotalAmount));
    this.TotalDiscAmountControl.setValue(SetFormatCurrency(TotalDiscAmount));
    this.TotalCGSTAmountControl.setValue(SetFormatCurrency(TotalCGSTAmount));
    this.TotalSGSTAmountControl.setValue(SetFormatCurrency(TotalSGSTAmount));
    this.TotalIGSTAmountControl.setValue(SetFormatCurrency(TotalIGSTAmount));
    this.TotalCessAmountControl.setValue(SetFormatCurrency(TotalCessAmount));
    this.TotalGrossAmountControl.setValue(SetFormatCurrency(TotalGrossAmount));
    this.TotalSchAmountControl.setValue(SetFormatCurrency(TotalSchAmount));
    this.TotalNetAmountControl.setValue(SetFormatCurrency(TotalNetAmount));

    this.CalculateNetAmount();
  }

  CalculateNetAmount() {
    let RoundOffAmount = 0,
      NetAmount = 0,
      OtherAddAmount = 0,
      OtherLessAmount = 0,
      AfterAddLessAmount = 0,
      TotalNetAmount = 0;

    TotalNetAmount = Number(this.TotalNetAmountControl.value.replace(/,/g, ''));
    OtherAddAmount = CheckIsNumber(this.OtherAddAmountControl.value);
    OtherLessAmount = CheckIsNumber(this.OtherLessAmountControl.value);

    AfterAddLessAmount = TotalNetAmount + OtherAddAmount - OtherLessAmount;

    NetAmount = Math.round(Number(AfterAddLessAmount));
    RoundOffAmount = NetAmount - AfterAddLessAmount;

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
