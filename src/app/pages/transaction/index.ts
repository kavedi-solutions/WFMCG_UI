import { PurchaseAssetsAddEditComponent } from './purchase-assets/purchase-assets-add-edit/purchase-assets-add-edit.component';
import { PurchaseAssetsComponent } from './purchase-assets/purchase-assets.component';
import { PurchaseServiceAddEditComponent } from './purchase-service/purchase-service-add-edit/purchase-service-add-edit.component';
import { PurchaseServiceComponent } from './purchase-service/purchase-service.component';
import { PurchaseAddEditComponent } from './purchase/purchase-add-edit/purchase-add-edit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SalesAssetsAddEditComponent } from './sales-assets/sales-assets-add-edit/sales-assets-add-edit.component';
import { SalesAssetsComponent } from './sales-assets/sales-assets.component';
import { SalesServiceAddEditComponent } from './sales-service/sales-service-add-edit/sales-service-add-edit.component';
import { SalesServiceComponent } from './sales-service/sales-service.component';
import { SalesAddEditComponent } from './sales/sales-add-edit/sales-add-edit.component';
import { SalesComponent } from './sales/sales.component';

export const TransactionPages: any[] = [
  PurchaseComponent,
  PurchaseAddEditComponent,
  PurchaseServiceComponent,
  PurchaseServiceAddEditComponent,
  PurchaseAssetsComponent,
  PurchaseAssetsAddEditComponent,
  SalesComponent,
  SalesAddEditComponent,
  SalesAssetsComponent,
  SalesAssetsAddEditComponent,
  SalesServiceComponent,
  SalesServiceAddEditComponent
];

export * from './purchase/purchase.component';
export * from './purchase/purchase-add-edit/purchase-add-edit.component';
export * from './purchase-assets/purchase-assets-add-edit/purchase-assets-add-edit.component';
export * from './purchase-assets/purchase-assets.component';
export * from './purchase-service/purchase-service-add-edit/purchase-service-add-edit.component';
export * from './purchase-service/purchase-service.component';
export * from './sales-assets/sales-assets-add-edit/sales-assets-add-edit.component';
export * from './sales-assets/sales-assets.component';
export * from './sales-service/sales-service-add-edit/sales-service-add-edit.component';
export * from './sales-service/sales-service.component';
export * from './sales/sales-add-edit/sales-add-edit.component';
export * from './sales/sales.component';
