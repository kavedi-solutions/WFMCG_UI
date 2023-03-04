import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  Group,
  FilterValues,
  PaginationHeaders,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  PageTitle: string = 'Group';
  buttonText: string = 'Add New Group';
  groupListData: Group[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;

  constructor(
    private groupService: fromService.GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'GroupName';
    this.getGroupList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetGroupColumns();
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
            return this.accRights!.canEdit;
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
          click: (record) => this.DeactiveGroup(record),
          iif: (record) => {
            if (this.accRights!.canDelete) return record.isActive;
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
          click: (record) => this.ActiveGroup(record),
          iif: (record) => {
            if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  getGroupList() {
    this.groupService
      .GetGroupList(this.pagination!, this.latestSortingOrder!, '')
      .subscribe((response) => {
        debugger;
        this.groupListData = response.body;
        this.pagination = response.headers;
        this.Sort = response.sort;
        this.SearchText = response.searchText;
        this.filterValues = response.filter;
      });
  }

  edit(value: any) {
    this.router.navigate(['/master/group/edit/', value.groupID]);
    //this.router.navigate([route, { outlets: { dialog: ['reset-password'] } }]);
  }

  DeactiveGroup(value: any) {
    this.groupService.DeactivateGroup(value.groupID).subscribe((response) => {
      this.getGroupList();
    });
  }

  ActiveGroup(value: any) {
    this.groupService.ActivateGroup(value.groupID).subscribe((response) => {
      this.getGroupList();
    });
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getGroupList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getGroupList();
  }

  AddnewRecord() {
    this.router.navigate(['/master/group/add']);
    //this.router.navigate(['/master/area', { outlets: { dialog: ['add'] } }]);
  }
}
