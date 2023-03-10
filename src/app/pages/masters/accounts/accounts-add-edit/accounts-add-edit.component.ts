import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  Accounts,
  accountsDownDownResponse,
  AccountsPostRequest,
  AccountsPutRequest,
  accountTradeTypeResponse,
  accountTypeResponse,
  areaDownDownResponse,
  balanceTransferToResponse,
  groupDownDownResponse,
  salesTypeResponse,
  scheduleResponse,
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
  groupDropDown: groupDownDownResponse[] = [];
  balanceTransferToDropDown: balanceTransferToResponse[] = [];
  accountTypeDropDown: accountTypeResponse[] = [];
  transactionTypeDropDown: transactionTypeResponse[] = [];
  salesTypeDropDown: salesTypeResponse[] = [];
  accountTradeTypeDropDown: accountTradeTypeResponse[] = [];
  stateDropDown: stateDownDownResponse[] = [];
  areaDropDown: areaDownDownResponse[] = [];
  salesBookDropDown:accountsDownDownResponse[] = [];

  accountForm = this.fb.group({
    AccountName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    LegalName: [''],
    GroupID: ['', [Validators.required]],
    BalanceTransferToID: [''],
    AccountTypeID: [''],
    TransactionTypeID: [''],
    SalesTypeID: [''],
    AccountTradeTypeID: [''],
    HeadAccountID: [''],
    BookInit: [''],
    Address: [''],
    CityName: [''],
    PinCode: [''],
    StateID: [''],
    AreaID: [''],
    GSTNo: [''],
    PAN: [''],
    ContactPerson: [''],
    ContactNo: [''],
    OpeningBalance: [''],
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
    this.groupDropDown = [];
    this.balanceTransferToDropDown = [];
    this.accountTypeDropDown = [];
    this.transactionTypeDropDown = [];
    this.salesTypeDropDown = [];
    this.accountTradeTypeDropDown = [];
    this.stateDropDown = [];
    this.areaDropDown = [];

    this.FillGroupDropDown();
    this.FillBalanceTransferToDropDown();
    this.FillAccountTypeDropDown();
    this.FillTransactionTypeDropDown();
    this.FillSalesTypeDropDown();
    this.FillSalesTypeDropDown();
    this.FillAccountTradeTypeDropDown();
    this.FillStateDropDown();
    this.FillAreaDropDown();
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Account';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedAccountId = params['areaid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedAccountId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Account';
      //this.getAreaByID();
    } else {
      this.isEditMode = false;
    }
    this.AccountNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckAccountNameExists(this.AccountName);
    });
  }

  //Controls

  get accountNameControl() {
    return this.accountForm.get('AccountName') as FormControl;
  }

  get accountNameControlControlRequired() {
    return (
      this.accountNameControl.hasError('required') &&
      this.accountNameControl.touched
    );
  }

  get accountNameControlControlInvalid() {
    return (
      this.accountNameControl.hasError('pattern') &&
      this.accountNameControl.touched
    );
  }

  //Controls

  BacktoList() {
    this.router.navigate(['/master/accounts/list']);
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

  SaveUpdateAccount(accountForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateAccount(accountForm);
    } else {
      this.SaveAccount(accountForm);
    }
  }

  SaveAccount(accountForm: FormGroup) {
    // this.accountPostRequest = {
    //   name: accountForm.value.name.toString(),
    //   isActive: accountForm.value.isActive,
    // };
    // this.areaService.createArea(this.areaPostRequest).subscribe((response) => {
    //   this.BacktoList();
    // });
  }

  UpdateAccount(accountForm: FormGroup) {
    // this.areaPutRequest = {
    //   name: accountForm.value.name.toString(),
    //   isActive: accountForm.value.isActive,
    // };
    // this.areaService
    //   .updateArea(this.selectedAreaId, this.areaPutRequest!)
    //   .subscribe((response) => {
    //     this.BacktoList();
    //   });
  }

  //Fill DropDown

  FillGroupDropDown() {
    this.groupService.GroupDropDown().subscribe((response) => {
      debugger;
      this.groupDropDown = response;
    });
  }

  FillBalanceTransferToDropDown() {
    this.commonService.BalanceTransferToDropDown().subscribe((response) => {
      this.balanceTransferToDropDown = response;
    });
  }

  FillAccountTypeDropDown() {
    this.commonService.AccountTypeDropDown().subscribe((response) => {
      this.accountTypeDropDown = response;
    });
  }

  FillTransactionTypeDropDown() {
    this.commonService.TransactionTypeDropDown().subscribe((response) => {
      this.transactionTypeDropDown = response;
    });
  }

  FillSalesTypeDropDown() {
    this.commonService.SalesTypeDropDown().subscribe((response) => {
      this.salesTypeDropDown = response;
    });
  }

  FillAccountTradeTypeDropDown() {
    this.commonService.AccountTradeTypeDropDown().subscribe((response) => {
      this.accountTradeTypeDropDown = response;
    });
  }

  FillStateDropDown() {
    this.commonService.StateDropDown().subscribe((response) => {
      this.stateDropDown = response;
    });
  }

  FillAreaDropDown() {
    this.areaService.AreaDropDown().subscribe((response) => {
      this.areaDropDown = response;
    });
  }
}
