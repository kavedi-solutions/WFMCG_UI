import { AdminPages } from './admin';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { MasterPages } from './masters';

export const Pages: any[] = [DashboardPageComponent, AdminPages, MasterPages];

export * from './dashboard-page/dashboard-page.component';
export * from './admin';
export * from './masters';
