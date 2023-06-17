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
  DebitNotePostRequest,
  DebitNotePutRequest,
  DebitNoteResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
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

  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  BillMinDate?: Date;
  BillMaxDate?: Date;
  DisableAddItemBtn: boolean = true;
  CompanyStateID: number = 0;
  AccountStateID: number = 0;
  columns: MtxGridColumn[] = [];

  IsItemEditMode: boolean = false;
  ItemCount: number = 0;
  debitNoteForm = this.fb.group({
    BookAccountID: ['', [Validators.required]],
    BillDate: ['', [Validators.required]],
    BillNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    Description: ['', [Validators.required]],
    Amount: ['0'],
  });

  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private debitNoteService: fromService.DebitNoteService,
    private accountService: fromService.AccountsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.isEditMode = false;
    this.selectedDebitNoteId = 0;
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
          Description: this.editDebitNote?.description,
          Amount: SetFormatCurrency(this.editDebitNote?.amount),
        });

        this.BillDateControl.setValue(moment(this.editDebitNote?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);
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
    this.debitNotePostRequest = {
      bookAccountID: Number(debitNoteForm.value.BookAccountID),
      billNo: Number(debitNoteForm.value.BillNo),
      refNo: debitNoteForm.value.RefNo,
      billDate: debitNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(debitNoteForm.value.AccountID.account_Id),
      description: debitNoteForm.value.Description,
      amount: CheckIsNumber(debitNoteForm.value.Amount),
      isActive: true,
    };
    this.debitNoteService
      .createDebitNote(this.debitNotePostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateDebitNote(debitNoteForm: FormGroup) {
    this.debitNotePutRequest = {
      bookAccountID: Number(debitNoteForm.value.BookAccountID),
      billNo: Number(debitNoteForm.value.BillNo),
      refNo: debitNoteForm.value.RefNo,
      billDate: debitNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(debitNoteForm.value.AccountID.account_Id),
      description: debitNoteForm.value.Description,
      amount: CheckIsNumber(debitNoteForm.value.Amount),
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

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [TransactionTypeMaster.Debit_Note],
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
      AccountTypeID: [AccountTypeMaster.Supplier],
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

  DisplayAccountName(accounts: accountsDropDownResponse) {
    return accounts && accounts.account_Name ? accounts.account_Name : '';
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
  }

  ResetForm(form: FormGroup) {
    let control: AbstractControl;
    form.reset({
      BookAccountID: '',
      BillDate: '',
      BillNo: '',
      RefNo: '',
      AccountID: '',
      Description: '',
      Amount: 0,
    });
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    this.DisableAddItemBtn = true;
    this.SetMinMaxBillDate();
    this.renderer.selectRootElement('#BookAccountName', true).focus();
  }

  OnAccountBlur() {
    if (
      this.AutoAccountID?.isOpen == false &&
      this.AccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#AccountName', true).focus();
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

  get DescriptionControl() {
    return this.debitNoteForm.get('Description') as FormControl;
  }

  get DescriptionControlRequired() {
    return (
      this.DescriptionControl.hasError('required') &&
      this.DescriptionControl.touched
    );
  }

  get DescriptionControlInvalid() {
    return (
      this.DescriptionControl.hasError('pattern') &&
      this.DescriptionControl.touched
    );
  }

  get AmountControl() {
    return this.debitNoteForm.get('Amount') as FormControl;
  }

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

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsDropDown.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }
}
