import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as fromService from '../../../shared/index';
import {
  ItemSoftwareDetails,
  ItemSoftwareResponse,
} from '../../../shared/index';

@Component({
  selector: 'app-item-software-details',
  templateUrl: './item-software-details.component.html',
  styleUrls: ['./item-software-details.component.scss'],
})
export class ItemSoftwareDetailsComponent implements OnInit {
  DialogTitle: string = '';
  SoftwareDetails!: ItemSoftwareDetails;
  Type: string = '';
  softwareDropDown: ItemSoftwareResponse[] = [];

  softwareForm = this.fb.group({
    SoftwareID: ['', [Validators.required]],
    ItemName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
      ],
    ],
  });

  constructor(
    public dialogRef: MatDialogRef<ItemSoftwareDetailsComponent>,
    private commonService: fromService.CommonService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.FillSoftwareDropDown();
  }

  ngOnInit(): void {
    this.SoftwareDetails = this.data.SoftwareDetails;
    this.Type = this.data.objType;
    if (this.SoftwareDetails.isAdd == true) {
      this.EditSoftwareDetails();
    }
    if (
      this.SoftwareDetails.autoID != 0 &&
      this.SoftwareDetails.isAdd == false
    ) {
      this.EditSoftwareDetails();
    }
  }

  FillSoftwareDropDown() {
    this.softwareDropDown = [];
    this.commonService
      .SoftwareDropDown()
      .subscribe((response: ItemSoftwareResponse[]) => {
        this.softwareDropDown = response;
      });
  }

  EditSoftwareDetails() {
    this.softwareForm.patchValue({
      SoftwareID: this.SoftwareDetails.softwareID.toString(),
      ItemName: this.SoftwareDetails.itemName,
    });
  }

  onClickOk() {
    //Pass GSTDetails to Add Database
    let tmpSoftwareDetails: ItemSoftwareDetails = {
      autoID: this.SoftwareDetails.autoID,
      softwareID: this.softwareIDControl.value,
      softwareInit: this.softwareDropDown.filter((a) => a.softwareID)[0]
        .softwareInit,
      itemName: this.itemNameControl.value!,
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

  get itemNameControl() {
    return this.softwareForm.get('ItemName') as FormControl;
  }

  get itemNameControlRequired() {
    return (
      this.itemNameControl.hasError('required') &&
      this.itemNameControl.touched
    );
  }

  get itemNameControlInvalid() {
    return (
      this.itemNameControl.hasError('pattern') &&
      this.itemNameControl.touched
    );
  }
}
