import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ItemGSTDetails, Tax, TaxDownDownResponse } from 'src/app/shared';
import * as fromService from '../../../shared/index';
import { DatePipe, formatNumber } from '@angular/common';

@Component({
  selector: 'app-item-tax-mapping',
  templateUrl: './item-tax-mapping.component.html',
  styleUrls: ['./item-tax-mapping.component.scss'],
})
export class ItemTaxMappingComponent implements OnInit {
  DialogTitle: string = '';
  GSTDetails!: ItemGSTDetails;
  Type: string = '';
  TaxDetails?: Tax;
  taxDropDown: TaxDownDownResponse[] = [];
  IsDisableControls: boolean = false;

  ApplicableMinDate?: Date;
  ApplicableMaxDate?: Date;

  gstForm = this.fb.group({
    GSTTaxID: ['', [Validators.required]],
    ApplicableDate: ['', [Validators.required]],
    PurchaseRate: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    PurchaseRateWT: [''],
    SalesRate: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
    SalesRateWT: [''],
    Margin: [
      '',
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^([0-9.,])+$/i),
      ],
    ],
  });

  constructor(
    public dialogRef: MatDialogRef<ItemTaxMappingComponent>,
    private fb: FormBuilder,
    private taxService: fromService.TaxService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taxDropDown = [];
    this.FillTaxDropDown();
    this.SetMinMaxApplicableDate();
  }

  FillTaxDropDown() {
    this.taxService.TaxDropDown().subscribe((response) => {
      this.taxDropDown = response;
    });
  }

  SetMinMaxApplicableDate() {
    const currentDate = new Date();
    this.ApplicableMinDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    this.ApplicableMaxDate = new Date(
      this.ApplicableMinDate.getFullYear(),
      this.ApplicableMinDate.getMonth() + 2,
      this.ApplicableMinDate.getDate()
    );
    this.ApplicableDateControl.setValue(moment(this.ApplicableMinDate));
  }

  ngOnInit(): void {
    this.GSTDetails = this.data.objGSTDetails;
    this.Type = this.data.objType;
    if (this.GSTDetails.autoID != 0) {
      this.EditGSTDetails();
    }
  }

  EditGSTDetails() {
    let ApplicableMinDate = this.datepipe.transform(
      this.ApplicableMinDate,
      'yyyy-MM-dd'
    );
    let ApplicableDate = this.datepipe.transform(
      this.GSTDetails.applicableDate,
      'yyyy-MM-dd'
    );
    this.IsDisableControls = false;
    if (ApplicableDate! < ApplicableMinDate!) {
      this.ApplicableMinDate = new Date(this.GSTDetails.applicableDate);
      this.IsDisableControls = true;
    }

    this.gstForm.patchValue({
      GSTTaxID: this.GSTDetails.gstTaxID.toString(),
      ApplicableDate: this.GSTDetails.applicableDate,
      PurchaseRate: this.GSTDetails.purchaseRate.toString(),
      SalesRate: this.GSTDetails!.salesRate.toString(),
      Margin: this.GSTDetails!.margin.toString(),
    });
    this.GSTTaxIDSelectionChange(this.GSTDetails!.gstTaxID.toString());
  }

  GSTTaxIDSelectionChange(event: any) {
    this.taxService.GetTaxbyID(Number(event)).subscribe((response) => {
      this.TaxDetails = response;
      this.CalculateRates();
    });
  }

  CalculateRates() {
    let PurchaseRate = Number(this.PurchaseRateControl.value.replace(/,/g, ''));
    let SalesRate = Number(this.SalesRateControl.value.replace(/,/g, ''));
    let TotalTaxRate = this.TaxDetails!.totalTaxRate;
    let PurchaseRateWT = PurchaseRate + PurchaseRate * (TotalTaxRate / 100);
    let SalesRateWT = SalesRate + SalesRate * (TotalTaxRate / 100);
    this.PurchaseRateWTControl.setValue(
      formatNumber(PurchaseRateWT, 'en-IN', '0.2-2')
    );
    this.SalesRateWTControl.setValue(
      formatNumber(SalesRateWT, 'en-IN', '0.2-2')
    );
    let Profit = SalesRate - PurchaseRate;
    let margin = (Profit / PurchaseRate) * 100;
    this.MarginControl.setValue(formatNumber(margin, 'en-IN', '0.2-2'));
  }

  onClickOk() {
    //Pass GSTDetails to Add Database
    let tmpGSTDetails: ItemGSTDetails = {
      autoID: this.GSTDetails.autoID,
      applicableDate: this.ApplicableDateControl.value,
      gstTaxID: this.GSTTaxIDControl.value,
      taxName: this.TaxDetails!.taxName,
      totalTaxRate: this.TaxDetails!.totalTaxRate,
      purchaseRate: +this.PurchaseRateControl.value.replace(/,/g, ''),
      purchaseRateWT: +this.PurchaseRateWTControl.value.replace(/,/g, ''),
      salesRate: +this.SalesRateControl.value.replace(/,/g, ''),
      salesRateWT: +this.SalesRateWTControl.value.replace(/,/g, ''),
      margin: +this.MarginControl.value.replace(/,/g, ''),
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

  get GSTTaxIDControl() {
    return this.gstForm.get('GSTTaxID') as FormControl;
  }

  get GSTTaxIDControlRequired() {
    return (
      this.GSTTaxIDControl.hasError('required') && this.GSTTaxIDControl.touched
    );
  }

  get ApplicableDateControl() {
    return this.gstForm.get('ApplicableDate') as FormControl;
  }

  get PurchaseRateControl() {
    return this.gstForm.get('PurchaseRate') as FormControl;
  }

  get PurchaseRateControlRequired() {
    return (
      this.PurchaseRateControl.hasError('required') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateControlInvalid() {
    return (
      this.PurchaseRateControl.hasError('pattern') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateControlMin() {
    return (
      this.PurchaseRateControl.hasError('min') &&
      this.PurchaseRateControl.touched
    );
  }

  get PurchaseRateWTControl() {
    return this.gstForm.get('PurchaseRateWT') as FormControl;
  }

  get SalesRateControl() {
    return this.gstForm.get('SalesRate') as FormControl;
  }

  get SalesRateControlRequired() {
    return (
      this.SalesRateControl.hasError('required') &&
      this.SalesRateControl.touched
    );
  }

  get SalesRateControlInvalid() {
    return (
      this.SalesRateControl.hasError('pattern') && this.SalesRateControl.touched
    );
  }

  get SalesRateControlMin() {
    return (
      this.SalesRateControl.hasError('min') && this.SalesRateControl.touched
    );
  }

  get SalesRateWTControl() {
    return this.gstForm.get('SalesRateWT') as FormControl;
  }

  get MarginControl() {
    return this.gstForm.get('Margin') as FormControl;
  }

  get MarginControlRequired() {
    return (
      this.MarginControl.hasError('required') && this.MarginControl.touched
    );
  }

  get MarginControlInvalid() {
    return this.MarginControl.hasError('pattern') && this.MarginControl.touched;
  }

  get MarginControlMin() {
    return this.MarginControl.hasError('min') && this.MarginControl.touched;
  }

  onBlurPurchaseRate() {
    let Value = this.PurchaseRateControl.value;
    this.PurchaseRateControl.setValue(formatNumber(Value, 'en-IN', '0.2-2'));
  }

  onFocusPurchaseRate() {
    let Value = Number(this.PurchaseRateControl.value.replace(/,/g, ''));
    this.PurchaseRateControl.setValue(Value > 0 ? Value : '');
  }

  onBlurSalesRate() {
    let Value = this.SalesRateControl.value;
    this.SalesRateControl.setValue(formatNumber(Value, 'en-IN', '0.2-2'));
  }

  onFocusSalesRate() {
    let Value = Number(this.SalesRateControl.value.replace(/,/g, ''));
    this.SalesRateControl.setValue(Value > 0 ? Value : '');
  }
}
