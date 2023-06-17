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
  AccountTypeMaster,
  Item,
  ItemFilter_DropDown,
  ItemGroupDownDownResponse,
  itemsDropDownResponse,
  SalesSItemDetail,
  SalesSItemPostRequest,
  SalesSItemPutRequest,
  SalesSPostRequest,
  SalesSPutRequest,
  SalesSResponse,
  Tax,
  TaxDownDownResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import {
  CheckIsNumber,
  RoundOffAmount,
  SetFormatCurrency,
} from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-sales-service-add-edit',
  templateUrl: './sales-service-add-edit.component.html',
  styleUrls: ['./sales-service-add-edit.component.scss'],
})
export class SalesServiceAddEditComponent implements OnInit {
  PageTitle: string = 'Create Sales (Service)';
  buttonText: string = 'Add New Sales';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedSalesId: number;

  salesPostRequest?: SalesSPostRequest;
  salesPutRequest?: SalesSPutRequest;
  editSales?: SalesSResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  salesItemDetailsList: SalesSItemDetail[] = [];
  salesItemDetailsListData: SalesSItemDetail[] = [];
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
  ItemEdit?: SalesSItemDetail;
  ItemCount: number = 0;
  salesForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
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
    private salesService: fromService.SalesSService,
    private accountService: fromService.AccountsService,
    private itemService: fromService.ItemService,
    private taxService: fromService.TaxService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.setColumns();
    this.isEditMode = false;
    this.selectedSalesId = 0;
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
            this.selectedSalesId = params['salesid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedSalesId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Sales (Service)';
        this.getSalesByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetSalesSItemDetailColumns();
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
      this.router.navigate(['/transaction/sales-service/list']);
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
          TotalNetAmount: SetFormatCurrency(this.editSales?.totalNetAmount),
          RoundOffAmount: SetFormatCurrency(this.editSales?.roundOffAmount),
          NetAmount: SetFormatCurrency(this.editSales?.netAmount),
        });

        this.BillDateControl.setValue(moment(this.editSales?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);

        this.editSales!.details!.forEach((element) => {
          let ItemDetails: SalesSItemDetail = {
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
    let PostRequestDetail: SalesSItemPostRequest[] = [];
    this.salesItemDetailsList.forEach((element) => {
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
    this.salesPostRequest = {
      bookAccountID: Number(salesForm.value.BookAccountID),
      billNo: Number(salesForm.value.BillNo),
      refNo: salesForm.value.RefNo,
      billDate: salesForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(salesForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(salesForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(salesForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(salesForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(salesForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(salesForm.value.TotalNetAmount),
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
    let PutRequestDetail: SalesSItemPutRequest[] = [];
    this.salesItemDetailsList.forEach((element) => {
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
    this.salesPutRequest = {
      bookAccountID: Number(salesForm.value.BookAccountID),
      billNo: Number(salesForm.value.BillNo),
      refNo: salesForm.value.RefNo,
      billDate: salesForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(salesForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(salesForm.value.TotalAmount),
      totalDiscAmount: CheckIsNumber(salesForm.value.TotalDiscAmount),
      totalTaxableAmount: CheckIsNumber(salesForm.value.TotalTaxableAmount),
      totalCGSTAmount: CheckIsNumber(salesForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(salesForm.value.TotalNetAmount),
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

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [TransactionTypeMaster.Sales_Service],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  FillAccountDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Customer],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
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
      OnlyStockItems: false,
      ReturnTypeID: 1,
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

    let FoundItem = this.salesItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );
    this.itemService
      .GetItembyID(event.option.value.item_Id)
      .subscribe((response) => {
        this.CurrentItem = response;
        if (FoundItem == -1) {
          this.I_GSTTaxIDControl.setValue(
            this.CurrentItem?.gstTaxID.toString()
          );
          this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID), false);
        } else {
          this.ItemEdit = this.salesItemDetailsList[FoundItem];
          let ItemDetail: SalesSItemDetail = this.salesItemDetailsList.filter(
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

    let ItemDetails: SalesSItemDetail = {
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

  editItem(record: SalesSItemDetail) {
    let SeletedItem: itemsDropDownResponse;
    SeletedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_ItemID: SeletedItem,
      I_Amount: record.Amount,
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
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.itemService.GetItembyID(record.ItemID).subscribe((response) => {
      this.CurrentItem = response;
      this.GetCurrentTax(Number(record.GSTTaxID), false);
    });
  }

  deleteItem(record: SalesSItemDetail) {
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
    this.salesItemDetailsList = [];
    this.salesItemDetailsListData = [...this.salesItemDetailsList];
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
    this.renderer.selectRootElement('#ItemName', true).focus();
    this.CurrentItem = undefined;
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
        if (this.isEditMode == true) {
          this.renderer.selectRootElement('#UpdateSales', true).focus();
        } else {
          this.renderer.selectRootElement('#SaveSales', true).focus();
        }
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
  get TotalNetAmountControl() {
    return this.salesForm.get('TotalNetAmount') as FormControl;
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
    let Amount = 0,
      DiscAmount = 0,
      TaxableAmount = 0,
      CGSTAmount = 0,
      SGSTAmount = 0,
      IGSTAmount = 0,
      CessAmount = 0,
      TotalTaxAmount = 0,
      NetAmount = 0;

    Amount = Number(this.I_AmountControl.value);
    this.DisableAddItemBtn = true;
    if (Amount > 0) {
      this.DisableAddItemBtn = false;
    }
    if (this.IsDiscPerChange) {
      DiscAmount = RoundOffAmount(
        Amount * (Number(this.I_DiscPerControl.value) / 100),
        2
      );
    } else {
      DiscAmount = Number(this.I_DiscAmountControl.value);
    }

    TaxableAmount = Amount - DiscAmount;
    if (this.IsIGSTInvoice) {
      IGSTAmount = RoundOffAmount(
        TaxableAmount * (Number(this.CurrentTax?.igstRate) / 100),
        2
      );
    } else {
      CGSTAmount = RoundOffAmount(
        TaxableAmount * (Number(this.CurrentTax?.cgstRate) / 100),
        2
      );
      SGSTAmount = RoundOffAmount(
        TaxableAmount * (Number(this.CurrentTax?.sgstRate) / 100),
        2
      );
    }

    if (Number(this.CurrentTax?.cessRate) > 0) {
      CessAmount = RoundOffAmount(
        TaxableAmount * (Number(this.CurrentTax?.cessRate) / 100),
        2
      );
    }

    TotalTaxAmount = RoundOffAmount(
      CGSTAmount + SGSTAmount + IGSTAmount + CessAmount,
      2
    );

    NetAmount = RoundOffAmount(TaxableAmount + TotalTaxAmount, 2);

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
