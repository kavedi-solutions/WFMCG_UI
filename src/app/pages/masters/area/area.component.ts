import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  Area,
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
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {
  PageTitle: string = 'Area';
  buttonText: string = 'Add New Area';
  areaListData: Area[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  constructor(
    private areaService: fromService.AreaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'name';
    this.pagination!.page = 1;
    this.pagination!.pageSize = 20;
    this.pagination!.pageCount = 0;
    this.pagination!.recordCount = 0;
    this.getAreaList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetAreaColumns();
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
          click: (record) => this.DeactiveArea(record),
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
          click: (record) => this.ActiveArea(record),
          iif: (record) => {
            if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  getAreaList() {
    this.areaService
      .GetAreaList(this.pagination!, this.latestSortingOrder!, '')
      .subscribe((response) => {
        this.areaListData = response.body;
        this.pagination = response.headers;
        this.Sort = response.sort;
        this.SearchText = response.searchText;
        this.filterValues = response.filter;
      });
  }

  edit(value: any) {
    this.router.navigate(['/master/area/edit/', value.areaID]);
    //this.router.navigate([route, { outlets: { dialog: ['reset-password'] } }]);
  }

  DeactiveArea(value: any) {
    this.areaService.DeactivateArea(value.areaID).subscribe((response) => {
      this.getAreaList();
    });
  }

  ActiveArea(value: any) {
    this.areaService.ActivateArea(value.areaID).subscribe((response) => {
      this.getAreaList();
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
    this.getAreaList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex + 1;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getAreaList();
  }

  AddnewRecord() {
    this.router.navigate(['/master/area/add']);
    //this.router.navigate(['/master/area', { outlets: { dialog: ['add'] } }]);
  }

}
