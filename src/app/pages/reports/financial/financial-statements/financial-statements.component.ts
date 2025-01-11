import { Component, OnInit } from '@angular/core';
import * as fromService from '../../../../shared/index';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-financial-statements',
  templateUrl: './financial-statements.component.html',
  styleUrls: ['./financial-statements.component.scss'],
})
export class FinancialStatementsComponent implements OnInit {
  PageTitle: string = 'Financial Statement';

  AsOnDateMinDate?: Date;
  AsOnDateMaxDate?: Date;

  finStatementForm = this.fb.group({
    AsOnDate: ['', [Validators.required]],
    ReportType: ['TB'],
    ReportStyle: ['B'],
    OutputType: ['L'],
  });

  constructor(
    private fb: FormBuilder,
    private financialService: fromService.FinancialService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.SetMinMaxFromDate();
  }

  ngOnInit(): void {}

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    this.AsOnDateMinDate = new Date(currentYear - 20, 0, 1);
    this.AsOnDateMaxDate = new Date();
    this.AsOnDateControl.setValue(moment(new Date()));
  }

  get AsOnDateControl() {
    return this.finStatementForm.get('AsOnDate') as FormControl;
  }

  GenerateStatement() {}
}
