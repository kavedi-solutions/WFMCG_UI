import { Component, OnInit } from '@angular/core';
import { FilterValues, PaginationHeaders, Role } from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/default.data';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
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

  columns: MtxGridColumn[] = [];

  constructor(
    private roleService: fromService.RoleService,
    private router: Router
  ) {
    this.setColumns();
    this.pagination!.page = 1;
    this.pagination!.pageSize = 20;
    this.pagination!.pageCount = 0;
    this.pagination!.recordCount = 0;
    this.getRoleList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = [
      {
        header: 'RoleID',
        field: 'RoleID',
        hide: true,
      },
      {
        header: 'Role Name',
        field: 'name',
        sortable: true,
        disabled: true,
        minWidth: 200,
        width: '200px',
      },
      {
        header: 'Description',
        field: 'description',
        sortable: true,
        disabled: true,
        minWidth: 700,
        width: '700px',
      },
      {
        header: 'Is Active',
        field: 'isActive',
        sortable: true,
        disabled: true,
        type: 'tag',
        tag: {
          true: { text: 'Active', color: 'green-100' },
          false: { text: 'In Active', color: 'red-100' },
        },
      },
      {
        header: 'Created Date',
        field: 'createdDate',
        sortable: true,
        disabled: true,
        type: 'date',
        typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      },
      {
        header: 'Updated Date',
        field: 'modifiedDate',
        sortable: true,
        disabled: true,
        type: 'date',
        typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      },
      {
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
            click: (record) => this.edit(record),
          },
          {
            color: 'warn',
            icon: 'delete',
            text: 'Delete',
            tooltip: 'Delete Record',
            pop: {
              title: 'Are you sure you want to delete this record.',
              closeText: 'No',
              okText: 'Yes',
            },
            click: (record) => this.delete(record),
          },
        ],
      },
    ];
  }

  getRoleList() {
    this.roleService
      .GetRoleList(this.pagination!, 'name', '')
      .subscribe((response) => {
        this.roleListData = response.body;
        this.pagination = response.headers;
        this.Sort = response.sort;
        this.SearchText = response.searchText;
        this.filterValues = response.filter;
      });
  }

  edit(value: any) {
    this.router.navigate(['/admin/role-edit/', value.roleID]);
  }

  delete(value: any) {}

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(e: any) {
    console.log(e);
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.getRoleList();
  }

  AddnewRecord() {
    this.router.navigate(['/admin/role-add']);
  }
}