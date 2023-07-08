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
  VJournalPostRequest,
  VJournalPutRequest,
  VJournalResponse,
} from 'src/app/shared';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-vjournal-add-edit',
  templateUrl: './vjournal-add-edit.component.html',
  styleUrls: ['./vjournal-add-edit.component.scss'],
})
export class VJournalAddEditComponent implements OnInit {
  PageTitle: string = 'Create Journal Voucher';
  buttonText: string = 'Add New Journal Voucher';
  isEditMode: boolean = false;
  isFromQuickMenu: boolean = false;
  selectedVoucherId: number;

  voucherPostRequest?: VJournalPostRequest;
  voucherPutRequest?: VJournalPutRequest;
  editVoucher?: VJournalResponse;

  booksDropDown: accountsDropDownResponse[] = [];
  rAccountsDropDown: accountsDropDownResponse[] = [];
  gAccountsDropDown: accountsDropDownResponse[] = [];
  filteredRAccountsDropDown?: Observable<accountsDropDownResponse[]>;
  filteredGAccountsDropDown?: Observable<accountsDropDownResponse[]>;
  VoucherMinDate?: Date;
  VoucherMaxDate?: Date;
  BothAccountisSame: boolean = false;
  BookBalance: number = 0;
  BookBalanceType: string = 'Cr';
  RAccountBalance: number = 0;
  RAccountBalanceType: string = 'Cr';
  GAccountBalance: number = 0;
  GAccountBalanceType: string = 'Cr';

  voucherForm = this.fb.group({
    VoucherType: [''],
    TransactionTypeID: [''],
    BookAccountID: ['', [Validators.required]],
    VoucherDate: ['', [Validators.required]],
    VoucherNo: ['', [Validators.required]],
    RefNo: ['', [Validators.required]],
    RAccountID: ['', [Validators.required]],
    GAccountID: ['', [Validators.required]],
    Narration: ['', [Validators.required]],
    Amount: ['0'],
  });

  @ViewChild('AutoRAccountID') AutoRAccountID?: MatAutocomplete;
  @ViewChild('AutoGAccountID') AutoGAccountID?: MatAutocomplete;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private sstorage: fromService.LocalStorageService,
    private voucherService: fromService.VJournalService,
    private accountService: fromService.AccountsService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.isEditMode = false;
    this.selectedVoucherId = 0;
    this.FillBooksDropDown();
    this.FillRAccountDropDown();
    this.FillGAccountDropDown();
    this.SetMinMaxVoucherDate();
  }

  ngOnInit(): void {
    this.filteredRAccountsDropDown = this.RAccountIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.account_Name;
        return name
          ? this._filterRAccount(name as string)
          : this.rAccountsDropDown.slice();
      })
    );

    this.filteredGAccountsDropDown = this.GAccountIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.account_Name;
        return name
          ? this._filterGAccount(name as string)
          : this.gAccountsDropDown.slice();
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
        this.PageTitle = 'Update Journal Voucher';
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
      this.router.navigate(['/transaction/v-journal/list']);
    } else {
      this.ResetForm(this.voucherForm);
    }
  }

  getVoucherByID() {
    this.voucherService
      .GetVJournalbyID(this.selectedVoucherId)
      .subscribe((response) => {
        this.editVoucher = response;
        let RSeletedAccount: accountsDropDownResponse;
        RSeletedAccount = this.rAccountsDropDown.filter(
          (a) => a.account_Id == this.editVoucher?.receiverAccountID.toString()
        )[0];

        let GSeletedAccount: accountsDropDownResponse;
        GSeletedAccount = this.gAccountsDropDown.filter(
          (a) => a.account_Id == this.editVoucher?.giverAccountID.toString()
        )[0];

        this.voucherForm.patchValue({
          BookAccountID: this.editVoucher?.bookAccountID.toString(),
          VoucherNo: this.editVoucher?.voucherNo.toString(),
          RefNo: this.editVoucher?.refNo,
          Amount: SetFormatCurrency(this.editVoucher?.amount),
          Narration: this.editVoucher?.narration,
        });

        this.VoucherDateControl.setValue(moment(this.editVoucher?.voucherDate));
        this.RAccountIDControl.setValue(RSeletedAccount);
        this.GAccountIDControl.setValue(GSeletedAccount);
        this.GetCurrentAccountBalance(
          Number(this.editVoucher?.bookAccountID),
          1
        );
        this.GetCurrentAccountBalance(
          Number(this.editVoucher?.receiverAccountID),
          2
        );
        this.GetCurrentAccountBalance(
          Number(this.editVoucher?.giverAccountID),
          3
        );
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
      voucherType: 'JV',
      voucherNo: Number(voucherForm.value.VoucherNo),
      refNo: voucherForm.value.RefNo,
      voucherDate: voucherForm.value.VoucherDate.format('YYYY-MM-DD'),
      transactionTypeID: Number(TransactionTypeID),
      bookAccountID: Number(voucherForm.value.BookAccountID),
      receiverAccountID: Number(voucherForm.value.RAccountID.account_Id),
      giverAccountID: Number(voucherForm.value.GAccountID.account_Id),
      amount: CheckIsNumber(voucherForm.value.Amount),
      narration: voucherForm.value.Narration,
      isActive: true,
    };
    this.voucherService
      .createVJournal(this.voucherPostRequest)
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
      voucherType: 'JV',
      voucherNo: Number(voucherForm.value.VoucherNo),
      refNo: voucherForm.value.RefNo,
      voucherDate: voucherForm.value.VoucherDate.format('YYYY-MM-DD'),
      transactionTypeID: Number(TransactionTypeID),
      bookAccountID: Number(voucherForm.value.BookAccountID),
      receiverAccountID: Number(voucherForm.value.RAccountID.account_Id),
      giverAccountID: Number(voucherForm.value.GAccountID.account_Id),
      amount: CheckIsNumber(voucherForm.value.Amount),
      narration: voucherForm.value.Narration,
      isActive: true,
    };
    this.voucherService
      .updateVJournal(this.editVoucher!.autoID, this.voucherPutRequest)
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
      TransactionTypeID: [TransactionTypeMaster.Journal_Voucher],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.booksDropDown = response;
    });
  }

  FillRAccountDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [
        AccountTypeMaster.General,
        AccountTypeMaster.Customer,
        AccountTypeMaster.Proprietor_Partners,
        AccountTypeMaster.Supplier,
      ],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.rAccountsDropDown = response;
      this.RAccountIDControl.setValue('');
    });
  }

  FillGAccountDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [
        AccountTypeMaster.General,
        AccountTypeMaster.Customer,
        AccountTypeMaster.Proprietor_Partners,
        AccountTypeMaster.Supplier,
      ],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.gAccountsDropDown = response;
      this.GAccountIDControl.setValue('');
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

  OnRAccountBlur() {
    if (
      this.AutoRAccountID?.isOpen == false &&
      this.RAccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#RAccountName', true).focus();
    }
    if (this.RAccountIDControl.value != '') {
      this.GetCurrentAccountBalance(
        Number(this.RAccountIDControl.value.account_Id),
        2
      );
      this.CheckBothAccountisSame();
    }
  }

  OnGAccountBlur() {
    if (
      this.AutoGAccountID?.isOpen == false &&
      this.GAccountIDControl.value == ''
    ) {
      this.renderer.selectRootElement('#GAccountName', true).focus();
    }
    if (this.GAccountIDControl.value != '') {
      this.GetCurrentAccountBalance(
        Number(this.GAccountIDControl.value.account_Id),
        3
      );
      this.CheckBothAccountisSame();
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
              this.RAccountBalance = response.balance;
              this.RAccountBalanceType = response.balanceType;
              break;
            case 3:
              this.GAccountBalance = response.balance;
              this.GAccountBalanceType = response.balanceType;
              break;
          }
        });
    }
  }

  private _filterRAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.rAccountsDropDown.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }

  private _filterGAccount(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.gAccountsDropDown.filter((option) =>
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

  get RAccountIDControl() {
    return this.voucherForm.get('RAccountID') as FormControl;
  }

  get GAccountIDControl() {
    return this.voucherForm.get('GAccountID') as FormControl;
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

  CheckBothAccountisSame() {
    this.BothAccountisSame =
      Number(this.RAccountIDControl.value.account_Id) ==
      Number(this.GAccountIDControl.value.account_Id)
        ? true
        : false;
    if (this.BothAccountisSame == true) {
      this.RAccountIDControl.setErrors({
        BothAccountisSame: this.BothAccountisSame,
      });
      this.GAccountIDControl.setErrors({
        BothAccountisSame: this.BothAccountisSame,
      });
    } else {
      this.RAccountIDControl.updateValueAndValidity();
      this.GAccountIDControl.updateValueAndValidity();
    }
  }
}
