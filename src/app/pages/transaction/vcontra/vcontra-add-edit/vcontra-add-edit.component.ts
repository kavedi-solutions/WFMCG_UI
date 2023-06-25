import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, startWith, tap } from 'rxjs';
import {
  accountsDropDownResponse,
  AccountTypeMaster,
  CurrentAccountBalanceResponse,
  TransactionTypeMaster,
  VContraPostRequest,
  VContraPutRequest,
  VContraResponse,
} from 'src/app/shared';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-vcontra-add-edit',
  templateUrl: './vcontra-add-edit.component.html',
  styleUrls: ['./vcontra-add-edit.component.scss'],
})
export class VContraAddEditComponent implements OnInit {
  PageTitle: string = 'Create Contra Voucher';
  buttonText: string = 'Add New Contra Voucher';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedVoucherId: number;

  voucherPostRequest?: VContraPostRequest;
  voucherPutRequest?: VContraPutRequest;
  editVoucher?: VContraResponse;

  booksDropDown: accountsDropDownResponse[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  VoucherMinDate?: Date;
  VoucherMaxDate?: Date;
  BookAndAccountisSame: boolean = false;
  BookBalance: number = 0;
  BookBalanceType: string = 'Cr';
  AccountBalance: number = 0;
  AccountBalanceType: string = 'Cr';

  voucherForm = this.fb.group({
    VoucherType: [''],
    TransactionTypeID: [''],
    BookAccountID: ['', [Validators.required]],
    VoucherDate: ['', [Validators.required]],
    VoucherNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    AccountID: ['', [Validators.required]],
    TransactionNo: [''],
    Narration: ['', [Validators.required]],
    Amount: ['0'],
  });

  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private voucherService: fromService.VContraService,
    private accountService: fromService.AccountsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.isEditMode = false;
    this.selectedVoucherId = 0;
    this.FillBooksDropDown();
    this.FillAccountDropDown();
    this.SetMinMaxVoucherDate();
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
            this.selectedVoucherId = params['voucherid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedVoucherId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Contra Voucher';
        this.getVoucherByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
  }

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/transaction/v-contra/list']);
    } else {
      this.ResetForm(this.voucherForm);
    }
  }

  getVoucherByID() {
    this.voucherService
      .GetVContrabyID(this.selectedVoucherId)
      .subscribe((response) => {
        this.editVoucher = response;
        let SeletedAccount: accountsDropDownResponse;
        SeletedAccount = this.accountsDropDown.filter(
          (a) => a.account_Id == this.editVoucher?.accountID.toString()
        )[0];

        this.voucherForm.patchValue({
          BookAccountID: this.editVoucher?.bookAccountID.toString(),
          VoucherNo: this.editVoucher?.voucherNo.toString(),
          RefNo: this.editVoucher?.refNo,
          Amount: SetFormatCurrency(this.editVoucher?.amount),
          Narration: this.editVoucher?.narration,
          TransactionNo: this.editVoucher?.transactionNo,
        });

        this.VoucherDateControl.setValue(moment(this.editVoucher?.voucherDate));
        this.AccountIDControl.setValue(SeletedAccount);
        this.GetCurrentAccountBalance(
          Number(this.editVoucher?.bookAccountID),
          1
        );
        this.GetCurrentAccountBalance(Number(this.editVoucher?.accountID), 2);
      });
  }

  SaveUpdateVoucher(voucherForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateVoucher(voucherForm);
    } else {
      this.SaveVoucher(voucherForm);
    }
  }

  SaveVoucher(voucherForm: FormGroup) {
    let BookId = this.BookAccountIDControl.value;
    let TransactionTypeID = this.booksDropDown.find(
      (a) => a.account_Id == BookId
    )?.transactionTypeID;
    this.voucherPostRequest = {
      voucherType: 'CV',
      voucherNo: Number(voucherForm.value.VoucherNo),
      refNo: voucherForm.value.RefNo,
      voucherDate: voucherForm.value.VoucherDate.format('YYYY-MM-DD'),
      transactionTypeID: Number(TransactionTypeID),
      bookAccountID: Number(voucherForm.value.BookAccountID),
      accountID: Number(voucherForm.value.AccountID.account_Id),
      amount: CheckIsNumber(voucherForm.value.Amount),
      transactionNo: voucherForm.value.TransactionNo,
      narration: voucherForm.value.Narration,
      isActive: true,
    };
    this.voucherService
      .createVContra(this.voucherPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateVoucher(voucherForm: FormGroup) {
    let BookId = this.BookAccountIDControl.value;
    let TransactionTypeID = this.booksDropDown.find(
      (a) => a.account_Id == BookId
    )?.transactionTypeID;
    this.voucherPutRequest = {
      voucherType: 'CV',
      voucherNo: Number(voucherForm.value.VoucherNo),
      refNo: voucherForm.value.RefNo,
      voucherDate: voucherForm.value.VoucherDate.format('YYYY-MM-DD'),
      transactionTypeID: Number(TransactionTypeID),
      bookAccountID: Number(voucherForm.value.BookAccountID),
      accountID: Number(voucherForm.value.AccountID.account_Id),
      amount: CheckIsNumber(voucherForm.value.Amount),
      transactionNo: voucherForm.value.TransactionNo,
      narration: voucherForm.value.Narration,
      isActive: true,
    };
    this.voucherService
      .updateVContra(this.editVoucher!.autoID, this.voucherPutRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  SetMinMaxVoucherDate() {
    const currentYear = new Date().getFullYear();
    this.VoucherMinDate = new Date(currentYear - 20, 0, 1);
    this.VoucherMaxDate = new Date();
    this.VoucherDateControl.setValue(moment(new Date()));
  }

  FillBooksDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [
        TransactionTypeMaster.Cash,
        TransactionTypeMaster.Bank,
      ],
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
      AccountTypeID: [AccountTypeMaster.Head_Books],
      TransactionTypeID: [
        TransactionTypeMaster.Cash,
        TransactionTypeMaster.Bank,
      ],
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

  VoucherDateChange() {
    this.GetNewVoucherNo();
  }

  VoucherDateBlur() {
    this.GetNewVoucherNo();
  }

  BookAccountIDblur() {
    this.GetNewVoucherNo();
    this.GetCurrentAccountBalance(Number(this.BookAccountIDControl.value), 1);
  }

  ResetForm(form: FormGroup) {
    let control: AbstractControl;
    form.reset({
      BookAccountID: '',
      VoucherDate: '',
      VoucherNo: '',
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
    this.SetMinMaxVoucherDate();
    this.renderer.selectRootElement('#BookAccountName', true).focus();
  }

  OnAccountBlur() {
    if (
      this.AutoAccountID?.isOpen == false &&
      this.AccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#AccountName', true).focus();
    }
    if (this.AccountIDControl.value != '') {
      this.GetCurrentAccountBalance(
        Number(this.AccountIDControl.value.account_Id),
        2
      );
      this.CheckBookAndAccountisSame();
    }
  }

  GetNewVoucherNo() {
    if (this.isEditMode == false) {
      let BookId = this.BookAccountIDControl.value;
      let BookInit = this.booksDropDown.find(
        (a) => a.account_Id == BookId
      )?.bookInit;
      let VoucherDate = this.VoucherDateControl.value.format('YYYY-MM-DD');
      if (BookId != '' && VoucherDate != '') {
        this.voucherService
          .GetNextVoucherNo(BookId, VoucherDate)
          .subscribe((response) => {
            this.VoucherNoControl.setValue(response);
            let RefNo = BookInit + '-' + response;
            this.RefNoControl.setValue(RefNo);
          });
      }
    }
  }

  GetCurrentAccountBalance(AccountID: number, AccountType: number) {
    if (AccountID != 0) {
      this.accountService
        .GetCurrentAccountBalance(AccountID)
        .subscribe((response: CurrentAccountBalanceResponse) => {
          switch (AccountType) {
            case 1:
              this.BookBalance = response.balance;
              this.BookBalanceType = response.balanceType;
              break;
            case 2:
              this.AccountBalance = response.balance;
              this.AccountBalanceType = response.balanceType;
              break;
          }
        });
    }
  }

  private _filterAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsDropDown.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }

  //Controls

  get VoucherTypeControl() {
    return this.voucherForm.get('VoucherType') as FormControl;
  }

  get TransactionTypeIDControl() {
    return this.voucherForm.get('TransactionTypeID') as FormControl;
  }

  get BookAccountIDControl() {
    return this.voucherForm.get('BookAccountID') as FormControl;
  }

  get VoucherDateControl() {
    return this.voucherForm.get('VoucherDate') as FormControl;
  }

  get VoucherNoControl() {
    return this.voucherForm.get('VoucherNo') as FormControl;
  }

  get RefNoControl() {
    return this.voucherForm.get('RefNo') as FormControl;
  }

  get AccountIDControl() {
    return this.voucherForm.get('AccountID') as FormControl;
  }

  get TransactionNoControl() {
    return this.voucherForm.get('TransactionNo') as FormControl;
  }

  get NarrationControl() {
    return this.voucherForm.get('Narration') as FormControl;
  }

  get NarrationControlRequired() {
    return (
      this.NarrationControl.hasError('required') &&
      this.NarrationControl.touched
    );
  }

  get NarrationControlInvalid() {
    return (
      this.NarrationControl.hasError('pattern') && this.NarrationControl.touched
    );
  }

  get AmountControl() {
    return this.voucherForm.get('Amount') as FormControl;
  }

  CheckBookAndAccountisSame() {
    this.BookAndAccountisSame =
      Number(this.AccountIDControl.value.account_Id) ==
      Number(this.BookAccountIDControl.value)
        ? true
        : false;
    if (this.BookAndAccountisSame == true) {
      this.AccountIDControl.setErrors({
        BookAndAccountisSame: this.BookAndAccountisSame,
      });
    } else {
      this.AccountIDControl.updateValueAndValidity();
    }
  }
}