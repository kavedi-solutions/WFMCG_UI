import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  User,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  PageTitle: string = 'User';
  buttonText: string = 'Add New User';
  userListData: User[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;

  constructor(
    private userService: fromService.UserService,
    private authService: fromService.AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'firstName';
    this.pagination!.page = 1;
    this.pagination!.pageSize = 20;
    this.pagination!.pageCount = 0;
    this.pagination!.recordCount = 0;
    this.getUserList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetUserColumns();
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
          click: (record) => this.DeactiveUser(record),
          iif: (record) => {
            if (record.isCompanyOwner) return false;
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
          click: (record) => this.ActiveUser(record),
          iif: (record) => {
            if (record.isCompanyOwner) return false;
            else if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  DeactiveUser(value: any) {
    this.userService.DeactivateUser(value.userID).subscribe((response) => {
      this.getUserList();
    });
  }

  ActiveUser(value: any) {
    this.userService.ActivateUser(value.userID).subscribe((response) => {
      this.getUserList();
    });
  }

  getUserList() {
    this.userService
      .GetUserList(this.pagination!, this.latestSortingOrder!, '')
      .subscribe((response) => {
        this.userListData = response.body;
        this.pagination = response.headers;
        this.Sort = response.sort;
        this.SearchText = response.searchText;
        this.filterValues = response.filter;
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
    this.getUserList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex + 1;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getUserList();
  }

  AddnewRecord() {
    this.router.navigate(['/admin/user/add']);
  }

  edit(value: any) {
    this.router.navigate(['/admin/user/edit/', value.userID]);
  }
}
