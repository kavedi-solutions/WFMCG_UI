import { GenerateEInvoiceComponent } from "./generate-einvoice/generate-einvoice.component";
import { GetEInvoiceErrorsComponent } from "./get-einvoice-errors/get-einvoice-errors.component";
import { GetEInvoiceComponent } from "./get-einvoice/get-einvoice.component";

export const EInvoicePages: any[] = [
  GenerateEInvoiceComponent,
  GetEInvoiceComponent,
  GetEInvoiceErrorsComponent
];

export * from "./generate-einvoice/generate-einvoice.component";
export * from "./get-einvoice-errors/get-einvoice-errors.component";
export * from "./get-einvoice/get-einvoice.component";
