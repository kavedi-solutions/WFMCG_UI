import { AccountLedgerComponent } from './financial/account-ledger/account-ledger.component';
import { OutstandingRegisterComponent } from './financial/outstanding-register/outstanding-register.component';
import { PurchaseRegisterComponent } from './financial/purchase-register/purchase-register.component';
import { SalesRegisterComponent } from './financial/sales-register/sales-register.component';
import { Gstr1SalesComponent } from './gstreports/gstr1-sales/gstr1-sales.component';
import { Gstr2PurchaseComponent } from './gstreports/gstr2-purchase/gstr2-purchase.component';
import { Gstr3bComponent } from './gstreports/gstr3b/gstr3b.component';
import { BulkPrintComponent } from './others/bulk-print/bulk-print.component';
import { IncentiveReportComponent } from './others/incentive-report/incentive-report.component';
import { LoadingSlipComponent } from './others/loading-slip/loading-slip.component';
import { SalesPurchaseReportComponent } from './others/sales-purchase-report/sales-purchase-report.component';
import { VoucherPrintComponent } from './others/voucher-print/voucher-print.component';
import { StockStatementComponent } from './stock/stock-statement/stock-statement.component';

export const ReportPages: any[] = [
  BulkPrintComponent,
  LoadingSlipComponent,
  StockStatementComponent,
  PurchaseRegisterComponent,
  SalesRegisterComponent,
  OutstandingRegisterComponent,
  AccountLedgerComponent,
  Gstr3bComponent,
  Gstr1SalesComponent,
  Gstr2PurchaseComponent,
  VoucherPrintComponent,
  SalesPurchaseReportComponent,
  IncentiveReportComponent
];

export * from './others/bulk-print/bulk-print.component';
export * from './others/loading-slip/loading-slip.component';
export * from './stock/stock-statement/stock-statement.component';
export * from './financial/purchase-register/purchase-register.component';
export * from './financial/sales-register/sales-register.component';
export * from './financial/outstanding-register/outstanding-register.component';
export * from './financial/account-ledger/account-ledger.component';
export * from './gstreports/gstr1-sales/gstr1-sales.component';
export * from './gstreports/gstr2-purchase/gstr2-purchase.component';
export * from './gstreports/gstr3b/gstr3b.component';
export * from './others/voucher-print/voucher-print.component';
export * from './others/sales-purchase-report/sales-purchase-report.component';
export * from './others/incentive-report/incentive-report.component';
