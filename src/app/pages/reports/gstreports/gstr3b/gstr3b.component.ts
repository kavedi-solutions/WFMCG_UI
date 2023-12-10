import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { PdfViewerDialogComponent } from 'src/app/theme';
import * as fromService from '../../../../shared/index';
import { GSTR3BFilter } from '../../../../shared/index';

@Component({
  selector: 'app-gstr3b',
  templateUrl: './gstr3b.component.html',
  styleUrls: ['./gstr3b.component.scss'],
})
export class Gstr3bComponent implements OnInit {
  PageTitle: string = 'GSTR 3B';

  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;

  gstr3bForm = this.fb.group({
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    ReportType: ['1', [Validators.required]],
  });

  constructor(
    private gstService: fromService.GstService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
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
    let filter: GSTR3BFilter = {
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      reportType: this.ReportTypeControl.value,
    };

    this.gstService.PrintGSTR3B(filter).subscribe((response) => {
      if (filter.reportType == 1) {
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
      } else if (filter.reportType == 2) {
        const blob = new Blob([response as Blob], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], 'GSTR3B.xlsm', {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
        // const blob = new Blob([response as Blob], { type: 'application/octet-stream' });
        // const url= window.URL.createObjectURL(blob);
        // window.open(url);
      }
    });
  }

  get FromDateControl() {
    return this.gstr3bForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.gstr3bForm.get('ToDate') as FormControl;
  }

  get ReportTypeControl() {
    return this.gstr3bForm.get('ReportType') as FormControl;
  }
}
