import { CanceleInvoiceComponent } from './cancele-invoice/cancele-invoice.component';
import { CnDnSettlementComponent } from './cn-dn-settlement/cn-dn-settlement.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { GstDetailsComponent } from './gst-details/gst-details.component';
import { ItemSoftwareDetailsComponent } from './item-software-details/item-software-details.component';
import { ItemTaxMappingComponent } from './item-tax-mapping/item-tax-mapping.component';
import { SoftwareDetailsComponent } from './software-details/software-details.component';
import { SPReportSelectionsComponent } from './spreport-selections/spreport-selections.component';

export const DialogPages: any[] = [
  CnDnSettlementComponent,
  GstDetailsComponent,
  CanceleInvoiceComponent,
  CommonDialogComponent,
  SPReportSelectionsComponent,
  ItemTaxMappingComponent,
  SoftwareDetailsComponent,
  ItemSoftwareDetailsComponent
];

export * from './cancele-invoice/cancele-invoice.component';
export * from './cn-dn-settlement/cn-dn-settlement.component';
export * from './gst-details/gst-details.component';
export * from './common-dialog/common-dialog.component';
export * from './spreport-selections/spreport-selections.component';
export * from './item-tax-mapping/item-tax-mapping.component';
export * from './software-details/software-details.component';
export * from './item-software-details/item-software-details.component';
