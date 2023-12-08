import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountGSTDetails, GstDetails } from 'src/app/shared';
import * as fromService from '../../../shared/index';

@Component({
  selector: 'app-gst-details',
  templateUrl: './gst-details.component.html',
  styleUrls: ['./gst-details.component.scss'],
})
export class GstDetailsComponent implements OnInit {
  DialogTitle: string = '';
  GSTDetails!: AccountGSTDetails;
  RGSTDetails!: AccountGSTDetails;
  Type: string = '';
  DataResponse!: GstDetails;

  gstForm = this.fb.group({
    GSTNo: [
      '',
      [
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
        ),
      ],
    ],
  });

  constructor(
    public dialogRef: MatDialogRef<GstDetailsComponent>,
    private fb: FormBuilder,
    private einvoiceService: fromService.EInvoiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.DataResponse = {
      Gstin: '',
      TradeName: '',
      LegalName: '',
      AddrBnm: '',
      AddrBno: '',
      AddrFlno: '',
      AddrSt: '',
      AddrLoc: '',
      StateCode: 0,
      AddrPncd: 0,
      Status: '',
      DtReg: '',
      DtDReg: '',
    };
  }

  ngOnInit(): void {
    this.GSTDetails = this.data.objGSTDetails;
    this.Type = this.data.objType;
    if (this.GSTDetails.autoID != 0) {
      this.EditGSTDetails();
    }
  }

  EditGSTDetails() {
    this.gstForm.patchValue({
      GSTNo: this.GSTDetails.gstNo,
    });
    this.DataResponse.Status = this.GSTDetails.status;
    this.DataResponse.DtReg = this.GSTDetails.dtReg;
    this.DataResponse.DtDReg = this.GSTDetails.dtDReg;
  }

  onClickOk() {
    //Pass GSTDetails to Add Database
    let tmpGSTDetails: AccountGSTDetails = {
      autoID: this.GSTDetails.autoID,
      gstNo: this.GSTNoControl.value,
      status: this.DataResponse.Status!,
      dtReg: this.DataResponse.DtReg!,
      dtDReg: this.DataResponse.DtDReg!,
      isAdd: this.GSTDetails.autoID == 0 ? true : false,
      isModified: this.GSTDetails.autoID == 0 ? false : true,
    };
    this.dialogRef.close({
      CloseStatus: true,
      RGSTDetails: tmpGSTDetails,
    });
  }

  onClickClose() {
    this.dialogRef.close({
      CloseStatus: false,
    });
  }

  VerifyGSTNo() {
    this.einvoiceService
      .GetGSTDetail(this.GSTNoControl.value)
      .subscribe((response) => {
        this.DataResponse = response;
      });
  }

  get GSTNoControl() {
    return this.gstForm.get('GSTNo') as FormControl;
  }

  get GSTNoControlChanged() {
    return this.GSTNoControl.dirty;
  }

  get GSTNoControlInvalid() {
    return this.GSTNoControl.hasError('pattern') && this.GSTNoControl.touched;
  }
}
