import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  AccessRights,
  AccountBalancePutRequest,
  AccountBalanceResponse,
  accountsDropDownResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';
import * as defaultData from '../../../../data/index';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss'],
})
export class OpeningBalanceComponent implements OnInit {
  @ViewChild('AutoAccountID') AutoAccountID?: MatAutocomplete;

  PageTitle: string = 'Opening Balance';
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  filteredaccountsDropDown?: Observable<accountsDropDownResponse[]>;
  balanceListData: AccountBalanceResponse[] = [];
  balancePutRequest?: AccountBalancePutRequest;
  isSameBalance: boolean = true;
  currentAccountID: number;
  AccountData?: AccountBalanceResponse;

  balanceForm = this.fb.group({
    AccountID: ['', [Validators.required]],
    Balance: [0, [Validators.required, Validators.pattern(/^([0-9,-/+])+$/i)]],
    BalanceType: ['Cr', [Validators.required]],
  });

  constructor(
    private accountService: fromService.AccountsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.currentAccountID = 0;
    this.accRights = this.route.snapshot.data['userRights'];
    this.accountsDropDown = [];
    this.setColumns();
    this.GetAccountBalance();
    this.FillAccountDropDown(3);
  }

  ngOnInit(): void {
    this.filteredaccountsDropDown = this.accountIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.account_Name;
        return name
          ? this._filterAccounts(name as string)
          : this.accountsDropDown.slice();
      })
    );
  }

  private _filterAccounts(name: string): accountsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.accountsDropDown.filter((option) =>
      option.account_Name.toLowerCase().includes(filterValue)
    );
  }

  OnAccountblur() {
    if (this.AutoAccountID?.isOpen == false) {
      if (this.accountIDControl.value == '') {
        this.renderer.selectRootElement('#AccountName', true).focus();
      }
    }
  }

  SelectedAccount(event: any) {
    this.getAccountDetails(Number(event.option.value.account_Id));
  }

  DisplayAccountName(accounts: accountsDropDownResponse) {
    return accounts && accounts.account_Name ? accounts.account_Name : '';
  }

  getAccountDetails(AccountID: number) {
    this.currentAccountID = AccountID;
    this.AccountData = this.balanceListData.find(
      (a) => a.accountID == AccountID
    );
    if (this.AccountData) {
      let balance: number;
      let balanceType: string;

      balance =
        this.AccountData.creditBalance > 0
          ? this.AccountData.creditBalance
          : this.AccountData.debitBalance;
      balanceType = this.AccountData.creditBalance > 0 ? 'Cr' : 'Dr';
      this.balanceForm.patchValue({
        Balance: balance,
        BalanceType: balanceType,
      });
    }
  }

  setColumns() {
    this.columns = defaultData.GetAccountBalanceColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 70,
      width: '70px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          buttontype: 'button',
          iif: (record) => {
            return this.accRights!.canEdit;
          },
          click: (record) => this.edit(record),
        },
      ],
    });
  }

  get accountIDControl() {
    return this.balanceForm.get('AccountID') as FormControl;
  }

  get accountIDControlRequired() {
    return (
      this.accountIDControl.hasError('required') &&
      this.accountIDControl.touched
    );
  }

  get balanceControl() {
    return this.balanceForm.get('Balance') as FormControl;
  }

  get balanceControlRequired() {
    return (
      this.balanceControl.hasError('required') && this.balanceControl.touched
    );
  }

  get balanceControlInvalid() {
    return (
      this.balanceControl.hasError('pattern') && this.balanceControl.touched
    );
  }

  get balanceTypeControl() {
    return this.balanceForm.get('BalanceType') as FormControl;
  }

  GetAccountBalance() {
    this.accountService.GetAccountBalance().subscribe((response) => {
      this.balanceListData = response.body;
      let CreditBalanceSum: number = 0;
      let DebitBalanceSum: number = 0;
      this.balanceListData.forEach((element) => {
        CreditBalanceSum = CreditBalanceSum + Number(element.creditBalance);
        DebitBalanceSum = DebitBalanceSum + Number(element.debitBalance);
      });
      this.isSameBalance =
        CreditBalanceSum - DebitBalanceSum == 0 ? true : false;
    });
  }

  FillAccountDropDown(balanceTransferToID: number) {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [balanceTransferToID],
      AccountTypeID: [],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
      this.accountIDControl.setValue('');
    });
  }

  edit(value: any) {
    this.AccountData = this.balanceListData.find(
      (a) => a.accountID == Number(value.accountID)
    );

    let SeletedAccount: accountsDropDownResponse;
    SeletedAccount = this.accountsDropDown.filter(
      (a) => a.account_Id == this.AccountData?.accountID.toString()
    )[0];

    let balance: number;
    let balanceType: string;
    balance =
      value.creditBalance > 0 ? value.creditBalance : value.debitBalance;
    balanceType = value.creditBalance > 0 ? 'Cr' : 'Dr';
    this.balanceForm.patchValue({
      Balance: balance,
      BalanceType: balanceType,
    });
    this.accountIDControl.setValue(SeletedAccount);
      this.renderer.selectRootElement('#AccountName', true).focus();
  }

  UpdateBalance(balanceForm: FormGroup) {
    this.balancePutRequest = {
      balance:
        balanceForm.value.BalanceType == 'Cr'
          ? balanceForm.value.Balance * -1
          : balanceForm.value.Balance,
    };
    this.accountService
      .UpdateBalance(balanceForm.value.AccountID.account_Id, this.balancePutRequest)
      .subscribe((response) => {
        this.ResetForms(balanceForm);
        this.GetAccountBalance();
      });
  }

  ResetForms(balanceForm: FormGroup) {
    let control: AbstractControl;
    balanceForm.reset();
    balanceForm.markAsUntouched();
    Object.keys(balanceForm.controls).forEach((name) => {
      control = balanceForm.controls[name];
      control.setErrors(null);
    });
    this.accountIDControl.setValue('');
    this.balanceControl.setValue(0);
    this.balanceTypeControl.setValue('Cr');
  }

  getTotalBalance(data: any) {
    return data.reduce((acc: any, value: any) => acc + value, 0);
  }
}
