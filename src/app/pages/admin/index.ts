import { UsersComponent } from './users/users.component';
import { UserAddEditComponent } from './users/user-add-edit/user-add-edit.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleAddEditComponent } from './user-role/role-add-edit/role-add-edit.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanySettingsComponent } from './company-settings/company-settings.component';

export const AdminPages: any[] = [
  UserRoleComponent,
  UserRoleAddEditComponent,
  UsersComponent,
  UserAddEditComponent,
  CompanyDetailsComponent,
  CompanySettingsComponent
];

export * from './user-role/user-role.component';
export * from './user-role/role-add-edit/role-add-edit.component';
export * from './users/users.component';
export * from './users/user-add-edit/user-add-edit.component';
export * from './company-details/company-details.component';
export * from './company-settings/company-settings.component';
