import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as defaultData from '../../../../data/index';
import { Subject } from 'rxjs';
import {
  AccountGSTDetails,
  AccountGSTPostRequest,
  AccountGSTPutRequest,
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
  TransactionTypeMaster,
  transactionTypeResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import { tap, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { GstDetailsComponent } from 'src/app/pages/dialogs';

@Component({
  selector: 'app-accounts-add-edit',
  templateUrl: './accounts-add-edit.component.html',
  styleUrls: ['./accounts-add-edit.component.scss'],
})
export class AccountsAddEditComponent implements OnInit {
  dialogRef: any;
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

  accountGSTDetailsList: AccountGSTDetails[] = [];
  accountGSTDetailsListData: AccountGSTDetails[] = [];
  columns: MtxGridColumn[] = [];

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
    PAN: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)]],
    ContactPerson: ['', [Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)]],
    InvoiceLimit: [0, [Validators.pattern(/^([0-9.])+$/i)]],
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
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.isEditMode = false;
    this.selectedAccountId = 0;

    this.FillGroupDropDown();
    this.FillBalanceTransferToDropDown();
    this.FillAccountTypeDropDown();
    this.FillStateDropDown();
    this.FillAreaDropDown();
    this.setColumns();
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

  setColumns() {
    this.columns = defaultData.GetAccountGSTColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 50,
      width: '90px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          iif: (record) => {
            if (record.status != 'CNL') return true;
            else return false;
          },
          click: (record) => this.EditGSTDetails(record),
        },
      ],
    });
  }

  AddGSTDetails() {
    let obj: AccountGSTDetails = {
      autoID: 0,
      gstNo: '',
      status: '',
      dtReg: '',
      dtDReg: '',
      isAdd: true,
      isModified: false,
    };
    this.OpenGSTDialog(obj, 'New');
  }

  EditGSTDetails(event: AccountGSTDetails) {
    this.OpenGSTDialog(event, 'Update');
  }

  OpenGSTDialog(obj: AccountGSTDetails, Type: string) {
    this.dialogRef = this.dialog.open(GstDetailsComponent, {
      minWidth: '60vw',
      minHeight: '60vh',
      maxWidth: '60vw',
      maxHeight: '60vh',
      panelClass: 'dialog-container',
      autoFocus: true,
      data: { objGSTDetails: obj, objType: Type },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result.CloseStatus == true) {
        if (result.RGSTDetails.isAdd == true) {
          this.accountGSTDetailsList.push(result.RGSTDetails);
        } else if (result.RGSTDetails.isModified == true) {
          let index = this.accountGSTDetailsList.findIndex(
            (a) => a.autoID == result.RGSTDetails.autoID
          );
          this.accountGSTDetailsList[index] = result.RGSTDetails;
        }
        this.accountGSTDetailsListData = [...this.accountGSTDetailsList];
      }
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

  get invoiceLimitControl() {
    return this.accountForm.get('InvoiceLimit') as FormControl;
  }

  get invoiceLimitControlInvalid() {
    return (
      this.invoiceLimitControl.hasError('pattern') &&
      this.invoiceLimitControl.touched
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
      // GSTDetails: {
      //   GSTNo: '',
      //   Status: '',
      //   DtReg: '',
      //   DtDReg: '',
      // },
    });

    let control: AbstractControl;
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });

    this.accountGSTDetailsListData = [...this.accountGSTDetailsList];
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
          PAN: this.editAccount!.pan,
          ContactPerson: this.editAccount!.contactPerson,
          ContactNo: this.editAccount!.contactNo,
          InvoiceLimit: this.editAccount!.invoiceLimit,
          isActive: this.editAccount!.isActive,
        });
        this.editAccount?.gstDetails?.forEach((element) => {
          let GSTDetails: AccountGSTDetails = {
            autoID: element.autoID,
            gstNo: element.gstNo,
            status: element.status,
            dtReg: element.dtReg,
            dtDReg: element.dtDReg,
            isAdd: false,
            isModified: false,
          };
          this.accountGSTDetailsList.push(GSTDetails);
        });

        this.accountGSTDetailsListData = [...this.accountGSTDetailsList];
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
    let PostRequestDetail: AccountGSTPostRequest[] = [];
    if (this.accountGSTDetailsList.length > 0) {
      this.accountGSTDetailsList.forEach((element) => {
        PostRequestDetail.push({
          gstNo: element.gstNo,
          status: element.status,
          dtReg: element.dtReg,
          dtDReg: element.dtDReg,
          isAdd: element.isAdd,
          isModified: element.isModified,
        });
      });
    }

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
      pAN: accountForm.value.PAN,
      contactPerson: accountForm.value.ContactPerson,
      contactNo: accountForm.value.ContactNo,
      invoiceLimit: accountForm.value.InvoiceLimit,
      isActive: accountForm.value.isActive,
      gstDetails: PostRequestDetail,
    };
    this.accountService
      .createAccounts(this.accountPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateAccount(accountForm: FormGroup) {
    let PutRequestDetail: AccountGSTPutRequest[] = [];
    if (this.accountGSTDetailsList.length > 0) {
      this.accountGSTDetailsList.forEach((element) => {
        PutRequestDetail.push({
          autoID: element.autoID,
          gstNo: element.gstNo,
          status: element.status,
          dtReg: element.dtReg,
          dtDReg: element.dtDReg,
          isAdd: element.isAdd,
          isModified: element.isModified,
        });
      });
    }

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
      pAN: accountForm.value.PAN,
      contactPerson: accountForm.value.ContactPerson,
      contactNo: accountForm.value.ContactNo,
      invoiceLimit: accountForm.value.InvoiceLimit,
      isActive: accountForm.value.isActive,
      gstDetails: PutRequestDetail,
    };
    this.accountService
      .updateAccounts(this.selectedAccountId, this.accountPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  DisableAddNewGST() {
    if (
      this.accountGSTDetailsListData.filter((a) => a.status == 'ACT').length > 0
    )
      return true;
    else return false;
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

  FillAccountDropDown() {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [],
      TransactionTypeID: [
        TransactionTypeMaster.Sales_Inventory,
        TransactionTypeMaster.Sales_Assets,
        TransactionTypeMaster.Sales_Service,
      ],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
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
        this.FillAccountDropDown();
        this.transactionTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
        this.disableTradeType = false;
        this.disabledefaultBook = false;
        this.disableaddredd = false;
        this.disablearea = false;
        this.disableContact = false;
        break;
      case 3: //Supplier
        this.transactionTypeIDControl.setValue('1');
        this.accountTradeTypeIDControl.setValue('1');
        this.transactionTypeIDSelectionChange('1');
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
        this.disableaddredd = false;
        break;
    }
  }

  transactionTypeIDSelectionChange(event: any) {
    this.disableSaleBookType = true;
    this.FillSalesTypeDropDown(event);
    switch (Number(event)) {
      case 21:
      case 22:
      case 23:
        this.disableSaleBookType = false;
        this.salesTypeIDControl.setValue('');
        break;
      default:
        this.salesTypeIDControl.setValue('1');
        break;
    }
  }
}
