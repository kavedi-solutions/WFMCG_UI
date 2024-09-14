import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  AccessRights,
  ItemGTMTMapping,
  PaginationHeaders,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { PageEvent } from '@angular/material/paginator';
import { funSortingOrder } from 'src/app/shared/functions';

@Component({
  selector: 'app-gtmtitem-mapping',
  templateUrl: './gtmtitem-mapping.component.html',
  styleUrls: ['./gtmtitem-mapping.component.scss'],
})
export class GTMTItemMappingComponent implements OnInit {
  PageTitle: string = 'GT to MT Item Mapping';
  buttonText: string = 'Add New Mapping';
  accRights?: AccessRights;
  itemListData: ItemGTMTMapping[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  Sort?: string;
  SearchText?: string;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  latestSearchText?: string;
  pageSizeOptions = defaultData.pageSizeOptions;

  constructor(
    private gtmtmapitemService: fromService.GTMTMapItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'gtItemName';
    this.getMappingItemList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetGTMTMappingItemColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 40,
      width: '40px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete Record',
          buttontype: 'button',
          pop: {
            title: 'Confirm Delete',
            description: 'Are you sure you want to Delete this GT MT Mapping.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.delete(record),
          iif: (record) => {
            return this.accRights!.canDelete;
          },
        },
      ],
    });
  }

  getMappingItemList() {
    this.gtmtmapitemService
      .GetItemList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!
      )
      .subscribe((response) => {
        this.itemListData = response.body;
        this.pagination = response.headers;
      });
  }

  delete(value: any) {
    this.gtmtmapitemService
      .DeleteMappingItembyID(value.autoID)
      .subscribe((response) => {
        this.getMappingItemList();
      });
  }

  AddnewRecord() {
    this.router.navigate(['/master/gtmtmapping/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getMappingItemList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getMappingItemList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getMappingItemList();
  }

  onRefresh() {
    this.getMappingItemList();
  }
}
