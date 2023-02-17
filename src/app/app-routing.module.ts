import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';
import * as Layouts from './layouts/index';
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
        component: CommonPages.UserRoleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'role-add',
        component: CommonPages.RoleAddEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'role-edit/:roleid',
        component: CommonPages.RoleAddEditComponent,
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
