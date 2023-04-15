import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, observable, Observable, of, startWith, tap } from 'rxjs';
import * as fromService from '../../../../shared/index';
import {
  accountsDropDownResponse,
  accountTradeTypeResponse,
  Item,
  ItemFilter_DropDown,
  ItemGroupDownDownResponse,
  itemsDropDownResponse,
  Tax,
  TaxDownDownResponse,
} from '../../../../shared/index';

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
  CurrentItem?: Item;
  CurrentTax?: Tax;
  BillMinDate?: Date;
  BillMaxDate?: Date;
  DisableAddItemBtn: boolean = true;
  CompanyStateID: number = 0;
  AccountStateID: number = 0;
  IsIGSTInvoice: boolean = false;
  InvoiceType: string = '';

  IsDiscPerChange: boolean = false;
  IsSchPerChange: boolean = false;

  purchaseForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    AccountTradeTypeID: ['', [Validators.required]],
    Items: this.fb.group({
      ItemID: [''],
      Crt: [0],
      Pcs: [0],
      Qty: [0],
      FreeCrt: [0],
      FreePcs: [0],
      FreeQty: [0],
      TotalQty: [0],
      Rate: [0],
      Amount: [0],
      DiscPer: [0],
      DiscAmount: [0],
      GSTTaxID: [''],
      CGSTAmount: [0],
      SGSTAmount: [0],
      IGSTAmount: [0],
      CessAmount: [0],
      TotalTaxAmount: [0],
      GrossAmount: [0],
      SchPer: [0],
      SchAmount: [0],
      NetAmount: [0],
    }),
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private purchaseService: fromService.PurchaseService,
    private accountService: fromService.AccountsService,
    private itemService: fromService.ItemService,
    private commonService: fromService.CommonService,
    private taxService: fromService.TaxService,
    private fb: FormBuilder
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
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
    //this.FillItemDropDown();
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
    this.itemService
      .GetItembyID(event.option.value.item_Id)
      .subscribe((response) => {
        this.CurrentItem = response;
        this.RateControl.setValue(
          formatNumber(Number(this.CurrentItem?.purchaseRate), 'en-IN', '0.2-2')
        );
        this.GSTTaxIDControl.setValue(this.CurrentItem?.gstTaxID.toString());
        this.GetCurrentTax(Number(this.CurrentItem?.gstTaxID));
      });
  }

  GetCurrentTax(TaxID: number) {
    this.taxService.GetTaxbyID(TaxID).subscribe((response) => {
      this.CurrentTax = response;
    });
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

  get ItemIDControl() {
    return this.purchaseForm.get('Items')?.get('ItemID') as FormControl;
  }

  get CrtControl() {
    return this.purchaseForm.get('Items')?.get('Crt') as FormControl;
  }
  get PcsControl() {
    return this.purchaseForm.get('Items')?.get('Pcs') as FormControl;
  }
  get QtyControl() {
    return this.purchaseForm.get('Items')?.get('Qty') as FormControl;
  }
  get FreeCrtControl() {
    return this.purchaseForm.get('Items')?.get('FreeCrt') as FormControl;
  }
  get FreePcsControl() {
    return this.purchaseForm.get('Items')?.get('FreePcs') as FormControl;
  }
  get FreeQtyControl() {
    return this.purchaseForm.get('Items')?.get('FreeQty') as FormControl;
  }
  get TotalQtyControl() {
    return this.purchaseForm.get('Items')?.get('TotalQty') as FormControl;
  }
  get RateControl() {
    return this.purchaseForm.get('Items')?.get('Rate') as FormControl;
  }
  get AmountControl() {
    return this.purchaseForm.get('Items')?.get('Amount') as FormControl;
  }
  get DiscPerControl() {
    return this.purchaseForm.get('Items')?.get('DiscPer') as FormControl;
  }
  get DiscAmountControl() {
    return this.purchaseForm.get('Items')?.get('DiscAmount') as FormControl;
  }
  get GSTTaxIDControl() {
    return this.purchaseForm.get('Items')?.get('GSTTaxID') as FormControl;
  }
  get CGSTAmountControl() {
    return this.purchaseForm.get('Items')?.get('CGSTAmount') as FormControl;
  }
  get SGSTAmountControl() {
    return this.purchaseForm.get('Items')?.get('SGSTAmount') as FormControl;
  }
  get IGSTAmountControl() {
    return this.purchaseForm.get('Items')?.get('IGSTAmount') as FormControl;
  }
  get CessAmountControl() {
    return this.purchaseForm.get('Items')?.get('CessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.purchaseForm.get('Items')?.get('TotalTaxAmount') as FormControl;
  }
  get GrossAmountControl() {
    return this.purchaseForm.get('Items')?.get('GrossAmount') as FormControl;
  }
  get SchPerControl() {
    return this.purchaseForm.get('Items')?.get('SchPer') as FormControl;
  }
  get SchAmountControl() {
    return this.purchaseForm.get('Items')?.get('SchAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.purchaseForm.get('Items')?.get('NetAmount') as FormControl;
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

    Rate = Number(this.RateControl.value.replace(/,/g, ''));
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
    this.AmountControl.setValue(formatNumber(Number(Amount), 'en-IN', '0.2-2'));
    if (this.IsDiscPerChange == true) {
      this.DiscAmountControl.setValue(
        formatNumber(Number(DiscAmount), 'en-IN', '0.2-2')
      );
    }
    this.CGSTAmountControl.setValue(
      formatNumber(Number(CGSTAmount), 'en-IN', '0.2-2')
    );
    this.SGSTAmountControl.setValue(
      formatNumber(Number(SGSTAmount), 'en-IN', '0.2-2')
    );
    this.IGSTAmountControl.setValue(
      formatNumber(Number(IGSTAmount), 'en-IN', '0.2-2')
    );
    this.CessAmountControl.setValue(
      formatNumber(Number(CessAmount), 'en-IN', '0.2-2')
    );
    this.GrossAmountControl.setValue(
      formatNumber(Number(GrossAmount), 'en-IN', '0.2-2')
    );
    if (this.IsSchPerChange == true) {
      this.SchAmountControl.setValue(
        formatNumber(Number(SchAmount), 'en-IN', '0.2-2')
      );
    }
    this.NetAmountControl.setValue(
      formatNumber(Number(NetAmount), 'en-IN', '0.2-2')
    );
    this.IsDiscPerChange = false;
    this.IsSchPerChange = false;
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
