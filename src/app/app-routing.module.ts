import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';
import * as Layouts from './Layouts/index';
import * as AuthPages from './auth-pages/index';
import * as CommonPages from './Pages/index';
import { NotificationComponent } from './shared';

const routes: Routes = [
  {
    path: '',
    component: Layouts.MainLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CommonPages.DashboardPageComponent },
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
