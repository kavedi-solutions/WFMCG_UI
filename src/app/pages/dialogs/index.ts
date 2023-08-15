import { CanceleInvoiceComponent } from './cancele-invoice/cancele-invoice.component';
import { CnDnSettlementComponent } from './cn-dn-settlement/cn-dn-settlement.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { GstDetailsComponent } from './gst-details/gst-details.component';

export const DialogPages: any[] = [
  CnDnSettlementComponent,
  GstDetailsComponent,
  CanceleInvoiceComponent,
  CommonDialogComponent
];

export * from './cancele-invoice/cancele-invoice.component';
export * from './cn-dn-settlement/cn-dn-settlement.component';
export * from './gst-details/gst-details.component';
export * from './common-dialog/common-dialog.component';
