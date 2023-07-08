import { AdminPages } from './admin';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DialogPages } from './dialogs';
import { MasterPages } from './masters';
import { ReportPages } from './reports';
import { TransactionPages } from './transaction';

export const Pages: any[] = [
  DashboardPageComponent,
  AdminPages,
  MasterPages,
  TransactionPages,
  ReportPages,
  DialogPages
];

export * from './dashboard-page/dashboard-page.component';
export * from './admin';
export * from './masters';
export * from './transaction';
export * from './reports';
export * from './dialogs';
