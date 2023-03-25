import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  ItemGroup,
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
  selector: 'app-itemgroup',
  templateUrl: './itemgroup.component.html',
  styleUrls: ['./itemgroup.component.scss'],
})
export class ItemgroupComponent implements OnInit {
  PageTitle: string = 'Item Group';
  buttonText: string = 'Add New Item Group';
  itemGroupListData: ItemGroup[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  latestSearchText?: string;

  constructor(
    private itemGroupService: fromService.ItemgroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'itemGroupName';
    this.getItemGroupList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetItemGroupColumns();
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
          click: (record) => this.DeactiveItemGroup(record),
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
          click: (record) => this.ActiveItemGroup(record),
          iif: (record) => {
            if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  getItemGroupList() {
    this.itemGroupService
      .GetItemGroupList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.itemGroupListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/master/itemgroup/edit/', value.itemGroupID]);
  }

  DeactiveItemGroup(value: any) {
    this.itemGroupService
      .DeactivateItemGroup(value.itemGroupID)
      .subscribe((response) => {
        this.getItemGroupList();
      });
  }

  ActiveItemGroup(value: any) {
    this.itemGroupService
      .ActivateItemGroup(value.itemGroupID)
      .subscribe((response) => {
        this.getItemGroupList();
      });
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getItemGroupList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getItemGroupList();
  }

  AddnewRecord() {
    this.router.navigate(['/master/itemgroup/add']);
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getItemGroupList();
  }

  onRefresh() {
    this.getItemGroupList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getItemGroupList();
  }
}
