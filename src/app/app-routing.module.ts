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
