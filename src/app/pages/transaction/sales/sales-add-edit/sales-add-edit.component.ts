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
  SalesItemDetail,
  SalesItemPostRequest,
  SalesItemPutRequest,
  SalesPostRequest,
  SalesPutRequest,
  SalesResponse,
  Tax,
  TaxDownDownResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-sales-add-edit',
  templateUrl: './sales-add-edit.component.html',
  styleUrls: ['./sales-add-edit.component.scss'],
})
export class SalesAddEditComponent implements OnInit {
  PageTitle: string = 'Create Sales (Inventory)';
  buttonText: string = 'Add New Sales';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedSalesId: number;

  salesPostRequest?: SalesPostRequest;
  salesPutRequest?: SalesPutRequest;
  editSales?: SalesResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  salesItemDetailsList: SalesItemDetail[] = [];
  salesItemDetailsListData: SalesItemDetail[] = [];
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
  ItemEdit?: SalesItemDetail;
  ItemCount: number = 0;
  salesForm = this.fb.group({
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
    TotalGrossAmount: ['0'],
    TotalSchAmount: ['0'],
    TotalNetAmount: ['0'],
    OtherAddText: [
      '',
      Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
    ],
    OtherAddAmount: ['0', [Validators.pattern(/^([0-9,-/+])+$/i)]],
    OtherLessText: [
      '',
      Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
    ],
    OtherLessAmount: ['0', [Validators.pattern(/^([0-9,-/+])+$/i)]],
    RoundOffAmount: ['0'],
    NetAmount: ['0'],
    Items: this.fb.group({
      I_ItemID: [''],
      I_Crt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Pcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_Qty: [0],
      I_FreeCrt: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_FreePcs: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_FreeQty: [0],
      I_TotalQty: [0],
      I_Rate: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
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
      I_GrossAmount: [0],
      I_SchPer: [0, [Validators.pattern(/^([0-9,-/+])+$/i)]],
      I_SchAmount: [0],
      I_NetAmount: [0],
    }),
  });

  @ViewChild('AutoItemID') AutoItemID?: MatAutocomplete;
  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private salesService: fromService.SalesService,
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
    this.selectedSalesId = 0;
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
            this.selectedSalesId = params['salesid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedSalesId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Sales';
        this.getSalesByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetSalesItemDetailColumns();
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
      this.router.navigate(['/transaction/sales/list']);
    } else {
      this.ResetForm(this.salesForm);
    }
  }

  getSalesByID() {
    this.salesService
      .GetSalesbyID(this.selectedSalesId)
      .subscribe((response) => {
        this.editSales = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editSales?.accountID.toString()
        )[0];

        this.salesForm.patchValue({
          BookAccountID: this.editSales?.bookAccountID.toString(),
          BillNo: this.editSales?.billNo.toString(),
          RefNo: this.editSales?.refNo,
          AccountTradeTypeID: this.editSales?.accountTradeTypeID.toString(),
          TotalAmount: SetFormatCurrency(this.editSales?.totalAmount),
          TotalDiscAmount: SetFormatCurrency(this.editSales?.totalDiscAmount),
          TotalTaxableAmount: SetFormatCurrency(
            this.editSales?.totalTaxableAmount
          ),
          TotalCGSTAmount: SetFormatCurrency(this.editSales?.totalCGSTAmount),
          TotalSGSTAmount: SetFormatCurrency(this.editSales?.totalSGSTAmount),
          TotalIGSTAmount: SetFormatCurrency(this.editSales?.totalIGSTAmount),
          TotalCessAmount: SetFormatCurrency(this.editSales?.totalCessAmount),
          TotalTaxAmount: SetFormatCurrency(this.editSales?.totalTaxAmount),
          TotalGrossAmount: SetFormatCurrency(this.editSales?.totalGrossAmount),
          TotalSchAmount: SetFormatCurrency(this.editSales?.totalSchAmount),
          TotalNetAmount: SetFormatCurrency(this.editSales?.totalNetAmount),
          OtherAddText: this.editSales?.otherAddText,
          OtherAddAmount: SetFormatCurrency(this.editSales?.otherAddAmount),
          OtherLessText: this.editSales?.otherLessText,
          OtherLessAmount: SetFormatCurrency(this.editSales?.otherLessAmount),
          RoundOffAmount: SetFormatCurrency(this.editSales?.roundOffAmount),
          NetAmount: SetFormatCurrency(this.editSales?.netAmount),
        });

        this.BillDateControl.setValue(moment(this.editSales?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);

        this.AccountTradeTypeChange(
          this.editSales?.accountTradeTypeID.toString()
        );

        this.editSales!.details!.forEach((element) => {
          let ItemDetails: SalesItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            ItemID: element.itemID,
            ItemName: element.itemName,
            Crt: element.crt,
            Pcs: element.pcs,
            Qty: element.quantity,
            FCrt: element.fCrt,
            FPcs: element.fPcs,
            FQty: element.freeQuantity,
            TQty: element.totalQuantity,
            Rate: element.rate,
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
            GrossAmount: element.grossAmount,
            SchPer: element.schPer,
            SchAmount: element.schAmount,
            NetAmount: element.netAmount,
            IsAdd: false,
            IsModified: false,
            IsDeleted: false,
          };
          this.salesItemDetailsList.push(ItemDetails);
        });

        this.salesItemDetailsListData = [
          ...this.salesItemDetailsList.filter((a) => a.IsDeleted == false),
        ];
        this.ItemCount = this.salesItemDetailsListData.length;
      });
  }

  SaveUpdateSales(salesForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateSales(salesForm);
    } else {
      this.SaveSales(salesForm);
    }
  }

  SaveSales(salesForm: FormGroup) {
    let PostRequestDetail: SalesItemPostRequest[] = [];
    this.salesItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        freeQuantity: element.FQty,
        totalQuantity: element.TQty,
        rate: element.Rate,
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
        grossAmount: element.GrossAmount,
        schPer: element.SchPer,
        schAmount: element.SchAmount,
        netAmount: element.NetAmount,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.salesPostRequest = {
      bookAccountID: Number(salesForm.value.BookAccountID),
      billNo: Number(salesForm.value.BillNo),
      refNo: salesForm.value.RefNo,
      billDate: salesForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(salesForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(salesForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(salesForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(salesForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(salesForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(salesForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesForm.value.TotalTaxAmount),
      totalGrossAmount: CheckIsNumber(salesForm.value.TotalGrossAmount),
      totalSchAmount: CheckIsNumber(salesForm.value.TotalSchAmount),
      totalNetAmount: CheckIsNumber(salesForm.value.TotalNetAmount),
      otherAddText: salesForm.value.OtherAddText,
      otherAddAmount: CheckIsNumber(salesForm.value.OtherAddAmount),
      otherLessText: salesForm.value.OtherLessText,
      otherLessAmount: CheckIsNumber(salesForm.value.OtherLessAmount),
      roundOffAmount: CheckIsNumber(salesForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(salesForm.value.NetAmount),
      details: PostRequestDetail,
      isActive: true,
    };
    this.salesService
      .createSales(this.salesPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateSales(salesForm: FormGroup) {
    let PutRequestDetail: SalesItemPutRequest[] = [];
    this.salesItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        itemID: element.ItemID,
        quantity: element.Qty,
        freeQuantity: element.FQty,
        totalQuantity: element.TQty,
        rate: element.Rate,
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
        grossAmount: element.GrossAmount,
        schPer: element.SchPer,
        schAmount: element.SchAmount,
        netAmount: element.NetAmount,
        isAdd: element.IsAdd,
        isModified: element.IsModified,
        isDeleted: element.IsDeleted,
      });
    });
    this.salesPutRequest = {
      bookAccountID: Number(salesForm.value.BookAccountID),
      billNo: Number(salesForm.value.BillNo),
      refNo: salesForm.value.RefNo,
      billDate: salesForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(salesForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(salesForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(salesForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(salesForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(salesForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(salesForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesForm.value.TotalTaxAmount),
      totalGrossAmount: CheckIsNumber(salesForm.value.TotalGrossAmount),
      totalSchAmount: CheckIsNumber(salesForm.value.TotalSchAmount),
      totalNetAmount: CheckIsNumber(salesForm.value.TotalNetAmount),
      otherAddText: salesForm.value.OtherAddText,
      otherAddAmount: CheckIsNumber(salesForm.value.OtherAddAmount),
      otherLessText: salesForm.value.OtherLessText,
      otherLessAmount: CheckIsNumber(salesForm.value.OtherLessAmount),
      roundOffAmount: CheckIsNumber(salesForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(salesForm.value.NetAmount),
      details: PutRequestDetail,
      isActive: true,
    };
    this.salesService
      .updateSales(this.editSales!.autoID, this.salesPutRequest)
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

  FillBooksDropDown() {
    let filters = {
      GroupID: 0,
      BalanceTransferToID: 0,
      AccountTypeID: AccountTypeMaster.Head_Books,
      TransactionTypeID: TransactionTypeMaster.Sales_Inventory,
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
      AccountTypeID: AccountTypeMaster.Customer,
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
      IsInventory: true,
      AccountTradeTypeID: AccountTradeTypeID,
      OnlyStockItems: true,
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

    let FoundItem = this.salesItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );
    if (FoundItem != -1) {
      this.ItemEdit = this.salesItemDetailsList[FoundItem];
      let ItemDetail: SalesItemDetail = this.salesItemDetailsList.filter(
        (a) => a.ItemID == event.option.value.item_Id
      )[0];
      this.I_CrtControl.setValue(ItemDetail.Crt);
      this.I_PcsControl.setValue(ItemDetail.Pcs);
      this.I_QtyControl.setValue(ItemDetail.Qty);
      this.I_FreeCrtControl.setValue(ItemDetail.FCrt);
      this.I_FreePcsControl.setValue(ItemDetail.FPcs);
      this.I_FreeQtyControl.setValue(ItemDetail.FQty);
      this.I_TotalQtyControl.setValue(ItemDetail.TQty);
      this.I_RateControl.setValue(ItemDetail.Rate);
      this.I_AmountControl.setValue(ItemDetail.Amount);
      this.I_DiscPerControl.setValue(ItemDetail.DiscPer);
      this.I_DiscAmountControl.setValue(ItemDetail.DiscAmount);
      this.I_GSTTaxIDControl.setValue(ItemDetail.GSTTaxID.toString());
      this.I_CGSTAmountControl.setValue(ItemDetail.CGSTAmount);
      this.I_SGSTAmountControl.setValue(ItemDetail.SGSTAmount);
      this.I_IGSTAmountControl.setValue(ItemDetail.IGSTAmount);
      this.I_CessAmountControl.setValue(ItemDetail.CessAmount);

      this.I_GrossAmountControl.setValue(ItemDetail.GrossAmount);
      this.I_SchPerControl.setValue(ItemDetail.SchPer);
      this.I_SchAmountControl.setValue(ItemDetail.SchAmount);
      this.I_NetAmountControl.setValue(ItemDetail.NetAmount);
      this.CalculateTotals();
      this.IsItemEditMode = true;
    }
    this.itemService
      .GetItembyID(event.option.value.item_Id)
      .subscribe((response) => {
        this.CurrentItem = response;
        this.GetCurrentStock(Number(this.CurrentItem?.itemID));
        if (FoundItem == -1) {
          this.I_RateControl.setValue(
            SetFormatCurrency(this.CurrentItem?.salesRate)
          );
          this.I_GSTTaxIDControl.setValue(
            this.CurrentItem?.gstTaxID.toString()
          );
        }
        this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID), false);
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
    this.stockService.GetClosingByItemID(ItemID).subscribe((response) => {
      this.CurrentStock = response;
    });
  }

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.salesItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.salesItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.salesItemDetailsList.length + 1;
    }

    let ItemDetails: SalesItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.I_ItemIDControl.value.item_Id),
      ItemName: this.I_ItemIDControl.value.item_Name,
      Crt: CheckIsNumber(this.I_CrtControl.value),
      Pcs: CheckIsNumber(this.I_PcsControl.value),
      Qty: CheckIsNumber(this.I_QtyControl.value),
      FCrt: CheckIsNumber(this.I_FreeCrtControl.value),
      FPcs: CheckIsNumber(this.I_FreePcsControl.value),
      FQty: CheckIsNumber(this.I_FreeQtyControl.value),
      TQty: CheckIsNumber(this.I_TotalQtyControl.value),
      Rate: CheckIsNumber(this.I_RateControl.value),
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
      GrossAmount: CheckIsNumber(this.I_GrossAmountControl.value),
      SchPer: CheckIsNumber(this.I_SchPerControl.value),
      SchAmount: CheckIsNumber(this.I_SchAmountControl.value),
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
      this.salesItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.salesItemDetailsList.push(ItemDetails);
    }
    this.salesItemDetailsListData = [
      ...this.salesItemDetailsList.filter((a) => a.IsDeleted == false),
    ];

    this.ItemCount = this.salesItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: SalesItemDetail) {
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
      I_FreeCrt: record.FCrt,
      I_FreePcs: record.FPcs,
      I_FreeQty: record.FQty,
      I_TotalQty: record.TQty,
      I_Rate: SetFormatCurrency(record.Rate),
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
      I_GrossAmount: SetFormatCurrency(record.GrossAmount),
      I_SchPer: SetFormatCurrency(record.SchPer),
      I_SchAmount: SetFormatCurrency(record.SchAmount),
      I_NetAmount: SetFormatCurrency(record.NetAmount),
    });
    this.IsItemEditMode = true;
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.itemService.GetItembyID(record.ItemID).subscribe((response) => {
      this.CurrentItem = response;
      this.GetCurrentStock(Number(this.CurrentItem?.itemID));
      this.I_RateControl.setValue(
        SetFormatCurrency(this.CurrentItem?.salesRate)
      );
      this.GetCurrentTax(Number(record.GSTTaxID), false);
    });
  }

  deleteItem(record: SalesItemDetail) {
    let ItemIndex = this.salesItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.salesItemDetailsList[ItemIndex].AutoID > 0) {
      this.salesItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.salesItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.salesItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.salesItemDetailsListData = [
      ...this.salesItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.salesItemDetailsListData.length;
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
        I_FreeCrt: 0,
        I_FreePcs: 0,
        I_FreeQty: 0,
        I_TotalQty: 0,
        I_Rate: 0,
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
        I_GrossAmount: 0,
        I_SchPer: 0,
        I_SchAmount: 0,
        I_NetAmount: 0,
      },
    });
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    this.salesItemDetailsList = [];
    this.salesItemDetailsListData = [...this.salesItemDetailsList];
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
      I_FreeCrt: 0,
      I_FreePcs: 0,
      I_FreeQty: 0,
      I_TotalQty: 0,
      I_Rate: 0,
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
      I_GrossAmount: 0,
      I_SchPer: 0,
      I_SchAmount: 0,
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
        this.salesItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName', true).focus();
      } else if (
        this.I_ItemIDControl.value == '' &&
        this.salesItemDetailsList.length > 0
      ) {
        this.renderer.selectRootElement('#OtherAddText', true).focus();
      }
    }
  }
  //Controls

  get BookAccountIDControl() {
    return this.salesForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.salesForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.salesForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.salesForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.salesForm.get('AccountID') as FormControl;
  }

  get AccountTradeTypeIDControl() {
    return this.salesForm.get('AccountTradeTypeID') as FormControl;
  }

  get TotalAmountControl() {
    return this.salesForm.get('TotalAmount') as FormControl;
  }
  get TotalDiscAmountControl() {
    return this.salesForm.get('TotalDiscAmount') as FormControl;
  }
  get TotalTaxableAmountControl() {
    return this.salesForm.get('TotalTaxableAmount') as FormControl;
  }
  get TotalCGSTAmountControl() {
    return this.salesForm.get('TotalCGSTAmount') as FormControl;
  }
  get TotalSGSTAmountControl() {
    return this.salesForm.get('TotalSGSTAmount') as FormControl;
  }
  get TotalIGSTAmountControl() {
    return this.salesForm.get('TotalIGSTAmount') as FormControl;
  }
  get TotalCessAmountControl() {
    return this.salesForm.get('TotalCessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.salesForm.get('TotalTaxAmount') as FormControl;
  }
  get TotalGrossAmountControl() {
    return this.salesForm.get('TotalGrossAmount') as FormControl;
  }
  get TotalSchAmountControl() {
    return this.salesForm.get('TotalSchAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.salesForm.get('TotalNetAmount') as FormControl;
  }
  get OtherAddTextControl() {
    return this.salesForm.get('OtherAddText') as FormControl;
  }
  get OtherAddAmountControl() {
    return this.salesForm.get('OtherAddAmount') as FormControl;
  }
  get OtherLessTextControl() {
    return this.salesForm.get('OtherLessText') as FormControl;
  }
  get OtherLessAmountControl() {
    return this.salesForm.get('OtherLessAmount') as FormControl;
  }
  get RoundOffAmountControl() {
    return this.salesForm.get('RoundOffAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.salesForm.get('NetAmount') as FormControl;
  }

  get ItemsControl() {
    return this.salesForm.get('Items') as FormControl;
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
  get I_FreeCrtControl() {
    return this.ItemsControl.get('I_FreeCrt') as FormControl;
  }
  get I_FreePcsControl() {
    return this.ItemsControl.get('I_FreePcs') as FormControl;
  }
  get I_FreeQtyControl() {
    return this.ItemsControl.get('I_FreeQty') as FormControl;
  }
  get I_TotalQtyControl() {
    return this.ItemsControl.get('I_TotalQty') as FormControl;
  }
  get I_RateControl() {
    return this.ItemsControl.get('I_Rate') as FormControl;
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
  get I_GrossAmountControl() {
    return this.ItemsControl.get('I_GrossAmount') as FormControl;
  }
  get I_SchPerControl() {
    return this.ItemsControl.get('I_SchPer') as FormControl;
  }
  get I_SchAmountControl() {
    return this.ItemsControl.get('I_SchAmount') as FormControl;
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
        this.salesService
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
      FreeQty = 0,
      TotalQty = 0,
      Amount = 0,
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

    Rate = CheckIsNumber(this.I_RateControl.value);
    RatePerPcs = Rate / Number(this.CurrentItem?.packing);
    Qty =
      Number(this.I_CrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.I_PcsControl.value);
    FreeQty =
      Number(this.I_FreeCrtControl.value) * Number(this.CurrentItem?.packing) +
      Number(this.I_FreePcsControl.value);

    TotalQty = Qty + FreeQty;
    this.DisableAddItemBtn = true;
    if (TotalQty > 0) {
      this.DisableAddItemBtn = false;
    }
    Amount =
      Number(this.I_CrtControl.value) * Rate +
      Number(this.I_PcsControl.value) * RatePerPcs;

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

    if (this.IsSchPerChange) {
      SchAmount = GrossAmount * (Number(this.I_SchPerControl.value) / 100);
    } else {
      SchAmount = Number(this.I_SchAmountControl.value);
    }

    NetAmount = GrossAmount - SchAmount;

    this.I_QtyControl.setValue(Qty);
    this.I_FreeQtyControl.setValue(FreeQty);
    this.I_TotalQtyControl.setValue(TotalQty);
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
    this.I_GrossAmountControl.setValue(SetFormatCurrency(GrossAmount));
    if (this.IsSchPerChange == true) {
      this.I_SchAmountControl.setValue(SetFormatCurrency(SchAmount));
    }
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
      TotalGrossAmount = 0,
      TotalSchAmount = 0,
      TotalNetAmount = 0;

    this.salesItemDetailsList.forEach((element) => {
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
        TotalGrossAmount =
          Number(TotalGrossAmount) + Number(element.GrossAmount);
        TotalSchAmount = Number(TotalSchAmount) + Number(element.SchAmount);
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
