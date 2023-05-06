import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  Accounts,
  accountsDropDownResponse,
  AccountsPostRequest,
  AccountsPutRequest,
  accountTradeTypeResponse,
  accountTypeResponse,
  areaDownDownResponse,
  balanceTransferToResponse,
  groupDownDownResponse,
  salesTypeResponse,
  stateDownDownResponse,
  transactionTypeResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import { tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-accounts-add-edit',
  templateUrl: './accounts-add-edit.component.html',
  styleUrls: ['./accounts-add-edit.component.scss'],
})
export class AccountsAddEditComponent implements OnInit {
  PageTitle: string = 'Create Account';
  buttonText: string = 'Add New Account';
  isEditMode: boolean = false;
  selectedAccountId: number;
  accountPostRequest?: AccountsPostRequest;
  accountPutRequest?: AccountsPutRequest;
  editAccount?: Accounts;
  isAccountNameValid: boolean = false;
  AccountName: string = '';
  AccountNameExists: Subject<any> = new Subject();
  isBookInitValid: boolean = false;
  BookInit: string = '';
  BookInitExists: Subject<any> = new Subject();
  groupDropDown: groupDownDownResponse[] = [];
  balanceTransferToDropDown: balanceTransferToResponse[] = [];
  accountTypeDropDown: accountTypeResponse[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  salesTypeDropDown: salesTypeResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  stateDropDown: stateDownDownResponse[] = [];
  areaDropDown: areaDownDownResponse[] = [];
  salesBookDropDown: accountsDropDownResponse[] = [];

  disableBookType: boolean = true;
  disableSaleBookType: boolean = true;
  disableTradeType: boolean = true;
  disableBookInit: boolean = true;
  disabledefaultBook: boolean = true;
  disableaddredd: boolean = true;
  disablearea: boolean = true;
  disableContact: boolean = true;
  isFromQuickMenu: boolean = false;

  accountForm = this.fb.group({
    AccountName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
      ],
    ],
    LegalName: [
      '',
      [Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i)],
    ],
    GroupID: ['', [Validators.required]],
    BalanceTransferToID: ['', [Validators.required]],
    AccountTypeID: ['', [Validators.required]],
    TransactionTypeID: [''],
    SalesTypeID: [''],
    AccountTradeTypeID: [''],
    HeadAccountID: [''],
    BookInit: ['', [Validators.pattern(/^([a-zA-Z0-9])+$/i)]],
    Address: [''],
    CityName: ['', [Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i)]],
    PinCode: ['', [Validators.pattern(/^([0-9])+$/i)]],
    StateID: [''],
    AreaID: [''],
    GSTNo: [
      '',
      [
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
        ),
      ],
    ],
    PAN: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)]],
    ContactPerson: ['', [Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)]],
    ContactNo: ['', [Validators.pattern(/^([0-9,-/+])+$/i)]],

    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private accountService: fromService.AccountsService,
    private commonService: fromService.CommonService,
    private groupService: fromService.GroupService,
    private areaService: fromService.AreaService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedAccountId = 0;

    this.FillGroupDropDown();
    this.FillBalanceTransferToDropDown();
    this.FillAccountTypeDropDown();
    this.FillStateDropDown();
    this.FillAreaDropDown();
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Account';
    this.isFromQuickMenu = false;
    if (!this.router.url.includes('quickmenu')) {
      this.route.params
        .pipe(
          tap((params) => {
            this.selectedAccountId = params['accountid'] || 0;
          })
        )
        .subscribe();
      if (this.selectedAccountId != 0) {
        this.isEditMode = true;
        this.PageTitle = 'Update Account';
        this.getAccountByID();
      } else {
        this.isEditMode = false;
      }
    } else {
      this.isFromQuickMenu = true;
    }
    this.AccountNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckAccountNameExists(this.AccountName);
    });

    this.BookInitExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckBookInitExists(this.BookInit);
    });
  }

  //Controls

  get accountNameControl() {
    return this.accountForm.get('AccountName') as FormControl;
  }

  get accountNameControlRequired() {
    return (
      this.accountNameControl.hasError('required') &&
      this.accountNameControl.touched
    );
  }

  get accountNameControlInvalid() {
    return (
      this.accountNameControl.hasError('pattern') &&
      this.accountNameControl.touched
    );
  }

  get BalanceTransferToIDControl() {
    return this.accountForm.get('BalanceTransferToID') as FormControl;
  }

  get accountTypeIDControl() {
    return this.accountForm.get('AccountTypeID') as FormControl;
  }

  get transactionTypeIDControl() {
    return this.accountForm.get('TransactionTypeID') as FormControl;
  }

  get transactionTypeIDControlRequired() {
    return (
      this.transactionTypeIDControl.hasError('required') &&
      this.transactionTypeIDControl.touched
    );
  }

  get salesTypeIDControl() {
    return this.accountForm.get('SalesTypeID') as FormControl;
  }

  get salesTypeIDControlRequired() {
    return (
      this.salesTypeIDControl.hasError('required') &&
      this.salesTypeIDControl.touched
    );
  }

  get accountTradeTypeIDControl() {
    return this.accountForm.get('AccountTradeTypeID') as FormControl;
  }

  get accountTradeTypeIDControlRequired() {
    return (
      this.accountTradeTypeIDControl.hasError('required') &&
      this.accountTradeTypeIDControl.touched
    );
  }

  get bookInitControl() {
    return this.accountForm.get('BookInit') as FormControl;
  }

  get bookInitControlRequired() {
    return (
      this.bookInitControl.hasError('required') && this.bookInitControl.touched
    );
  }

  get bookInitControlInvalid() {
    return (
      this.bookInitControl.hasError('pattern') && this.bookInitControl.touched
    );
  }

  get headAccountIDControl() {
    return this.accountForm.get('HeadAccountID') as FormControl;
  }

  get headAccountIDControlRequired() {
    return (
      this.headAccountIDControl.hasError('required') &&
      this.headAccountIDControl.touched
    );
  }

  get areaIDControl() {
    return this.accountForm.get('AreaID') as FormControl;
  }

  get areaIDControlRequired() {
    return (
      this.areaIDControl.hasError('required') && this.areaIDControl.touched
    );
  }

  get addressControl() {
    return this.accountForm.get('Address') as FormControl;
  }

  get addressControlRequired() {
    return (
      this.addressControl.hasError('required') && this.addressControl.touched
    );
  }

  get addressControlInvalid() {
    return (
      this.addressControl.hasError('pattern') && this.addressControl.touched
    );
  }

  get stateIDControl() {
    return this.accountForm.get('StateID') as FormControl;
  }

  get stateIDControlRequired() {
    return (
      this.stateIDControl.hasError('required') && this.stateIDControl.touched
    );
  }

  get cityNameControl() {
    return this.accountForm.get('CityName') as FormControl;
  }

  get cityNameControlRequired() {
    return (
      this.cityNameControl.hasError('required') && this.cityNameControl.touched
    );
  }

  get cityNameControlInvalid() {
    return (
      this.cityNameControl.hasError('pattern') && this.cityNameControl.touched
    );
  }

  get pinCodeControl() {
    return this.accountForm.get('PinCode') as FormControl;
  }

  get pinCodeControlRequired() {
    return (
      this.pinCodeControl.hasError('required') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlInvalid() {
    return (
      this.pinCodeControl.hasError('pattern') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlMinLength() {
    return (
      this.pinCodeControl.hasError('minLength') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlMaxLength() {
    return (
      this.pinCodeControl.hasError('maxLength') && this.pinCodeControl.touched
    );
  }

  get GSTNoControl() {
    return this.accountForm.get('GSTNo') as FormControl;
  }

  get GSTNoControlInvalid() {
    return this.GSTNoControl.hasError('pattern') && this.GSTNoControl.touched;
  }

  get PANControl() {
    return this.accountForm.get('PAN') as FormControl;
  }

  get PANControlInvalid() {
    return this.PANControl.hasError('pattern') && this.PANControl.touched;
  }

  get contactPersonControl() {
    return this.accountForm.get('ContactPerson') as FormControl;
  }

  get contactPersonControlRequired() {
    return (
      this.contactPersonControl.hasError('required') &&
      this.contactPersonControl.touched
    );
  }

  get contactPersonControlInvalid() {
    return (
      this.contactPersonControl.hasError('pattern') &&
      this.contactPersonControl.touched
    );
  }

  get contactNoControl() {
    return this.accountForm.get('ContactNo') as FormControl;
  }

  get contactNoControlRequired() {
    return (
      this.contactNoControl.hasError('required') &&
      this.contactNoControl.touched
    );
  }

  get contactNoControlInvalid() {
    return (
      this.contactNoControl.hasError('pattern') && this.contactNoControl.touched
    );
  }

  //Controls

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/master/accounts/list']);
    } else {
      this.ResetAccountForm(this.accountForm);
    }
  }

  ResetAccountForm(form: FormGroup) {
    form.reset({
      AccountName: '',
      LegalName: '',
      GroupID: '',
      BalanceTransferToID: '',
      AccountTypeID: '',
      TransactionTypeID: '',
      SalesTypeID: '',
      AccountTradeTypeID: '',
      HeadAccountID: '',
      BookInit: '',
      Address: '',
      CityName: '',
      PinCode: '',
      StateID: '',
      AreaID: '',
      GSTNo: '',
      PAN: '',
      ContactPerson: '',
      ContactNo: '',
      isActive: true,
    });
    let control: AbstractControl;
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
  }

  onAccountNameKeyUp($event: any) {
    this.AccountName = $event.target.value.trim();
    this.AccountNameExists.next(this.AccountName);
  }

  CheckAccountNameExists(AccountName: string) {
    if (AccountName != '') {
      this.accountService
        .CheckAccountsNameExists(this.selectedAccountId, AccountName)
        .subscribe((response) => {
          this.isAccountNameValid = response;
        });
    }
  }

  getAccountNameValidation() {
    if (this.isAccountNameValid) {
      this.accountForm.controls.AccountName.setErrors({
        isAccountNameValid: true,
      });
    } else {
      this.accountForm.controls.AccountName.updateValueAndValidity();
    }
    return this.isAccountNameValid;
  }

  onBookInitKeyUp($event: any) {
    this.BookInit = $event.target.value.trim();
    this.BookInitExists.next(this.BookInit);
  }

  CheckBookInitExists(BookInit: string) {
    if (BookInit != '') {
      this.accountService
        .CheckBookInitExists(this.selectedAccountId, BookInit)
        .subscribe((response) => {
          this.isBookInitValid = response;
        });
    }
  }

  getBookInitValidation() {
    if (this.isBookInitValid) {
      this.accountForm.controls.BookInit.setErrors({
        isBookInitValid: true,
      });
    } else {
      this.accountForm.controls.BookInit.updateValueAndValidity();
    }
    return this.isBookInitValid;
  }

  getAccountByID() {
    this.accountService
      .GetAccountsbyID(this.selectedAccountId)
      .subscribe((response) => {
        this.editAccount = response;
        this.accountTypeIDSelectionChange(
          this.editAccount!.accountTypeID.toString()
        );
        this.transactionTypeIDSelectionChange(
          this.editAccount!.transactionTypeID.toString()
        );
        this.accountForm.patchValue({
          AccountName: this.editAccount!.accountName,
          LegalName: this.editAccount!.legalName,
          GroupID: this.editAccount!.groupID.toString(),
          BalanceTransferToID: this.editAccount!.balanceTransferToID.toString(),
          AccountTypeID: this.editAccount!.accountTypeID.toString(),
          TransactionTypeID: this.editAccount!.transactionTypeID.toString(),
          SalesTypeID: this.editAccount!.salesTypeID.toString(),
          AccountTradeTypeID: this.editAccount!.accountTradeTypeID.toString(),
          HeadAccountID: this.editAccount!.headAccountID.toString(),
          BookInit: this.editAccount!.bookInit,
          Address: this.editAccount!.address,
          CityName: this.editAccount!.cityName,
          PinCode: this.editAccount!.pinCode,
          StateID: this.editAccount!.stateID.toString(),
          AreaID: this.editAccount!.areaID.toString(),
          GSTNo: this.editAccount!.gstNo,
          PAN: this.editAccount!.pan,
          ContactPerson: this.editAccount!.contactPerson,
          ContactNo: this.editAccount!.contactNo,
          isActive: this.editAccount!.isActive,
        });
      });
  }

  SaveUpdateAccount(accountForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateAccount(accountForm);
    } else {
      this.SaveAccount(accountForm);
    }
  }

  SaveAccount(accountForm: FormGroup) {
    this.accountPostRequest = {
      accountName: accountForm.value.AccountName,
      legalName: accountForm.value.LegalName,
      groupID: Number(accountForm.value.GroupID),
      balanceTransferToID: Number(accountForm.value.BalanceTransferToID),
      accountTypeID: Number(accountForm.value.AccountTypeID),
      transactionTypeID: Number(accountForm.value.TransactionTypeID),
      salesTypeID: Number(accountForm.value.SalesTypeID),
      accountTradeTypeID: Number(accountForm.value.AccountTradeTypeID),
      headAccountID: Number(accountForm.value.HeadAccountID),
      bookInit: accountForm.value.BookInit,
      address: accountForm.value.Address,
      cityName: accountForm.value.CityName,
      pinCode: accountForm.value.PinCode,
      stateID: Number(accountForm.value.StateID),
      areaID: Number(accountForm.value.AreaID),
      gSTNo: accountForm.value.GSTNo,
      pAN: accountForm.value.PAN,
      contactPerson: accountForm.value.ContactPerson,
      contactNo: accountForm.value.ContactNo,
      isActive: accountForm.value.isActive,
    };
    this.accountService
      .createAccounts(this.accountPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateAccount(accountForm: FormGroup) {
    this.accountPutRequest = {
      accountName: accountForm.value.AccountName,
      legalName: accountForm.value.LegalName,
      groupID: Number(accountForm.value.GroupID),
      balanceTransferToID: Number(accountForm.value.BalanceTransferToID),
      accountTypeID: Number(accountForm.value.AccountTypeID),
      transactionTypeID: Number(accountForm.value.TransactionTypeID),
      salesTypeID: Number(accountForm.value.SalesTypeID),
      accountTradeTypeID: Number(accountForm.value.AccountTradeTypeID),
      headAccountID: Number(accountForm.value.HeadAccountID),
      bookInit: accountForm.value.BookInit,
      address: accountForm.value.Address,
      cityName: accountForm.value.CityName,
      pinCode: accountForm.value.PinCode,
      stateID: Number(accountForm.value.StateID),
      areaID: Number(accountForm.value.AreaID),
      gSTNo: accountForm.value.GSTNo,
      pAN: accountForm.value.PAN,
      contactPerson: accountForm.value.ContactPerson,
      contactNo: accountForm.value.ContactNo,
      isActive: accountForm.value.isActive,
    };
    this.accountService
      .updateAccounts(this.selectedAccountId, this.accountPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  //Fill DropDown

  FillGroupDropDown() {
    this.groupDropDown = [];
    this.groupService.GroupDropDown().subscribe((response) => {
      this.groupDropDown = response;
    });
  }

  FillBalanceTransferToDropDown() {
    this.balanceTransferToDropDown = [];
    this.commonService.BalanceTransferToDropDown().subscribe((response) => {
      this.balanceTransferToDropDown = response;
    });
  }

  FillAccountTypeDropDown() {
    this.accountTypeDropDown = [];
    this.commonService.AccountTypeDropDown().subscribe((response) => {
      this.accountTypeDropDown = response;
    });
  }

  FillTransactionTypeDropDown(AccountType: string) {
    this.transactionTypeDropDown = [];
    this.commonService
      .TransactionTypeDropDown()
      .subscribe((response: transactionTypeResponse[]) => {
        this.transactionTypeDropDown = response.filter((a) =>
          a.accountTypeID.includes(AccountType)
        );
      });
  }

  FillSalesTypeDropDown(TransactionTypeID: string) {
    this.salesTypeDropDown = [];
    this.commonService
      .SalesTypeDropDown()
      .subscribe((response: salesTypeResponse[]) => {
        this.salesTypeDropDown = response.filter((a) =>
          a.transactionTypeID.includes(TransactionTypeID)
        );
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

  FillStateDropDown() {
    this.stateDropDown = [];
    this.commonService.StateDropDown().subscribe((response) => {
      this.stateDropDown = response;
    });
  }

  FillAreaDropDown() {
    this.areaDropDown = [];
    this.areaService.AreaDropDown().subscribe((response) => {
      this.areaDropDown = response;
    });
  }

  FillAccountDropDown(transactionTypeID: number) {
    let filters = {
      GroupID: 0,
      BalanceTransferToID: 0,
      AccountTypeID: 0,
      TransactionTypeID: transactionTypeID,
      SalesTypeID: 0,
      AccountTradeTypeID: 0,
      AreaID: 0,
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.salesBookDropDown = response;
    });
  }

  groupSelectionChange(event: any) {
    let SelectedData = this.groupDropDown.find((a) => a.group_Id == event);
    this.BalanceTransferToIDControl.setValue(
      SelectedData?.balanceTransferToID.toString()
    );
  }

  accountTypeIDSelectionChange(event: any) {
    this.disableBookType = true;
    this.disableSaleBookType = true;
    this.disableTradeType = true;
    this.disableBookInit = true;
    this.disabledefaultBook = true;
    debugger;
    this.disableaddredd = true;
    this.disablearea = true;
    this.disableContact = true;
    this.FillTransactionTypeDropDown(event);
    this.FillAccountTradeTypeDropDown(event);
    switch (Number(event)) {
      case 1: //General
        this.transactionTypeIDControl.setValue('1');
        this.accountTradeTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
        break;
      case 2: //Customer
        this.FillAccountDropDown(5);
        this.transactionTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
        this.disableTradeType = false;
        this.disabledefaultBook = false;
        debugger;
        this.disableaddredd = false;
        this.disablearea = false;
        this.disableContact = false;
        break;
      case 3: //Supplier
        this.transactionTypeIDControl.setValue('1');
        this.accountTradeTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
        debugger;
        this.disableaddredd = false;
        this.disableContact = false;
        break;
      case 4: //Head/Books
        this.transactionTypeIDControl.setValue('');
        this.accountTradeTypeIDControl.setValue('1');
        this.disableBookType = false;
        this.disableBookInit = false;
        break;
      case 5: //Proprietor/Partners
        this.transactionTypeIDControl.setValue('1');
        this.accountTradeTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
        debugger;
        this.disableaddredd = false;
        break;
    }
  }

  transactionTypeIDSelectionChange(event: any) {
    this.disableSaleBookType = true;
    this.FillSalesTypeDropDown(event);
    switch (Number(event)) {
      case 3:
        debugger;
        this.salesTypeIDControl.setValue('1');
        break;
      case 5:
        this.salesTypeIDControl.setValue('');
        break;
      default:
        this.salesTypeIDControl.setValue('1');
        break;
    }
  }
}
