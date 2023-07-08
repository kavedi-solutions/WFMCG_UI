import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import {
  areaDownDownResponse,
  OutstandingRegisterFilter,
} from 'src/app/shared';
import { PdfViewerDialogComponent } from 'src/app/theme';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-outstanding-register',
  templateUrl: './outstanding-register.component.html',
  styleUrls: ['./outstanding-register.component.scss'],
})
export class OutstandingRegisterComponent implements OnInit {
  PageTitle: string = 'Outstanding Register';
  areaDropDown: areaDownDownResponse[] = [];

  AsOnDateMinDate?: Date;
  AsOnDateMaxDate?: Date;

  ShowArea: boolean = false;
  ShowMoreFilter: boolean = true;

  outstandingForm = this.fb.group({
    AsOnDate: ['', Validators.required],
    AreaWise: [false, [Validators.required]],
    AreaID: [''],
    OutstandingType: ['1', [Validators.required]],
    WithInvoice: [true],
  });

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private areaService: fromService.AreaService,
    private financialService: fromService.FinancialService
  ) {
    this.SetMinMaxFromDate();
    this.FillAreaDropDown();
  }

  ngOnInit(): void {}

  FillAreaDropDown() {
    this.areaDropDown = [];
    this.areaService.AreaDropDown().subscribe((response) => {
      this.areaDropDown = response;
    });
  }

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    this.AsOnDateMinDate = new Date(currentYear - 20, 0, 1);
    this.AsOnDateMaxDate = new Date();
    this.AsOnDateControl.setValue(moment(new Date()));
  }

  ChangeAreaWise() {
    this.ShowArea = this.AreaWiseControl.value;
    if (this.ShowArea == false) {
      this.AreaIDControl.setValue('');
      this.AreaIDControl.markAsUntouched();
      this.AreaIDControl.setErrors(null);
    }
  }

  ChangeOutstandingType(event: MatRadioChange) {
    this.ShowMoreFilter = event.value == '1' ? true : false;
    this.WithInvoiceControl.setValue(this.ShowMoreFilter);
    if (this.ShowMoreFilter == false) {
      this.AreaWiseControl.setValue(this.ShowMoreFilter);
      this.ChangeAreaWise();
    }
  }

  GenerateStatement() {
    let filter: OutstandingRegisterFilter = {
      asOnDate: this.AsOnDateControl.value.format('YYYY-MM-DD'),
      areaWise: this.AreaWiseControl.value,
      areaID:
        this.AreaIDControl.value == '' ? 0 : Number(this.AreaIDControl.value),
      outstandingType: this.OutstandingTypeControl.value,
      withInvoice: this.WithInvoiceControl.value,
    };

    this.financialService
      .PrintOutstandingReport(filter)
      .subscribe((response) => {
        var file = new Blob([response as Blob], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        this.dialog.open(PdfViewerDialogComponent, {
          data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
          minWidth: '80vw',
          minHeight: '90vh',
          maxWidth: '80vw',
          maxHeight: '90vh',
          panelClass: 'dialog-container',
          autoFocus: true,
        });
      });
  }

  get AsOnDateControl() {
    return this.outstandingForm.get('AsOnDate') as FormControl;
  }

  get AreaWiseControl() {
    return this.outstandingForm.get('AreaWise') as FormControl;
  }

  get AreaIDControl() {
    return this.outstandingForm.get('AreaID') as FormControl;
  }

  get AreaIDControlRequired() {
    return (
      this.AreaIDControl.hasError('required') && this.AreaIDControl.touched
    );
  }

  get OutstandingTypeControl() {
    return this.outstandingForm.get('OutstandingType') as FormControl;
  }

  get WithInvoiceControl() {
    return this.outstandingForm.get('WithInvoice') as FormControl;
  }
}
