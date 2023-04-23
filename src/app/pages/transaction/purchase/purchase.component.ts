import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  Purchase,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
  PageTitle: string = 'Purchase';
  buttonText: string = 'Add New Purchase';
  purchaseListData: Purchase[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  latestSearchText?: string;

  constructor(
    private purchaseService: fromService.PurchaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'billDate';
    this.getPurchaseList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetPurchaseColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 70,
      width: '70px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Record',
          iif: () => {
            return this.accRights!.canEdit;
          },
          click: (record) => this.edit(record),
        },
      ],
    });
  }

  getPurchaseList() {
    this.purchaseService
    .GetPurchaseList(
      this.pagination!,
      this.latestSortingOrder!,
      this.latestSearchText!,
      this.filterValues!
    )
    .subscribe((response) => {
      this.purchaseListData = response.body;
      this.pagination = response.headers;
    });
  }

  edit(value: any) {
    this.router.navigate(['/transaction/purchase/edit/', value.autoID]);    
  }

  AddnewRecord() {
    this.router.navigate(['/transaction/purchase/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getPurchaseList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getPurchaseList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getPurchaseList();
  }

  onRefresh() {
    this.getPurchaseList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getPurchaseList();
  }
  
}