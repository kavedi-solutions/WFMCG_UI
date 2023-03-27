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
            data: { MenuID: '701' },
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
            data: { MenuID: '702' },
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
            path: 'edit/:purhcaseid',
            component: CommonPages.PurchaseAddEditComponent,
            canActivate: [AuthGuard],
          },
        ],
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
