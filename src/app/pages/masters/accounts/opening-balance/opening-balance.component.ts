import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
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

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss'],
})
export class OpeningBalanceComponent implements OnInit {
  PageTitle: string = 'Opening Balance';
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  accountsDropDown: accountsDropDownResponse[] = [];
  balanceListData: AccountBalanceResponse[] = [];
  balancePutRequest?: AccountBalancePutRequest;
  isSameBalance: boolean = true;

  balanceForm = this.fb.group({
    AccountID: ['', [Validators.required]],
    Balance: [0, [Validators.required, Validators.pattern(/^([0-9,-/+])+$/i)]],
    BalanceType: ['Cr', [Validators.required]],
  });

  constructor(
    private accountService: fromService.AccountsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.accountsDropDown = [];
    this.setColumns();
    this.GetAccountBalance();
    this.FillAccountDropDown(3);
  }

  ngOnInit(): void {}

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
      GroupID: 0,
      BalanceTransferToID: balanceTransferToID,
      AccountTypeID: 0,
      TransactionTypeID: 0,
      SalesTypeID: 0,
      AccountTradeTypeID: 0,
      AreaID: 0,
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
    });
  }

  edit(value: any) {
    let balance: number;
    let balanceType: string;
    balance =
      value.creditBalance > 0 ? value.creditBalance : value.debitBalance;
    balanceType = value.creditBalance > 0 ? 'Cr' : 'Dr';
    this.balanceForm.patchValue({
      AccountID: value.accountID.toString(),
      Balance: balance,
      BalanceType: balanceType,
    });
  }

  UpdateBalance(balanceForm: FormGroup) {
    this.balancePutRequest = {
      balance:
        balanceForm.value.BalanceType == 'Cr'
          ? balanceForm.value.Balance * -1
          : balanceForm.value.Balance,
    };
    this.accountService
      .UpdateBalance(balanceForm.value.AccountID, this.balancePutRequest)
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
    this.balanceControl.setValue(0);
    this.balanceTypeControl.setValue('Cr');
  }

  getTotalCost(data: any) {
    return data.reduce((acc: any, value: any) => acc + value, 0);
  }
}
