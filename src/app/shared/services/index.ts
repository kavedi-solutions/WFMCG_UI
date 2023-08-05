import { CompanyDetailService } from './admin/company-detail.service';
import { CompanySettingsService } from './admin/company-settings.service';
import { RoleService } from './admin/role.service';
import { UserService } from './admin/user.service';
import { AppOverlayService } from './common/app-overlay.service';
import { AuthService } from './common/auth.service';
import { AppDirectionality } from './common/directionality.service';
import { PreloaderService } from './common/preloader.service';
import { SettingsService } from './common/settings.service';
import { SpinnerService } from './common/spinner.service';
import {
  LocalStorageService,
  MemoryStorageService,
} from './common/storage.service';
import { EInvoiceService } from './einvoice/e-invoice.service';
import { AccountsService } from './master/accounts.service';
import { AreaService } from './master/area.service';
import { GroupService } from './master/group.service';
import { ItemgroupService } from './master/itemgroup.service';
import { ManufactureService } from './master/manufacture.service';
import { StockService } from './master/stock.service';
import { TaxService } from './master/tax.service';
import { FinancialService } from './reports/financial.service';
import { OthersReportService } from './reports/others.service';
import { ReportStocksService } from './reports/reportstocks.service';
import { PurchaseAService } from './transaction/purchase-a.service';
import { PurchaseService } from './transaction/purchase.service';
import { SalesAService } from './transaction/sales-a.service';
import { SalesSService } from './transaction/sales-s.service';
import { SalesService } from './transaction/sales.service';
import { VContraService } from './transaction/vcontra.service';
import { VJournalService } from './transaction/vjournal.service';
import { VPaymentService } from './transaction/vpayment.service';
import { VReceiptB2BService } from './transaction/vreceipt-b2b.service';
import { VReceiptService } from './transaction/vreceipt.service';

export const services: any[] = [
  AuthService,
  LocalStorageService,
  MemoryStorageService,
  PreloaderService,
  SettingsService,
  AppDirectionality,
  AppOverlayService,
  RoleService,
  SpinnerService,
  UserService,
  AreaService,
  GroupService,
  AccountsService,
  TaxService,
  ManufactureService,
  ItemgroupService,
  PurchaseService,
  PurchaseAService,
  PurchaseService,
  StockService,
  SalesService,
  SalesAService,
  SalesSService,
  VPaymentService,
  VReceiptService,
  VContraService,
  VJournalService,
  VReceiptB2BService,
  OthersReportService,
  CompanyDetailService,
  CompanySettingsService,
  ReportStocksService,
  FinancialService,
  EInvoiceService
];

export * from './admin/role.service';
export * from './admin/user.service';
export * from './admin/company-settings.service';
export * from './admin/company-detail.service';

export * from './common/auth.service';
export * from './common/storage.service';
export * from './common/preloader.service';
export * from './common/settings.service';
export * from './common/directionality.service';
export * from './common/spinner.service';
export * from './common/common.service';
export * from './common/app-overlay.service';

export * from './master/area.service';
export * from './master/group.service';
export * from './master/accounts.service';
export * from './master/tax.service';
export * from './master/manufacture.service';
export * from './master/itemgroup.service';
export * from './master/item.service';
export * from './master/stock.service';

export * from './transaction/purchase.service';
export * from './transaction/purchase-a.service';
export * from './transaction/purchase-s.service';
export * from './transaction/sales.service';
export * from './transaction/sales-a.service';
export * from './transaction/sales-s.service';

export * from './transaction/credit-note.service';
export * from './transaction/debit-note.service';
export * from './transaction/purchase-return.service';
export * from './transaction/sales-return.service';

export * from './transaction/vcontra.service';
export * from './transaction/vpayment.service';
export * from './transaction/vreceipt.service';
export * from './transaction/vjournal.service';
export * from './transaction/vreceipt-b2b.service';

export * from './reports/others.service';
export * from './reports/reportstocks.service';
export * from './reports/financial.service';

export * from './einvoice/e-invoice.service';