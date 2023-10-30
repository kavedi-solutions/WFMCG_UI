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
  SalesReturnItemDetail,
  SalesReturnItemPostRequest,
  SalesReturnItemPutRequest,
  SalesReturnPostRequest,
  SalesReturnPutRequest,
  SalesReturnResponse,
  returnTypeResponse,
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
  selector: 'app-sales-return-add-edit',
  templateUrl: './sales-return-add-edit.component.html',
  styleUrls: ['./sales-return-add-edit.component.scss'],
})
export class SalesReturnAddEditComponent implements OnInit {
  PageTitle: string = 'Create Sales Return';
  buttonText: string = 'Add New Sales Return';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedSalesReturnId: number;
  AccountTradeTypeID: Number = 0;
  ReturnTypeID: Number = 0;

  salesReturnPostRequest?: SalesReturnPostRequest;
  salesReturnPutRequest?: SalesReturnPutRequest;
  editSalesReturn?: SalesReturnResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  returnTypeDropDown: returnTypeResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  salesReturnItemDetailsList: SalesReturnItemDetail[] = [];
  salesReturnItemDetailsListData: SalesReturnItemDetail[] = [];
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
  ItemEdit?: SalesReturnItemDetail;
  ItemCount: number = 0;
  salesReturnForm = this.fb.group({
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
    private salesReturnService: fromService.SalesReturnService,
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
    this.selectedSalesReturnId = 0;
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
            this.selectedSalesReturnId = params['salesReturnid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedSalesReturnId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Sales Return';
        this.getSalesReturnByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetSalesReturnItemDetailColumns();
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
      this.router.navigate(['/transaction/sales-return/list']);
    } else {
      this.ResetForm(this.salesReturnForm);
    }
  }

  getSalesReturnByID() {
    this.salesReturnService
      .GetSalesReturnbyID(this.selectedSalesReturnId)
      .subscribe((response) => {
        this.editSalesReturn = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editSalesReturn?.accountID.toString()
        )[0];

        this.salesReturnForm.patchValue({
          BookAccountID: this.editSalesReturn?.bookAccountID.toString(),
          BillNo: this.editSalesReturn?.billNo.toString(),
          RefNo: this.editSalesReturn?.refNo,
          AccountTradeTypeID:
            this.editSalesReturn?.accountTradeTypeID.toString(),
          ReturnTypeID: this.editSalesReturn?.returnTypeID.toString(),
          TotalAmount: SetFormatCurrency(this.editSalesReturn?.totalAmount),
          TotalCGSTAmount: SetFormatCurrency(
            this.editSalesReturn?.totalCGSTAmount
          ),
          TotalSGSTAmount: SetFormatCurrency(
            this.editSalesReturn?.totalSGSTAmount
          ),
          TotalIGSTAmount: SetFormatCurrency(
            this.editSalesReturn?.totalIGSTAmount
          ),
          TotalCessAmount: SetFormatCurrency(
            this.editSalesReturn?.totalCessAmount
          ),
          TotalTaxAmount: SetFormatCurrency(
            this.editSalesReturn?.totalTaxAmount
          ),
          TotalNetAmount: SetFormatCurrency(
            this.editSalesReturn?.totalNetAmount
          ),
          RoundOffAmount: SetFormatCurrency(
            this.editSalesReturn?.roundOffAmount
          ),
          NetAmount: SetFormatCurrency(this.editSalesReturn?.netAmount),
        });

        this.BillDateControl.setValue(moment(this.editSalesReturn?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);

        this.AccountTradeTypeChange(
          this.editSalesReturn?.accountTradeTypeID.toString()
        );

        this.ReturnTypeChange(this.editSalesReturn?.returnTypeID.toString());

        this.editSalesReturn!.details!.forEach((element) => {
          let ItemDetails: SalesReturnItemDetail = {
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
          this.salesReturnItemDetailsList.push(ItemDetails);
        });

        this.salesReturnItemDetailsListData = [
          ...this.salesReturnItemDetailsList.filter(
            (a) => a.IsDeleted == false
          ),
        ];
        this.ItemCount = this.salesReturnItemDetailsListData.length;
      });
  }

  SaveUpdateSalesReturn(salesReturnForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateSalesReturn(salesReturnForm);
    } else {
      this.SaveSalesReturn(salesReturnForm);
    }
  }

  SaveSalesReturn(salesReturnForm: FormGroup) {
    let PostRequestDetail: SalesReturnItemPostRequest[] = [];
    this.salesReturnItemDetailsList.forEach((element) => {
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
    this.salesReturnPostRequest = {
      bookAccountID: Number(salesReturnForm.value.BookAccountID),
      billNo: Number(salesReturnForm.value.BillNo),
      refNo: salesReturnForm.value.RefNo,
      billDate: salesReturnForm.value.BillDate.format('YYYY-MM-DD'),
      returnTypeID: Number(salesReturnForm.value.ReturnTypeID),
      accountID: Number(salesReturnForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(salesReturnForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(salesReturnForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(salesReturnForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesReturnForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesReturnForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesReturnForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesReturnForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(salesReturnForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(salesReturnForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(salesReturnForm.value.NetAmount),
      details: PostRequestDetail,
      isActive: true,
    };
    this.salesReturnService
      .createSalesReturn(this.salesReturnPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateSalesReturn(salesReturnForm: FormGroup) {
    let PutRequestDetail: SalesReturnItemPutRequest[] = [];
    this.salesReturnItemDetailsList.forEach((element) => {
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
    this.salesReturnPutRequest = {
      bookAccountID: Number(salesReturnForm.value.BookAccountID),
      billNo: Number(salesReturnForm.value.BillNo),
      refNo: salesReturnForm.value.RefNo,
      billDate: salesReturnForm.value.BillDate.format('YYYY-MM-DD'),
      returnTypeID: Number(salesReturnForm.value.ReturnTypeID),
      accountID: Number(salesReturnForm.value.AccountID.account_Id),
      accountTradeTypeID: Number(salesReturnForm.value.AccountTradeTypeID),
      totalAmount: CheckIsNumber(salesReturnForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(salesReturnForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(salesReturnForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(salesReturnForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(salesReturnForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(salesReturnForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(salesReturnForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(salesReturnForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(salesReturnForm.value.NetAmount),
      details: PutRequestDetail,
      isActive: true,
    };
    this.salesReturnService
      .updateSalesReturn(
        this.editSalesReturn!.autoID,
        this.salesReturnPutRequest
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
      TransactionTypeID: [TransactionTypeMaster.Sales_Return],
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
      AccountTypeID: [AccountTypeMaster.Customer],
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
        OnlyStockItems: true,
        ReturnTypeID: this.ReturnTypeID,
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

    let FoundItem = this.salesReturnItemDetailsList.findIndex(
      (a) => a.ItemID == event.option.value.item_Id
    );
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
          this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID), false);
        } else {
          this.ItemEdit = this.salesReturnItemDetailsList[FoundItem];
          let ItemDetail: SalesReturnItemDetail =
            this.salesReturnItemDetailsList.filter(
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
      ItemIndex = this.salesReturnItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.salesReturnItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.salesReturnItemDetailsList.length + 1;
    }

    let ItemDetails: SalesReturnItemDetail = {
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
      this.salesReturnItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.salesReturnItemDetailsList.push(ItemDetails);
    }
    this.salesReturnItemDetailsListData = [
      ...this.salesReturnItemDetailsList.filter((a) => a.IsDeleted == false),
    ];

    this.ItemCount = this.salesReturnItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: SalesReturnItemDetail) {
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
        SetFormatCurrency(this.CurrentItem?.salesRate)
      );
      this.GetCurrentTax(Number(record.GSTTaxID), false);
    });
  }

  deleteItem(record: SalesReturnItemDetail) {
    let ItemIndex = this.salesReturnItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.salesReturnItemDetailsList[ItemIndex].AutoID > 0) {
      this.salesReturnItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.salesReturnItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.salesReturnItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.salesReturnItemDetailsListData = [
      ...this.salesReturnItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.salesReturnItemDetailsListData.length;
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
    this.salesReturnItemDetailsList = [];
    this.salesReturnItemDetailsListData = [...this.salesReturnItemDetailsList];
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
        this.salesReturnItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName', true).focus();
      } else if (
        this.I_ItemIDControl.value == '' &&
        this.salesReturnItemDetailsList.length > 0
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
    return this.salesReturnForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.salesReturnForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.salesReturnForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.salesReturnForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.salesReturnForm.get('AccountID') as FormControl;
  }

  get ReturnTypeIDControl() {
    return this.salesReturnForm.get('ReturnTypeID') as FormControl;
  }

  get AccountTradeTypeIDControl() {
    return this.salesReturnForm.get('AccountTradeTypeID') as FormControl;
  }

  get TotalAmountControl() {
    return this.salesReturnForm.get('TotalAmount') as FormControl;
  }
  get TotalCGSTAmountControl() {
    return this.salesReturnForm.get('TotalCGSTAmount') as FormControl;
  }
  get TotalSGSTAmountControl() {
    return this.salesReturnForm.get('TotalSGSTAmount') as FormControl;
  }
  get TotalIGSTAmountControl() {
    return this.salesReturnForm.get('TotalIGSTAmount') as FormControl;
  }
  get TotalCessAmountControl() {
    return this.salesReturnForm.get('TotalCessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.salesReturnForm.get('TotalTaxAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.salesReturnForm.get('TotalNetAmount') as FormControl;
  }
  get RoundOffAmountControl() {
    return this.salesReturnForm.get('RoundOffAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.salesReturnForm.get('NetAmount') as FormControl;
  }

  get ItemsControl() {
    return this.salesReturnForm.get('Items') as FormControl;
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
        this.salesReturnService
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

    TotalTaxAmount = RoundOffAmount(
      CGSTAmount + SGSTAmount + IGSTAmount + CessAmount,
      2
    );

    NetAmount = RoundOffAmount(Amount + TotalTaxAmount, 2);

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

    this.salesReturnItemDetailsList.forEach((element) => {
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
