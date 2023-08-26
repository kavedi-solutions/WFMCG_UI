import { AccountLedgerComponent } from './financial/account-ledger/account-ledger.component';
import { OutstandingRegisterComponent } from './financial/outstanding-register/outstanding-register.component';
import { PurchaseRegisterComponent } from './financial/purchase-register/purchase-register.component';
import { SalesRegisterComponent } from './financial/sales-register/sales-register.component';
import { BulkPrintComponent } from './others/bulk-print/bulk-print.component';
import { LoadingSlipComponent } from './others/loading-slip/loading-slip.component';
import { StockStatementComponent } from './stock/stock-statement/stock-statement.component';

export const ReportPages: any[] = [
  BulkPrintComponent,
  LoadingSlipComponent,
  StockStatementComponent,
  PurchaseRegisterComponent,
  SalesRegisterComponent,
  OutstandingRegisterComponent,
  AccountLedgerComponent
];

export * from './others/bulk-print/bulk-print.component';
export * from './others/loading-slip/loading-slip.component';
export * from './stock/stock-statement/stock-statement.component';
export * from './financial/purchase-register/purchase-register.component';
export * from './financial/sales-register/sales-register.component';
export * from './financial/outstanding-register/outstanding-register.component';
export * from './financial/account-ledger/account-ledger.component';
