import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { DefaultPermissionResponse } from 'src/app/shared/models/admin/role/permissionResponse.model';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
  styleUrls: ['./role-add-edit.component.scss'],
})
export class RoleAddEditComponent implements OnInit {
  PageTitle: string = 'Create Role';
  buttonText: string = 'Add New Role';
  selectedRoleId: number;
  defaultPermission: DefaultPermissionResponse[];
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
    private fb: FormBuilder
  ) {
    this.defaultPermission = [];
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
      this.PageTitle = 'Update Role';
      //GetRolebyID
    } else {
      this.getDefaultPermission();
    }
  }

  BacktoList() {
    this.router.navigate(['/admin/role']);
  }

  getDefaultPermission() {
    this.roleService.GetDefaultPermission(false).subscribe((response) => {
      this.defaultPermission = response;
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
    if (this.defaultPermission) {
      this.defaultPermission.forEach((Permission: any, i) => {
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
    if (this.defaultPermission) {
      this.defaultPermission.forEach((Permission: any, i) => {
        if (index === i) {
          if (columnName !== 'canView' && Permission['canView'] === false) {
            Permission['canView'] = event.checked
              ? event.checked
              : Permission['canView'];
          }
          Permission[columnName] = event.checked;
          // }
          // Permission.canAdd = event.checked;
          // Permission.canView = event.checked;
          // Permission.canEdit = event.checked;
          // Permission.canDelete = event.checked;
        }
      });
    }
  }
}
