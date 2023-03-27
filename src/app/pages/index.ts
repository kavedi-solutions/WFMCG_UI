import { AdminPages } from './admin';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { MasterPages } from './masters';
import { TransactionPages } from './transaction';

export const Pages: any[] = [
  DashboardPageComponent,
  AdminPages,
  MasterPages,
  TransactionPages,
];

export * from './dashboard-page/dashboard-page.component';
export * from './admin';
export * from './masters';
export * from './transaction';
