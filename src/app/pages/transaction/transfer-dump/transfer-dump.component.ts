import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  TransferDump,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { PageEvent } from '@angular/material/paginator';
import { funSortingOrder } from 'src/app/shared/functions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transfer-dump',
  templateUrl: './transfer-dump.component.html',
  styleUrls: ['./transfer-dump.component.scss'],
})
export class TransferDumpComponent implements OnInit {
  PageTitle: string = 'Transfer to Dump';
  buttonText: string = 'Add New';
  accRights?: AccessRights;
  transferListData: TransferDump[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  latestSearchText?: string;
  pageSizeOptions = defaultData.pageSizeOptions;

  constructor(
    private transferDumpService: fromService.TransferDumpService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = '-transferDate';
    this.getTransferList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetTransferDumpColumns();
    this.columns.push({
      header: 'Action',
      field: 'action',
      minWidth: 60,
      width: '60px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'more_vert',
          tooltip: 'Options',
          buttontype: 'button',
          children: [
            {
              text: 'Edit Record',
              tooltip: 'Edit Record',
              buttontype: 'button',
              pop: {
                title: 'Confirm Edit',
                description: 'Are you sure you want to Edit this Transfer.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.edit(record),
              iif: (record) => {
                return this.accRights!.canEdit;
              },
            },
            {
              text: 'Delete Record',
              tooltip: 'Delete Record',
              buttontype: 'button',
              pop: {
                title: 'Confirm Delete',
                description: 'Are you sure you want to Delete this Transfer.',
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
            // {
            //   text: 'Print',
            //   tooltip: 'Print',
            //   buttontype: 'button',
            //   pop: {
            //     title: 'Confirm Print',
            //     description: 'Are you sure you want to Print this Transfer.',
            //     closeText: 'No',
            //     okText: 'Yes',
            //     okColor: 'primary',
            //     closeColor: 'warn',
            //   },
            //   click: (record) => this.printTransfer(record),
            //   iif: () => {
            //     return this.accRights!.canView;
            //   },
            // },
          ],
        },
      ],
    });
  }

  getTransferList() {
    this.transferDumpService
      .GetTransferDumpList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.transferListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/transaction/transferdump/edit/', value.autoID]);
  }

  delete(value: any) {
    this.transferDumpService
      .deleteTransferDump(value.autoID)
      .subscribe((response) => {
        this.getTransferList();
      });
  }

  AddnewRecord() {
    this.router.navigate(['/transaction/transferdump/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getTransferList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getTransferList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getTransferList();
  }

  onRefresh() {
    this.getTransferList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getTransferList();
  }
}
