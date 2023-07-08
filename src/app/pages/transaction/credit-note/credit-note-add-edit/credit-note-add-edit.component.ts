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
  CreditNotePostRequest,
  CreditNotePutRequest,
  CreditNoteResponse,
  TransactionTypeMaster,
} from '../../../../shared/index';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-credit-note-add-edit',
  templateUrl: './credit-note-add-edit.component.html',
  styleUrls: ['./credit-note-add-edit.component.scss'],
})
export class CreditNoteAddEditComponent implements OnInit {
  PageTitle: string = 'Create Credit Note';
  buttonText: string = 'Add New Credit Note';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedCreditNoteId: number;

  creditNotePostRequest?: CreditNotePostRequest;
  creditNotePutRequest?: CreditNotePutRequest;
  editCreditNote?: CreditNoteResponse;

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
  creditNoteForm = this.fb.group({
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
    private creditNoteService: fromService.CreditNoteService,
    private accountService: fromService.AccountsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.CompanyStateID = this.sstorage.get('CompanyStateID');
    this.isEditMode = false;
    this.selectedCreditNoteId = 0;
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
            this.selectedCreditNoteId = params['creditnoteid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedCreditNoteId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Credit Note';
        this.getCreditNoteByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/transaction/credit-note/list']);
    } else {
      this.ResetForm(this.creditNoteForm);
    }
  }

  getCreditNoteByID() {
    this.creditNoteService
      .GetCreditNotebyID(this.selectedCreditNoteId)
      .subscribe((response) => {
        this.editCreditNote = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editCreditNote?.accountID.toString()
        )[0];

        this.creditNoteForm.patchValue({
          BookAccountID: this.editCreditNote?.bookAccountID.toString(),
          BillNo: this.editCreditNote?.billNo.toString(),
          RefNo: this.editCreditNote?.refNo,
          Description: this.editCreditNote?.description,
          Amount: SetFormatCurrency(this.editCreditNote?.amount),
        });

        this.BillDateControl.setValue(moment(this.editCreditNote?.billDate));
        this.AccountIDControl.setValue(SeletedAccount);
      });
  }

  SaveUpdateCreditNote(creditNoteForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateCreditNote(creditNoteForm);
    } else {
      this.SaveCreditNote(creditNoteForm);
    }
  }

  SaveCreditNote(creditNoteForm: FormGroup) {
    this.creditNotePostRequest = {
      bookAccountID: Number(creditNoteForm.value.BookAccountID),
      billNo: Number(creditNoteForm.value.BillNo),
      refNo: creditNoteForm.value.RefNo,
      billDate: creditNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(creditNoteForm.value.AccountID.account_Id),
      description: creditNoteForm.value.Description,
      amount: CheckIsNumber(creditNoteForm.value.Amount),
      isActive: true,
    };
    this.creditNoteService
      .createCreditNote(this.creditNotePostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateCreditNote(creditNoteForm: FormGroup) {
    this.creditNotePutRequest = {
      bookAccountID: Number(creditNoteForm.value.BookAccountID),
      billNo: Number(creditNoteForm.value.BillNo),
      refNo: creditNoteForm.value.RefNo,
      billDate: creditNoteForm.value.BillDate.format('YYYY-MM-DD'),
      accountID: Number(creditNoteForm.value.AccountID.account_Id),
      description: creditNoteForm.value.Description,
      amount: CheckIsNumber(creditNoteForm.value.Amount),
      isActive: true,
    };
    this.creditNoteService
      .updateCreditNote(this.editCreditNote!.autoID, this.creditNotePutRequest)
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
      TransactionTypeID: [TransactionTypeMaster.Credit_Note],
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
    return this.creditNoteForm.get('BookAccountID') as FormControl;
  }

  get BillDateControl() {
    return this.creditNoteForm.get('BillDate') as FormControl;
  }

  get BillNoControl() {
    return this.creditNoteForm.get('BillNo') as FormControl;
  }

  get RefNoControl() {
    return this.creditNoteForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.creditNoteForm.get('AccountID') as FormControl;
  }

  get DescriptionControl() {
    return this.creditNoteForm.get('Description') as FormControl;
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
    return this.creditNoteForm.get('Amount') as FormControl;
  }

  GetNewBillNo() {
    if (this.isEditMode == false) {
      let BookId = this.BookAccountIDControl.value;
      let BookInit = this.booksDropDown.find(
        (a) => a.account_Id == BookId
      )?.bookInit;
      let BillDate = this.BillDateControl.value.format('YYYY-MM-DD');
      if (BookId != '' && BillDate != '') {
        this.creditNoteService
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
