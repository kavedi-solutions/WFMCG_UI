import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import * as fromService from '../../../../shared/index';
import { GSTR2Filter } from '../../../../shared/index';

@Component({
  selector: 'app-gstr2-purchase',
  templateUrl: './gstr2-purchase.component.html',
  styleUrls: ['./gstr2-purchase.component.scss'],
})
export class Gstr2PurchaseComponent implements OnInit {
  PageTitle: string = 'GSTR 2(Purchase)';

  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  gstr2Form = this.fb.group({
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
  });

  constructor(
    private gstService: fromService.GstService,
    private fb: FormBuilder
  ) {
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
  }

  ngOnInit(): void {}

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() - 1;
    this.FromMinDate = new Date(currentYear - 20, 0, 1);
    this.FromMaxDate = new Date();
    this.FromDateControl.setValue(
      moment(new Date(currentYear, currentMonth, 1))
    );
  }

  SetMinMaxToDate() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.ToMinDate = new Date(currentYear - 20, 0, 1);
    this.ToMaxDate = new Date();
    this.ToDateControl.setValue(moment(new Date(currentYear, currentMonth, 0)));
  }

  FromDateChange() {
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.ToMinDate = FromDate;
  }

  ToDateChange() {
    let ToDate = this.ToDateControl.value.format('YYYY-MM-DD');
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.FromMaxDate = ToDate;
    if (FromDate > ToDate) this.FromDateControl.setValue(moment(ToDate));
  }

  GenerateReport() {
    let filter: GSTR2Filter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
    };

    this.gstService.PrintGSTR2(filter).subscribe((response) => {
      const blob = new Blob([response as Blob], {
        type: 'application/vnd.ms.excel',
      });
      const file = new File([blob], 'GSTR2.xlsx', {
        type: 'application/vnd.ms.excel',
      });
      saveAs(file);
    });
  }

  get FromDateControl() {
    return this.gstr2Form.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.gstr2Form.get('ToDate') as FormControl;
  }
}
