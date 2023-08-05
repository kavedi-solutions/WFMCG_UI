import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  accountsDropDownResponse,
  CompanySettingPutRequest,
  CompanySettingResponse,
} from 'src/app/shared';
import * as fromService from '../../../shared/services/index';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss'],
})
export class CompanySettingsComponent implements OnInit {
  PageTitle: string = 'Company Settings';
  editsetting?: CompanySettingResponse;
  isEditMode: boolean = false;
  settingPutRequest?: CompanySettingPutRequest;
  accountsDropDown: accountsDropDownResponse[] = [];

  settingsForm = this.fb.group({
    DiscPostingAccount: ['', [Validators.required]],
    RoundingOffPostingAccount: ['', [Validators.required]],
    SchemePostingAccount: ['', [Validators.required]],
    OtherAddInputPostingAc: ['', [Validators.required]],
    OtherLessInputPostingAc: ['', [Validators.required]],
    OtherAddOutputPostingAc: ['', [Validators.required]],
    OtherLessOutputPostingAc: ['', [Validators.required]],
    FinYearStartMonth: ['', [Validators.required]],
    ManageBilltoBill: [false],
    SpoiledReturnDays: [
      90,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(150),
        Validators.pattern(/^([0-9,-/+])+$/i),
      ],
    ],
    GoodsReturnDays: [
      10,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(150),
        Validators.pattern(/^([0-9,-/+])+$/i),
      ],
    ],
    InvoiceCopy: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(9),
        Validators.pattern(/^([1-9])+$/i),
      ],
    ],
    GSTLoginID: [''],
    GSTLoginPassword: [''],
    EIAspUserId: [''],
    EIAspPassword: [''],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: fromService.AccountsService,
    private settingsService: fromService.CompanySettingsService
  ) {
    this.FillAccountDropDown(1);
    this.GetCompanySettings();
  }

  ngOnInit(): void {}

  FillAccountDropDown(accountTypeID: number) {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [accountTypeID],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
    });
  }

  GetCompanySettings() {
    this.settingsService.GetCompanySettingsbyID().subscribe((response) => {
      this.editsetting = response;
      this.settingsForm.patchValue({
        DiscPostingAccount: this.editsetting?.discPostingAccount.toString(),
        RoundingOffPostingAccount:
          this.editsetting?.roundingOffPostingAccount.toString(),
        SchemePostingAccount: this.editsetting?.schemePostingAccount.toString(),
        OtherAddInputPostingAc:
          this.editsetting?.otherAddInputPostingAc.toString(),
        OtherLessInputPostingAc:
          this.editsetting?.otherLessInputPostingAc.toString(),
        OtherAddOutputPostingAc:
          this.editsetting?.otherAddOutputPostingAc.toString(),
        OtherLessOutputPostingAc:
          this.editsetting?.otherLessOutputPostingAc.toString(),
        FinYearStartMonth: this.editsetting?.finYearStartMonth.toString(),
        ManageBilltoBill: this.editsetting?.manageBilltoBill,
        SpoiledReturnDays: this.editsetting?.spoiledReturnDays,
        GoodsReturnDays: this.editsetting?.goodsReturnDays,
        InvoiceCopy: this.editsetting?.invoiceCopy,
        GSTLoginID: this.editsetting?.gstLoginID,
        GSTLoginPassword: this.editsetting?.gstLoginPassword,
        EIAspUserId: this.editsetting?.eiAspUserId,
        EIAspPassword: this.editsetting?.eiAspPassword,
      });
    });
  }

  EditRecord() {
    this.isEditMode = true;
  }

  CancelClick() {
    this.isEditMode = false;
    this.GetCompanySettings();
  }

  UpdateCompanySettings(settingsForm: FormGroup) {
    this.settingPutRequest = {
      discPostingAccount: settingsForm.value.DiscPostingAccount,
      roundingOffPostingAccount: settingsForm.value.RoundingOffPostingAccount,
      schemePostingAccount: settingsForm.value.SchemePostingAccount,
      otherAddInputPostingAc: settingsForm.value.OtherAddInputPostingAc,
      otherLessInputPostingAc: settingsForm.value.OtherLessInputPostingAc,
      otherAddOutputPostingAc: settingsForm.value.OtherAddOutputPostingAc,
      otherLessOutputPostingAc: settingsForm.value.OtherLessOutputPostingAc,
      finYearStartMonth: settingsForm.value.FinYearStartMonth,
      manageBilltoBill: settingsForm.value.ManageBilltoBill,
      spoiledReturnDays: settingsForm.value.SpoiledReturnDays,
      goodsReturnDays: settingsForm.value.GoodsReturnDays,
      invoiceCopy: settingsForm.value.InvoiceCopy,
      gstLoginID: settingsForm.value.GSTLoginID,
      gstLoginPassword: settingsForm.value.GSTLoginPassword,
      eiAspUserId: settingsForm.value.EIAspUserId,
      eiAspPassword: settingsForm.value.EIAspPassword,
    };
    this.settingsService
      .updateCompanySettings(this.settingPutRequest!)
      .subscribe((response) => {
        this.CancelClick();
      });
  }

  //Controls

  get DiscPostingAccountControl() {
    return this.settingsForm.get('DiscPostingAccount') as FormControl;
  }

  get DiscPostingAccountControlRequired() {
    return (
      this.DiscPostingAccountControl.hasError('required') &&
      this.DiscPostingAccountControl.touched
    );
  }

  get RoundingOffPostingAccountControl() {
    return this.settingsForm.get('RoundingOffPostingAccount') as FormControl;
  }

  get RoundingOffPostingAccountControlRequired() {
    return (
      this.RoundingOffPostingAccountControl.hasError('required') &&
      this.RoundingOffPostingAccountControl.touched
    );
  }

  get SchemePostingAccountControl() {
    return this.settingsForm.get('SchemePostingAccount') as FormControl;
  }

  get SchemePostingAccountControlRequired() {
    return (
      this.SchemePostingAccountControl.hasError('required') &&
      this.SchemePostingAccountControl.touched
    );
  }

  get OtherAddInputPostingAcControl() {
    return this.settingsForm.get('OtherAddInputPostingAc') as FormControl;
  }

  get OtherAddInputPostingAcControlRequired() {
    return (
      this.OtherAddInputPostingAcControl.hasError('required') &&
      this.OtherAddInputPostingAcControl.touched
    );
  }

  get OtherLessInputPostingAcControl() {
    return this.settingsForm.get('OtherLessInputPostingAc') as FormControl;
  }

  get OtherLessInputPostingAcControlRequired() {
    return (
      this.OtherLessInputPostingAcControl.hasError('required') &&
      this.OtherLessInputPostingAcControl.touched
    );
  }

  get OtherAddOutputPostingAcControl() {
    return this.settingsForm.get('OtherAddOutputPostingAc') as FormControl;
  }

  get OtherAddOutputPostingAcControlRequired() {
    return (
      this.OtherAddOutputPostingAcControl.hasError('required') &&
      this.OtherAddOutputPostingAcControl.touched
    );
  }

  get OtherLessOutputPostingAcControl() {
    return this.settingsForm.get('OtherLessOutputPostingAc') as FormControl;
  }

  get OtherLessOutputPostingAcControlRequired() {
    return (
      this.OtherLessOutputPostingAcControl.hasError('required') &&
      this.OtherLessOutputPostingAcControl.touched
    );
  }

  get FinYearStartMonthControl() {
    return this.settingsForm.get('FinYearStartMonth') as FormControl;
  }

  get FinYearStartMonthControlRequired() {
    return (
      this.FinYearStartMonthControl.hasError('required') &&
      this.FinYearStartMonthControl.touched
    );
  }

  get ManageBilltoBillControl() {
    return this.settingsForm.get('ManageBilltoBill') as FormControl;
  }

  get SpoiledReturnDaysControl() {
    return this.settingsForm.get('SpoiledReturnDays') as FormControl;
  }

  get SpoiledReturnDaysControlRequired() {
    return (
      this.SpoiledReturnDaysControl.hasError('required') &&
      this.SpoiledReturnDaysControl.touched
    );
  }

  get SpoiledReturnDaysControlInvalid() {
    return (
      this.SpoiledReturnDaysControl.hasError('pattern') &&
      this.SpoiledReturnDaysControl.touched
    );
  }

  get SpoiledReturnDaysControlmin() {
    return (
      this.SpoiledReturnDaysControl.hasError('min') && this.SpoiledReturnDaysControl.touched
    );
  }

  get SpoiledReturnDaysControlmax() {
    return (
      this.SpoiledReturnDaysControl.hasError('max') && this.SpoiledReturnDaysControl.touched
    );
  }

  get GoodsReturnDaysControl() {
    return this.settingsForm.get('GoodsReturnDays') as FormControl;
  }

  get GoodsReturnDaysControlRequired() {
    return (
      this.GoodsReturnDaysControl.hasError('required') &&
      this.GoodsReturnDaysControl.touched
    );
  }

  get GoodsReturnDaysControlInvalid() {
    return (
      this.GoodsReturnDaysControl.hasError('pattern') &&
      this.GoodsReturnDaysControl.touched
    );
  }

  get GoodsReturnDaysControlmin() {
    return (
      this.GoodsReturnDaysControl.hasError('min') && this.GoodsReturnDaysControl.touched
    );
  }

  get GoodsReturnDaysControlmax() {
    return (
      this.GoodsReturnDaysControl.hasError('max') && this.GoodsReturnDaysControl.touched
    );
  }

  get InvoiceCopyControl() {
    return this.settingsForm.get('InvoiceCopy') as FormControl;
  }

  get InvoiceCopyControlRequired() {
    return (
      this.InvoiceCopyControl.hasError('required') &&
      this.InvoiceCopyControl.touched
    );
  }

  get InvoiceCopyControlInvalid() {
    return (
      this.InvoiceCopyControl.hasError('pattern') &&
      this.InvoiceCopyControl.touched
    );
  }

  get InvoiceCopyControlmin() {
    return (
      this.InvoiceCopyControl.hasError('min') && this.InvoiceCopyControl.touched
    );
  }

  get InvoiceCopyControlmax() {
    return (
      this.InvoiceCopyControl.hasError('max') && this.InvoiceCopyControl.touched
    );
  }

  get GSTLoginIDControl() {
    return this.settingsForm.get('GSTLoginID') as FormControl;
  }

  get GSTLoginPasswordControl() {
    return this.settingsForm.get('GSTLoginPassword') as FormControl;
  }

  get EIAspUserIdControl() {
    return this.settingsForm.get('EIAspUserId') as FormControl;
  }

  get EIAspPasswordControl() {
    return this.settingsForm.get('EIAspPassword') as FormControl;
  }
}
