import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import * as fromService from '../../../../shared/index';
import {
  Role,
  RolePostRequest,
  DefaultPermissionResponse,
  RolePutRequest,
  PermissionPutRequest,
} from '../../../../shared/index';
@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
  styleUrls: ['./role-add-edit.component.scss'],
})
export class UserRoleAddEditComponent implements OnInit {
  PageTitle: string = 'Create Role';
  buttonText: string = 'Add New Role';
  isEditMode: boolean = false;
  selectedRoleId: number;
  defaultPermission: DefaultPermissionResponse[];
  rolePostRequest?: RolePostRequest;
  rolePutRequest?: RolePutRequest;
  editRole?: Role;
  isRoleNameValid: boolean = false;
  RoleName: string = '';
  RoleNameExists: Subject<any> = new Subject();
  displayedColumns: string[] = [
    'name',
    'all',
    'canView',
    'canAdd',
    'canEdit',
    'canDelete',
  ];
  roleForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    description: ['', [Validators.pattern('[a-zA-Z0-9- ]*')]],
    isActive: [true],
  });
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private roleService: fromService.RoleService,
    private fb: FormBuilder,
    private sessionService: fromService.LocalStorageService
  ) {
    this.defaultPermission = [];
    this.isEditMode = false;
    this.selectedRoleId = 0;
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Role';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedRoleId = params['roleid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedRoleId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Role';
      this.getRoleByID();
    } else {
      this.isEditMode = false;
      this.getDefaultPermission();
    }
    this.RoleNameExists.pipe(debounceTime(1000)).subscribe(() => {
      this.CheckRoleNameExists(this.RoleName);
    });
  }

  get nameControl() {
    return this.roleForm.get('name') as FormControl;
  }

  get nameControlRequired() {
    return this.nameControl.hasError('required') && this.nameControl.touched;
  }

  get nameControlInvalid() {
    return this.nameControl.hasError('pattern') && this.nameControl.touched;
  }

  getRoleNameValidation() {
    if (this.isRoleNameValid) {
      this.roleForm.controls.name.setErrors({ isRoleNameValid: true });
    } else {
      this.roleForm.controls.name.updateValueAndValidity();
    }
    return this.isRoleNameValid;
  }

  onRoleNameKeyUp($event: any) {
    this.RoleName = $event.target.value.trim();
    this.RoleNameExists.next(this.RoleName);
  }

  CheckRoleNameExists(RoleName: string) {
    if (RoleName != '') {
      this.roleService
        .CheckRoleNameExists(this.selectedRoleId, RoleName)
        .subscribe((response) => {
          this.isRoleNameValid = response;
        });
    }
  }

  BacktoList() {
    this.router.navigate(['/admin/role/list']);
  }

  getDefaultPermission() {
    this.roleService.GetDefaultPermission(false).subscribe((response) => {
      this.defaultPermission = response;
    });
  }

  getRoleByID() {
    this.roleService.GetRolebyID(this.selectedRoleId).subscribe((response) => {
      this.editRole = response;
      this.roleForm.patchValue({
        name: this.editRole!.name,
        description: this.editRole!.description,
        isActive: this.editRole!.isActive,
      });
    });
  }

  getColumName(column: string) {
    if (column === 'canDelete') {
      return (column = 'Deactivate');
    }
    if (column === 'name') {
      return (column = 'Name');
    }
    if (column === 'all') {
      return (column = 'All');
    }
    return column.replace('can', '');
  }

  onCheckAll(event: any, index: number) {
    if (this.defaultPermission && this.defaultPermission.length > 0) {
      this.defaultPermission.forEach((Permission: any, i) => {
        if (index === i) {
          Permission.canAdd = event.checked;
          Permission.canView = event.checked;
          Permission.canEdit = event.checked;
          Permission.canDelete = event.checked;
        }
      });
    } else if (this.editRole!.permission) {
      this.editRole!.permission.forEach((Permission: any, i) => {
        if (index === i) {
          Permission.canAdd = event.checked;
          Permission.canView = event.checked;
          Permission.canEdit = event.checked;
          Permission.canDelete = event.checked;
        }
      });
    }
  }

  onOtherSelection(event: any, columnName: any, index: number) {
    if (this.defaultPermission && this.defaultPermission.length > 0) {
      this.defaultPermission.forEach((Permission: any, i) => {
        if (index === i) {
          if (columnName !== 'canView' && Permission['canView'] === false) {
            Permission['canView'] = event.checked
              ? event.checked
              : Permission['canView'];
          }
          Permission[columnName] = event.checked;
        }
      });
    } else if (this.editRole!.permission) {
      this.editRole!.permission.forEach((Permission: any, i) => {
        if (index === i) {
          if (columnName !== 'canView' && Permission['canView'] === false) {
            Permission['canView'] = event.checked
              ? event.checked
              : Permission['canView'];
          }
          Permission[columnName] = event.checked;
        }
      });
    }
  }

  SaveUpdateRole(roleForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateRole(roleForm);
    } else {
      this.SaveRole(roleForm);
    }
  }

  SaveRole(roleForm: FormGroup) {
    this.rolePostRequest = {
      name: roleForm.value.name.toString(),
      description: roleForm.value.description,
      isActive: roleForm.value.isActive,
      isAdminRole: false,
      permission: this.defaultPermission,
    };

    this.roleService.createRole(this.rolePostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateRole(roleForm: FormGroup) {
    let UpdatePermission: PermissionPutRequest[] = [];

    if (this.editRole!.permission && this.editRole!.permission.length > 0) {
      this.editRole!.permission.forEach((element) => {
        let permission: PermissionPutRequest = {
          PermissionsId: element.permissionsId,
          RoleID: element.roleID,
          menuID: element.menuID,
          canView: element.canView,
          canAdd: element.canAdd,
          canEdit: element.canEdit,
          canDelete: element.canDelete,
        };
        UpdatePermission.push(permission);
      });
    }

    this.rolePutRequest = {
      name: roleForm.value.name.toString(),
      description: roleForm.value.description,
      isActive: roleForm.value.isActive,
      isAdminRole: false,
      permission: UpdatePermission,
    };

    this.roleService
      .updateRole(this.selectedRoleId, this.rolePutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
