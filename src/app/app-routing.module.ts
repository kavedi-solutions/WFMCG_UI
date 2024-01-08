import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';
import * as Layouts from './layouts/index';
import * as fromResolvers from './shared/resolver/index';
import * as AuthPages from './auth-pages/index';
import * as CommonPages from './pages/index';
import { NotificationComponent } from './shared';

const routes: Routes = [
  {
    path: '',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CommonPages.DashboardPageComponent },
    ],
  },
  {
    path: 'admin',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'role',
        children: [
          {
            path: 'list',
            component: CommonPages.UserRoleComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '801' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.UserRoleAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:roleid',
            component: CommonPages.UserRoleAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: 'list',
            component: CommonPages.UsersComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '802' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.UserAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:userid',
            component: CommonPages.UserAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'companydetails',
        component: CommonPages.CompanyDetailsComponent,
        resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
        data: { MenuID: '803' },
        canActivate: [AuthGuard],
      },
      {
        path: 'companysettings',
        component: CommonPages.CompanySettingsComponent,
        resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
        data: { MenuID: '804' },
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'master',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'group',
        children: [
          {
            path: 'list',
            component: CommonPages.GroupComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '101' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.GroupAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:groupid',
            component: CommonPages.GroupAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'area',
        children: [
          {
            path: 'list',
            component: CommonPages.AreaComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '102' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.AreaAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:areaid',
            component: CommonPages.AreaAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'accounts',
        children: [
          {
            path: 'list',
            component: CommonPages.AccountsComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '103' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.AccountsAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:accountid',
            component: CommonPages.AccountsAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'openingbalance',
            component: CommonPages.OpeningBalanceComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '104' },
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'tax',
        children: [
          {
            path: 'list',
            component: CommonPages.TaxComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '105' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.TaxAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:taxid',
            component: CommonPages.TaxAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'manufacture',
        children: [
          {
            path: 'list',
            component: CommonPages.ManufactureComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '106' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.ManufactureAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:manufactureid',
            component: CommonPages.ManufactureAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'itemgroup',
        children: [
          {
            path: 'list',
            component: CommonPages.ItemgroupComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '107' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.ItemgroupAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:itemgroupid',
            component: CommonPages.ItemgroupAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'item',
        children: [
          {
            path: 'list',
            component: CommonPages.ItemComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '108' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.ItemAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:itemid',
            component: CommonPages.ItemAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'opening',
            component: CommonPages.ItemOpeningComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '109' },
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'transaction',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'purchase',
        children: [
          {
            path: 'list',
            component: CommonPages.PurchaseComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '201' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.PurchaseAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:purchaseid',
            component: CommonPages.PurchaseAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'purchase-service',
        children: [
          {
            path: 'list',
            component: CommonPages.PurchaseServiceComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '202' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.PurchaseServiceAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:purchaseid',
            component: CommonPages.PurchaseServiceAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'purchase-assets',
        children: [
          {
            path: 'list',
            component: CommonPages.PurchaseAssetsComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '203' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.PurchaseAssetsAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:purchaseid',
            component: CommonPages.PurchaseAssetsAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'sales',
        children: [
          {
            path: 'list',
            component: CommonPages.SalesComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '211' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.SalesAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:salesid',
            component: CommonPages.SalesAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'sales-service',
        children: [
          {
            path: 'list',
            component: CommonPages.SalesServiceComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '212' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.SalesServiceAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:salesid',
            component: CommonPages.SalesServiceAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'sales-assets',
        children: [
          {
            path: 'list',
            component: CommonPages.SalesAssetsComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '213' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.SalesAssetsAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:salesid',
            component: CommonPages.SalesAssetsAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'purchase-return',
        children: [
          {
            path: 'list',
            component: CommonPages.PurchaseReturnComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '221' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.PurchaseReturnAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:purchaseReturnid',
            component: CommonPages.PurchaseReturnAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'sales-return',
        children: [
          {
            path: 'list',
            component: CommonPages.SalesReturnComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '222' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.SalesReturnAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:salesReturnid',
            component: CommonPages.SalesReturnAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'debit-note',
        children: [
          {
            path: 'list',
            component: CommonPages.DebitNoteComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '223' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.DebitNoteAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:debitnoteid',
            component: CommonPages.DebitNoteAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'credit-note',
        children: [
          {
            path: 'list',
            component: CommonPages.CreditNoteComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '223' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.CreditNoteAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:creditnoteid',
            component: CommonPages.CreditNoteAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'v-contra',
        children: [
          {
            path: 'list',
            component: CommonPages.VContraComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '231' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.VContraAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:voucherid',
            component: CommonPages.VContraAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'v-payment',
        children: [
          {
            path: 'list',
            component: CommonPages.VPaymentComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '232' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.VPaymentAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:voucherid',
            component: CommonPages.VPaymentAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'v-receipt',
        children: [
          {
            path: 'list',
            component: CommonPages.VReceiptComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '233' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.VReceiptAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:voucherid',
            component: CommonPages.VReceiptAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'v-receipt-b2b',
        children: [
          {
            path: 'list',
            component: CommonPages.VReceiptB2BComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '234' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.VReceiptB2BAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:voucherid',
            component: CommonPages.VReceiptB2BAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'v-journal',
        children: [
          {
            path: 'list',
            component: CommonPages.VJournalComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '235' },
            canActivate: [AuthGuard],
          },
          {
            path: 'add',
            component: CommonPages.VJournalAddEditComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'edit/:voucherid',
            component: CommonPages.VJournalAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'einvoice',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'generate',
        component: CommonPages.GenerateEInvoiceComponent,
        resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
        data: { MenuID: '301' },
        canActivate: [AuthGuard],
      },
      {
        path: 'getdetails',
        component: CommonPages.GetEInvoiceComponent,
        resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
        data: { MenuID: '302' },
        canActivate: [AuthGuard],
      },
      {
        path: 'geterror',
        component: CommonPages.GetEInvoiceErrorsComponent,
        resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
        data: { MenuID: '303' },
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'reports',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'stock',
        children: [
          {
            path: 'stockstatement',
            component: CommonPages.StockStatementComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '601' },
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'financial',
        children: [
          {
            path: 'accountledger',
            component: CommonPages.AccountLedgerComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '404' },
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'register',
        children: [
          {
            path: 'purchase',
            component: CommonPages.PurchaseRegisterComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '401' },
            canActivate: [AuthGuard],
          },
          {
            path: 'sales',
            component: CommonPages.SalesRegisterComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '402' },
            canActivate: [AuthGuard],
          },
          {
            path: 'outstanding',
            component: CommonPages.OutstandingRegisterComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '403' },
            canActivate: [AuthGuard],
          },
          {
            path: 'acledger',
            component: CommonPages.AccountLedgerComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '404' },
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'gstreports',
        children: [
          {
            path: 'gstr3b',
            component: CommonPages.Gstr3bComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '501' },
            canActivate: [AuthGuard],
          },
          {
            path: 'gstr1',
            component: CommonPages.Gstr1SalesComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '502' },
            canActivate: [AuthGuard],
          },
          {
            path: 'gstr2',
            component: CommonPages.Gstr2PurchaseComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '503' },
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'others',
        children: [
          {
            path: 'bulkprint',
            component: CommonPages.BulkPrintComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '701' },
            canActivate: [AuthGuard],
          },
          {
            path: 'loadingslip',
            component: CommonPages.LoadingSlipComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '702' },
            canActivate: [AuthGuard],
          },
          {
            path: 'voucherprint',
            component: CommonPages.VoucherPrintComponent,
            resolve: { userRights: fromResolvers.GetUserAccessRightsResolver },
            data: { MenuID: '703' },
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'utilities',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'backupdatabse',
        component: CommonPages.BackupDatabaseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'diskcleanup',
        component: CommonPages.DiskCleanupComponent,
        canActivate: [AuthGuard],
      }
    ],
  },
  {
    path: 'quickmenu',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'accounts/add',
        component: CommonPages.AccountsAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'item/add',
        component: CommonPages.ItemAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'purchase/add',
        component: CommonPages.PurchaseAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'sales/add',
        component: CommonPages.SalesAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'v-receipt/add',
        component: CommonPages.VReceiptAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'v-receipt-b2b/add',
        component: CommonPages.VReceiptB2BAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bulkprint',
        component: CommonPages.BulkPrintComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loadingslip',
        component: CommonPages.LoadingSlipComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'outstanding',
        component: CommonPages.OutstandingRegisterComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'auth',
    component: Layouts.AuthLayoutComponent,
    children: [{ path: 'login', component: AuthPages.LoginPageComponent }],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [NotificationComponent],
})
export class AppRoutingModule {}
