import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as fromService from '../../../shared/index';
import {
  AccountSoftwareDetails,
  accountSoftwareResponse,
} from '../../../shared/index';

@Component({
  selector: 'app-software-details',
  templateUrl: './software-details.component.html',
  styleUrls: ['./software-details.component.scss'],
})
export class SoftwareDetailsComponent implements OnInit {
  DialogTitle: string = '';
  SoftwareDetails!: AccountSoftwareDetails;
  Type: string = '';
  softwareDropDown: accountSoftwareResponse[] = [];

  softwareForm = this.fb.group({
    SoftwareID: ['', [Validators.required]],
    AccountName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
      ],
    ],
  });

  constructor(
    public dialogRef: MatDialogRef<SoftwareDetailsComponent>,
    private commonService: fromService.CommonService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.FillSoftwareDropDown();
  }

  ngOnInit(): void {
    this.SoftwareDetails = this.data.SoftwareDetails;
    this.Type = this.data.objType;
    if (this.SoftwareDetails.isAdd == true)
    {
      this.EditSoftwareDetails();
    }
    if (this.SoftwareDetails.autoID != 0 && this.SoftwareDetails.isAdd == false) {
      this.EditSoftwareDetails();
    }
  }

  FillSoftwareDropDown() {
    this.softwareDropDown = [];
    this.commonService
      .SoftwareDropDown()
      .subscribe((response: accountSoftwareResponse[]) => {
        this.softwareDropDown = response;
      });
  }

  EditSoftwareDetails() {
    this.softwareForm.patchValue({
      SoftwareID: this.SoftwareDetails.softwareID.toString(),
      AccountName: this.SoftwareDetails.accountName,
    });
  }

  onClickOk() {
    //Pass GSTDetails to Add Database
    let tmpSoftwareDetails: AccountSoftwareDetails = {
      autoID: this.SoftwareDetails.autoID,
      softwareID: this.softwareIDControl.value,
      softwareInit: this.softwareDropDown.filter((a) => a.softwareID)[0]
        .softwareInit,
      accountName: this.accountNameControl.value!,
      isAdd: this.SoftwareDetails.autoID == 0 ? true : false,
      isModified: this.SoftwareDetails.autoID == 0 ? false : true,
      isDeleted: false,
    };
    this.dialogRef.close({
      CloseStatus: true,
      SoftwareDetails: tmpSoftwareDetails,
    });
  }

  onClickClose() {
    this.dialogRef.close({
      CloseStatus: false,
    });
  }

  get softwareIDControl() {
    return this.softwareForm.get('SoftwareID') as FormControl;
  }

  get softwareIDControlRequired() {
    return (
      this.softwareIDControl.hasError('required') &&
      this.softwareIDControl.touched
    );
  }

  get softwareIDControlInvalid() {
    return (
      this.softwareIDControl.hasError('pattern') &&
      this.softwareIDControl.touched
    );
  }

  get accountNameControl() {
    return this.softwareForm.get('AccountName') as FormControl;
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
}
