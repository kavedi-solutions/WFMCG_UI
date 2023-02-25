import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  Role,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  PageTitle: string = 'Roles';
  buttonText: string = 'Add New Role';
  roleListData: Role[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;

  constructor(
    private roleService: fromService.RoleService,
    private authService: fromService.AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'name';
    this.pagination!.page = 1;
    this.pagination!.pageSize = 20;
    this.pagination!.pageCount = 0;
    this.pagination!.recordCount = 0;
    this.getRoleList();
  }

  ngOnInit(): void {}

  setColumns() {
    debugger;
    this.columns = defaultData.GetRoleColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 100,
      width: '120px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          iif: (record) => {
            if (record.isAdminRole) return false;
            else return this.accRights!.canEdit;
          },
          click: (record) => this.edit(record),
        },
        {
          class: 'red',
          icon: 'swap_horiz',
          text: 'Deactive',
          tooltip: 'Deactive Record',
          pop: {
            title: 'Confirm Deactive',
            description: 'Are you sure you want to Deactive this record.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.DeactiveRole(record),
          iif: (record) => {
            if (record.isAdminRole) return false;
            else if (this.accRights!.canDelete) return record.isActive;
            else return false;
          },
        },
        {
          class: 'green',
          icon: 'swap_horiz',
          text: 'Active',
          tooltip: 'Active Record',
          pop: {
            title: 'Confirm Active',
            description: 'Are you sure you want to Active this record?',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.ActiveRole(record),
          iif: (record) => {
            if (record.isAdminRole) return false;
            else if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  getRoleList() {
    this.roleService
      .GetRoleList(this.pagination!, this.latestSortingOrder!, '')
      .subscribe((response) => {
        this.roleListData = response.body;
        this.pagination = response.headers;
        this.Sort = response.sort;
        this.SearchText = response.searchText;
        this.filterValues = response.filter;
      });
  }

  edit(value: any) {
    this.router.navigate(['/admin/role/edit/', value.roleID]);
  }

  DeactiveRole(value: any) {
    this.roleService.DeactivateRole(value.roleID).subscribe((response) => {
      this.getRoleList();
    });
  }

  ActiveRole(value: any) {
    this.roleService.ActivateRole(value.roleID).subscribe((response) => {
      this.getRoleList();
    });
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 1;
    this.pagination!.pageSize = 20;
    this.pagination!.pageCount = 0;
    this.pagination!.recordCount = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getRoleList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex + 1;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getRoleList();
  }

  AddnewRecord() {
    this.router.navigate(['/admin/role/add']);
  }
}
