import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  Role,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

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
  latestSearchText?: string;
  pageSizeOptions = defaultData.pageSizeOptions;

  constructor(
    private roleService: fromService.RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'name';
    this.getRoleList();
  }

  ngOnInit(): void {}

  setColumns() {
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
          buttontype: 'button',
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
          buttontype: 'button',
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
          buttontype: 'button',
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
      .GetRoleList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.roleListData = response.body;
        this.pagination = response.headers;
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
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getRoleList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getRoleList();
  }

  AddnewRecord() {
    this.router.navigate(['/admin/role/add']);
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getRoleList();
  }

  onRefresh() {
    this.getRoleList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getRoleList();
  }
}
