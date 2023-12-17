import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import * as fromService from '../../../../shared/index';
import { GSTR1Filter } from '../../../../shared/index';

@Component({
  selector: 'app-gstr1-sales',
  templateUrl: './gstr1-sales.component.html',
  styleUrls: ['./gstr1-sales.component.scss']
})
export class Gstr1SalesComponent implements OnInit {
  PageTitle: string = 'GSTR 1(Sales)';

  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  gstr1Form = this.fb.group({
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
  });

  constructor(
    private gstService: fromService.GstService,
    private fb: FormBuilder,
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
    let filter: GSTR1Filter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
    };

    this.gstService.PrintGSTR1(filter).subscribe((response) => {
        const blob = new Blob([response as Blob], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], 'GSTR1.xlsx', {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
    });
  }

  get FromDateControl() {
    return this.gstr1Form.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.gstr1Form.get('ToDate') as FormControl;
  }
}
