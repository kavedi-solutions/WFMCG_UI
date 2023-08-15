import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { eI_CancelRequest } from 'src/app/shared';
import * as fromService from '../../../shared/index';

@Component({
  selector: 'app-cancele-invoice',
  templateUrl: './cancele-invoice.component.html',
  styleUrls: ['./cancele-invoice.component.scss'],
})
export class CanceleInvoiceComponent implements OnInit {
  DialogTitle: string = '';
  eiCancelRequest?: eI_CancelRequest;

  cancelForm = this.fb.group({
    eICancelReason: ['4', [Validators.required]],
    eICancelRemark: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CanceleInvoiceComponent>,
    private einvoiceService: fromService.EInvoiceService
  ) {}

  ngOnInit(): void {}

  onClickOk() {
    this.eiCancelRequest!.eICancelReason = this.eICancelReasonControl.value.toString();
    this.eiCancelRequest!.eICancelRemark = this.eICancelRemarkControl.value;

    this.einvoiceService
      .CancelEIInvoice(this.eiCancelRequest!)
      .subscribe((response: eI_CancelRequest) => {        
        debugger;
        this.dialogRef.close({
          CloseStatus: true,
          eiCancelRequest: response,
        });
      });
  }

  onClickClose() {
    this.dialogRef.close({
      CloseStatus: false,
      eiCancelRequest: this.eiCancelRequest,
    });
  }

  get eICancelReasonControl() {
    return this.cancelForm.get('eICancelReason') as FormControl;
  }

  get eICancelReasonControlRequired() {
    return (
      this.eICancelReasonControl.hasError('required') &&
      this.eICancelReasonControl.touched
    );
  }

  get eICancelRemarkControl() {
    return this.cancelForm.get('eICancelRemark') as FormControl;
  }

  get eICancelRemarkControlRequired() {
    return (
      this.eICancelReasonControl.hasError('required') &&
      this.eICancelReasonControl.touched
    );
  }
}
