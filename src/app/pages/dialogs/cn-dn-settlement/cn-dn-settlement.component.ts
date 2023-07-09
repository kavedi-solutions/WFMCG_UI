import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CNDNSettlementResponse, TableColumns } from 'src/app/shared';
import { CheckIsNumber, SetFormatCurrency } from 'src/app/shared/functions';
import * as defaultData from '../../../data/index';

@Component({
  selector: 'app-cn-dn-settlement',
  templateUrl: './cn-dn-settlement.component.html',
  styleUrls: ['./cn-dn-settlement.component.scss'],
})
export class CnDnSettlementComponent implements OnInit {
  DialogTitle: string = '';
  CnDnSettlementData: CNDNSettlementResponse[] = [];
  TotalNetAmount: number = 0;

  CnDnColumns: TableColumns[] = [];

  cndnForm = this.fb.group({
    Amount: [0],
    CnDnDetails: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CnDnSettlementComponent>
  ) {
    this.CnDnColumns = defaultData.GetCnDnDetails();
  }

  ngOnInit(): void {
    this.CnDnSettlementData.forEach((element) => {
      this.CnDnDetails.push(this.CreateCreditNote(element));
    });
    this.AmountControl().setValidators([
      Validators.max(this.TotalNetAmount),
      Validators.min(1),
    ]);
    this.CalculateTotals();
    this.CheckValidation();
  }

  getColumnsList(): TableColumns[] {
    return this.CnDnColumns.filter((cd) => cd.visible === true);
  }
  getDisplayedColumns(): string[] {
    return this.CnDnColumns.filter((cd) => cd.visible === true).map(
      (cd) => cd.columnName
    );
  }

  CalculateTotals() {
    let Total = 0;
    this.CnDnDetails.controls.forEach((element) => {
      Total = Number(Total) + Number(element.value.ReceiveAmount);
    });
    this.AmountControl().setValue(SetFormatCurrency(Total));
  }

  CreateCreditNote(item: CNDNSettlementResponse) {
    return this.fb.group({
      AutoID: new FormControl(item.autoID),
      CnDnType: new FormControl(item.cnDnType),
      CnDnTypeName: new FormControl(item.cnDnTypeName),
      CompanyID: new FormControl(item.companyID),
      CnDnID: new FormControl(item.cnDnID),
      RefNo: new FormControl(item.refNo),
      BillDate: new FormControl(item.billDate),
      AccountID: new FormControl(item.accountID),
      Amount: new FormControl(item.amount),
      PendingAmount: new FormControl(item.pendingAmount),
      ReceiveAmount: new FormControl(item.receiveAmount, [
        Validators.max(item.pendingAmount),
      ]),
    });
  }

  AmountControl() {
    return this.cndnForm.get('Amount') as FormControl;
  }

  AmountControlMaxError() {
    return this.AmountControl().hasError('max');
  }

  get CnDnDetails(): FormArray {
    return this.cndnForm.get('CnDnDetails') as FormArray;
  }

  ReceiveAmountControl(index: number) {
    return this.CnDnDetails.controls[index].get('ReceiveAmount') as FormControl;
  }

  ReceiveAmountMaxError(index: number) {
    return (
      this.ReceiveAmountControl(index)!.hasError('max') &&
      this.ReceiveAmountControl(index)!.touched
    );
  }

  onClickOk() {
    for (let index = 0; index < this.CnDnSettlementData.length; index++) {
      this.CnDnSettlementData[index].receiveAmount = CheckIsNumber(
        this.ReceiveAmountControl(index).value
      );
    }

    let Amount: number = CheckIsNumber(this.AmountControl().value);
    this.dialogRef.close({
      CloseStatus: true,
      SettlementAmount: Amount,
    });
  }

  onClickCancel() {
    this.dialogRef.close({
      CloseStatus: false,
      SettlementAmount: 0,
    });
  }

  CheckValidation() {
    let Amount: number = CheckIsNumber(this.AmountControl().value);
    if (this.cndnForm.valid) {
      if (Amount < 1) {
        return true;
      } else if (Amount > this.TotalNetAmount) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }
}
