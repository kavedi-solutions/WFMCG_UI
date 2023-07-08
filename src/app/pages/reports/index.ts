import { OutstandingRegisterComponent } from './financial/outstanding-register/outstanding-register.component';
import { BulkPrintComponent } from './others/bulk-print/bulk-print.component';
import { LoadingSlipComponent } from './others/loading-slip/loading-slip.component';
import { StockStatementComponent } from './stock/stock-statement/stock-statement.component';

export const ReportPages: any[] = [
  BulkPrintComponent,
  LoadingSlipComponent,
  StockStatementComponent,
  OutstandingRegisterComponent,
];

export * from './others/bulk-print/bulk-print.component';
export * from './others/loading-slip/loading-slip.component';
export * from './stock/stock-statement/stock-statement.component';
export * from './financial/outstanding-register/outstanding-register.component';