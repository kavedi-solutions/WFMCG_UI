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
import * as defaultData from '../../../../data/index';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  DebitNoteItemDetail,
  DebitNoteItemPostRequest,
  DebitNoteItemPutRequest,
  DebitNotePostRequest,
  DebitNotePutRequest,
  DebitNoteResponse,
  Item,
  ItemFilter_DropDown,
  ItemGroupDownDownResponse,
  itemsDropDownResponse,
  Tax,
  TaxDownDownResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import { CheckIsNumber, RoundOffAmount, SetFormatCurrency } from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-debit-note-add-edit',
  templateUrl: './debit-note-add-edit.component.html',
  styleUrls: ['./debit-note-add-edit.component.scss'],
})
export class DebitNoteAddEditComponent implements OnInit {
  PageTitle: string = 'Create Debit Note';
  buttonText: string = 'Add New Debit Note';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedDebitNoteId: number;

  debitNotePostRequest?: DebitNotePostRequest;
  debitNotePutRequest?: DebitNotePutRequest;
  editDebitNote?: DebitNoteResponse;

  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  taxDropDown: TaxDownDownResponse[] = [];
  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;
  debitNoteItemDetailsList: DebitNoteItemDetail[] = [];
  debitNoteItemDetailsListData: DebitNoteItemDetail[] = [];
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

  IsItemEditMode: boolean = false;
  ItemEdit?: DebitNoteItemDetail;
  ItemCount: number = 0;
  debitNoteForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
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
    private debitNoteService: fromService.DebitNoteService,
    private accountService: fromService.AccountsService,
    private itemService: fromService.ItemService,
    private taxService: fromService.TaxService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.setColumns();
    this.isEditMode = false;
    this.selectedDebitNoteId = 0;
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
            this.selectedDebitNoteId = params['debitnoteid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedDebitNoteId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Debit Note';
        this.getDebitNoteByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  setColumns() {
    this.columns = defaultData.GetCNDNItemDetailColumns();
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
      this.router.navigate(['/transaction/debit-note/list']);
    } else {
      this.ResetForm(this.debitNoteForm);
    }
  }

  getDebitNoteByID() {
    this.debitNoteService
      .GetDebitNotebyID(this.selectedDebitNoteId)
      .subscribe((response) => {
        this.editDebitNote = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editDebitNote?.accountID.toString()
        )[0];

        this.debitNoteForm.patchValue({
          BookAccountID: this.editDebitNote?.bookAccountID.toString(),
          BillNo: this.editDebitNote?.billNo.toString(),
          RefNo: this.editDebitNote?.refNo,
          TotalAmount: SetFormatCurrency(this.editDebitNote?.totalAmount),
          TotalCGSTAmount: SetFormatCurrency(
            this.editDebitNote?.totalCGSTAmount
          ),
          TotalSGSTAmount: SetFormatCurrency(
            this.editDebitNote?.totalSGSTAmount
          ),
          TotalIGSTAmount: SetFormatCurrency(
            this.editDebitNote?.totalIGSTAmount
          ),
          TotalCessAmount: SetFormatCurrency(
            this.editDebitNote?.totalCessAmount
          ),
          TotalTaxAmount: SetFormatCurrency(this.editDebitNote?.totalTaxAmount),
          TotalNetAmount: SetFormatCurrency(this.editDebitNote?.totalNetAmount),
          RoundOffAmount: SetFormatCurrency(this.editDebitNote?.roundOffAmount),
          NetAmount: SetFormatCurrency(this.editDebitNote?.netAmount),
        });

        this.BillDateControl.setValue(moment(this.editDebitNote?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);
        this.SelectedAccountState(Number(SeletedAccount.stateID));

        this.editDebitNote!.details!.forEach((element) => {
          let ItemDetails: DebitNoteItemDetail = {
            AutoID: element.autoID,
            SrNo: element.srNo,
            ItemID: element.itemID,
            ItemName: element.itemName,
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
          this.debitNoteItemDetailsList.push(ItemDetails);
        });

        this.debitNoteItemDetailsListData = [
          ...this.debitNoteItemDetailsList.filter((a) => a.IsDeleted == false),
        ];
        this.ItemCount = this.debitNoteItemDetailsListData.length;
      });
  }

  SaveUpdateDebitNote(debitNoteForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateDebitNote(debitNoteForm);
    } else {
      this.SaveDebitNote(debitNoteForm);
    }
  }

  SaveDebitNote(debitNoteForm: FormGroup) {
    let PostRequestDetail: DebitNoteItemPostRequest[] = [];
    this.debitNoteItemDetailsList.forEach((element) => {
      PostRequestDetail.push({
        srNo: element.SrNo,
        itemID: element.ItemID,
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
    this.debitNotePostRequest = {
      bookAccountID: Number(debitNoteForm.value.BookAccountID),
      billNo: Number(debitNoteForm.value.BillNo),
      refNo: debitNoteForm.value.RefNo,
      billDate: debitNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(debitNoteForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(debitNoteForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(debitNoteForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(debitNoteForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(debitNoteForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(debitNoteForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(debitNoteForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(debitNoteForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(debitNoteForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(debitNoteForm.value.NetAmount),
      details: PostRequestDetail,
      isActive: true,
    };
    this.debitNoteService
      .createDebitNote(this.debitNotePostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateDebitNote(debitNoteForm: FormGroup) {
    let PutRequestDetail: DebitNoteItemPutRequest[] = [];
    this.debitNoteItemDetailsList.forEach((element) => {
      PutRequestDetail.push({
        autoID: element.AutoID,
        srNo: element.SrNo,
        itemID: element.ItemID,
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
    this.debitNotePutRequest = {
      bookAccountID: Number(debitNoteForm.value.BookAccountID),
      billNo: Number(debitNoteForm.value.BillNo),
      refNo: debitNoteForm.value.RefNo,
      billDate: debitNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(debitNoteForm.value.AccountID.account_Id),
      accountTradeTypeID: 1,
      totalAmount: CheckIsNumber(debitNoteForm.value.TotalAmount),
      totalCGSTAmount: CheckIsNumber(debitNoteForm.value.TotalCGSTAmount),
      totalSGSTAmount: CheckIsNumber(debitNoteForm.value.TotalSGSTAmount),
      totalIGSTAmount: CheckIsNumber(debitNoteForm.value.TotalIGSTAmount),
      totalCessAmount: CheckIsNumber(debitNoteForm.value.TotalCessAmount),
      totalTaxAmount: CheckIsNumber(debitNoteForm.value.TotalTaxAmount),
      totalNetAmount: CheckIsNumber(debitNoteForm.value.TotalNetAmount),
      roundOffAmount: CheckIsNumber(debitNoteForm.value.RoundOffAmount),
      netAmount: CheckIsNumber(debitNoteForm.value.NetAmount),
      details: PutRequestDetail,
      isActive: true,
    };
    this.debitNoteService
      .updateDebitNote(this.editDebitNote!.autoID, this.debitNotePutRequest)
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
      TransactionTypeID: [TransactionTypeMaster.Debit_Note],
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

  FillItemDropDown(AccountTradeTypeID: number) {
    let filters: ItemFilter_DropDown = {
      ItemType: 2,
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
    this.SelectedAccountState(event.option.value.stateID);
  }

  SelectedAccountState(StateID: number) {
    this.AccountStateID = StateID;
    this.InvoiceType =
      this.AccountStateID != this.CompanyStateID
        ? 'IGST Invoice'
        : 'CGST/SGST Invoice';
    this.IsIGSTInvoice =
      this.AccountStateID != this.CompanyStateID ? true : false;
  }  

  SelectedItem(event: any) {
    //check item exitst in item Detail
    let FoundItem = this.debitNoteItemDetailsList.findIndex(
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
          this.ItemEdit = this.debitNoteItemDetailsList[FoundItem];
          let ItemDetail: DebitNoteItemDetail =
            this.debitNoteItemDetailsList.filter(
              (a) => a.ItemID == event.option.value.item_Id
            )[0];
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

  AddItemToList() {
    let SrNo: number = 0;
    let ItemIndex: number = 0;
    if (this.IsItemEditMode == true) {
      ItemIndex = this.debitNoteItemDetailsList.findIndex(
        (a) => a.ItemID == Number(this.I_ItemIDControl.value.item_Id)
      );
      SrNo = this.debitNoteItemDetailsList[ItemIndex].SrNo;
    } else {
      SrNo = this.debitNoteItemDetailsList.length + 1;
    }

    let ItemDetails: DebitNoteItemDetail = {
      AutoID: this.IsItemEditMode ? Number(this.ItemEdit?.AutoID) : 0,
      SrNo: this.IsItemEditMode ? Number(this.ItemEdit?.SrNo) : SrNo,
      ItemID: Number(this.I_ItemIDControl.value.item_Id),
      ItemName: this.I_ItemIDControl.value.item_Name,
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
      this.debitNoteItemDetailsList[ItemIndex] = ItemDetails;
    } else {
      this.debitNoteItemDetailsList.push(ItemDetails);
    }
    this.debitNoteItemDetailsListData = [
      ...this.debitNoteItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.debitNoteItemDetailsListData.length;
    this.ResetItems();
    this.CalculateFinalTotals();
    this.IsItemEditMode = false;
  }

  editItem(record: DebitNoteItemDetail) {
    let SeletedItem: itemsDropDownResponse;
    SeletedItem = this.itemsDropDown.filter(
      (a) => a.item_Id == record.ItemID.toString()
    )[0];
    this.ItemEdit = record;
    this.ItemsControl.patchValue({
      I_ItemID: SeletedItem,
      I_Amount: record.Amount,
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

  deleteItem(record: DebitNoteItemDetail) {
    let ItemIndex = this.debitNoteItemDetailsList.findIndex(
      (a) => a.ItemID == Number(record.ItemID)
    );
    if (this.debitNoteItemDetailsList[ItemIndex].AutoID > 0) {
      this.debitNoteItemDetailsList[ItemIndex].IsDeleted = true;
    } else {
      this.debitNoteItemDetailsList.splice(ItemIndex, 1);
    }
    let SrNo: number = 0;
    this.debitNoteItemDetailsList.forEach((element) => {
      SrNo = SrNo + 1;
      element.SrNo = SrNo;
    });

    this.debitNoteItemDetailsListData = [
      ...this.debitNoteItemDetailsList.filter((a) => a.IsDeleted == false),
    ];
    this.ItemCount = this.debitNoteItemDetailsListData.length;
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
    this.debitNoteItemDetailsList = [];
    this.debitNoteItemDetailsListData = [...this.debitNoteItemDetailsList];
    this.InvoiceType = '';
    this.I_ItemIDControl.setValue('');
    this.DisableAddItemBtn = true;
    this.SetMinMaxBillDate();
  }

  ResetItems() {
    this.ItemsControl.reset({
      I_ItemID: '',
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
        this.debitNoteItemDetailsList.length == 0
      ) {
        this.renderer.selectRootElement('#ItemName', true).focus();
      } else if (
        this.I_ItemIDControl.value == '' &&
        this.debitNoteItemDetailsList.length > 0
      ) {
        if (this.isEditMode == true) {
          this.renderer.selectRootElement('#UpdateDebitNote', true).focus();
        } else {
          this.renderer.selectRootElement('#SaveDebitNote', true).focus();
        }
      }
    }
  }
  //Controls

  get BookAccountIDControl() {
    return this.debitNoteForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.debitNoteForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.debitNoteForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.debitNoteForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.debitNoteForm.get('AccountID') as FormControl;
  }

  get TotalAmountControl() {
    return this.debitNoteForm.get('TotalAmount') as FormControl;
  }
  get TotalCGSTAmountControl() {
    return this.debitNoteForm.get('TotalCGSTAmount') as FormControl;
  }
  get TotalSGSTAmountControl() {
    return this.debitNoteForm.get('TotalSGSTAmount') as FormControl;
  }
  get TotalIGSTAmountControl() {
    return this.debitNoteForm.get('TotalIGSTAmount') as FormControl;
  }
  get TotalCessAmountControl() {
    return this.debitNoteForm.get('TotalCessAmount') as FormControl;
  }
  get TotalTaxAmountControl() {
    return this.debitNoteForm.get('TotalTaxAmount') as FormControl;
  }
  get TotalNetAmountControl() {
    return this.debitNoteForm.get('TotalNetAmount') as FormControl;
  }
  get RoundOffAmountControl() {
    return this.debitNoteForm.get('RoundOffAmount') as FormControl;
  }
  get NetAmountControl() {
    return this.debitNoteForm.get('NetAmount') as FormControl;
  }

  get ItemsControl() {
    return this.debitNoteForm.get('Items') as FormControl;
  }

  get I_ItemIDControl() {
    return this.ItemsControl.get('I_ItemID') as FormControl;
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
        this.debitNoteService
          .GetNextBillNo(BookId, BillDate)
          .subscribe((response) => {
            this.BillNoControl.setValue(response);
            let RefNo = BookInit + '-' + response;
            this.RefNoControl.setValue(RefNo);
          });
      }
    }
  }

  CalculateTotals() {
    let Amount = 0,
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

    this.I_CGSTAmountControl.setValue(SetFormatCurrency(CGSTAmount));
    this.I_SGSTAmountControl.setValue(SetFormatCurrency(SGSTAmount));
    this.I_IGSTAmountControl.setValue(SetFormatCurrency(IGSTAmount));
    this.I_CessAmountControl.setValue(SetFormatCurrency(CessAmount));
    this.I_TotalTaxAmountControl.setValue(SetFormatCurrency(TotalTaxAmount));
    this.I_NetAmountControl.setValue(SetFormatCurrency(NetAmount));
  }

  CalculateFinalTotals() {
    let TotalAmount = 0,
      TotalCGSTAmount = 0,
      TotalSGSTAmount = 0,
      TotalIGSTAmount = 0,
      TotalCessAmount = 0,
      TotalTaxAmount = 0,
      TotalNetAmount = 0;

    this.debitNoteItemDetailsList.forEach((element) => {
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
