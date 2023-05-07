import { PurchaseAssetsAddEditComponent } from './purchase-assets/purchase-assets-add-edit/purchase-assets-add-edit.component';
import { PurchaseAssetsComponent } from './purchase-assets/purchase-assets.component';
import { PurchaseServiceAddEditComponent } from './purchase-service/purchase-service-add-edit/purchase-service-add-edit.component';
import { PurchaseServiceComponent } from './purchase-service/purchase-service.component';
import { PurchaseAddEditComponent } from './purchase/purchase-add-edit/purchase-add-edit.component';
import { PurchaseComponent } from './purchase/purchase.component';

export const TransactionPages: any[] = [
  PurchaseComponent,
  PurchaseAddEditComponent,
  PurchaseServiceComponent,
  PurchaseServiceAddEditComponent,
  PurchaseAssetsComponent,
  PurchaseAssetsAddEditComponent,
];

export * from './purchase/purchase.component';
export * from './purchase/purchase-add-edit/purchase-add-edit.component';
export * from './purchase-assets/purchase-assets-add-edit/purchase-assets-add-edit.component';
export * from './purchase-assets/purchase-assets.component';
export * from './purchase-service/purchase-service-add-edit/purchase-service-add-edit.component';
export * from './purchase-service/purchase-service.component';
