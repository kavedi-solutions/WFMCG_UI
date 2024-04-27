import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  TransferGTMT,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { PageEvent } from '@angular/material/paginator';
import { funSortingOrder } from 'src/app/shared/functions';

@Component({
  selector: 'app-transfer-gtmt',
  templateUrl: './transfer-gtmt.component.html',
  styleUrls: ['./transfer-gtmt.component.scss'],
})
export class TransferGTMTComponent implements OnInit {
  PageTitle: string = 'Transfer From GT to MT';
  buttonText: string = 'Add New';
  accRights?: AccessRights;
  transferListData: TransferGTMT[] = [];
  pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  filterValues?: FilterValues[];
  Sort?: string;
  SearchText?: string;
  columns: MtxGridColumn[] = [];
  latestSortingOrder?: string;
  latestSearchText?: string;
  pageSizeOptions = defaultData.pageSizeOptions;

  constructor(
    private transferGtMtService: fromService.TransferGTMTService,
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
    this.columns = defaultData.GetTransferGTMTColumns();
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
    this.transferGtMtService
      .GetTransferGTMTList(
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
    this.router.navigate(['/transaction/transfergtmt/edit/', value.autoID]);
  }

  delete(value: any) {
    this.transferGtMtService
      .deleteTransferGTMT(value.autoID)
      .subscribe((response) => {
        this.getTransferList();
      });
  }

  AddnewRecord() {
    this.router.navigate(['/transaction/transfergtmt/add']);
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

  // printTransfer(value: any) {
  //   // this.reportService
  //   //   .PrintInvoiceInventory(0, [value.autoID])
  //   //   .subscribe((response) => {
  //   //     var file = new Blob([response as Blob], { type: 'application/pdf' });
  //   //     var fileURL = URL.createObjectURL(file);
  //   //     this.dialog.open(PdfViewerDialogComponent, {
  //   //       data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
  //   //       minWidth: '80vw',
  //   //       minHeight: '90vh',
  //   //       maxWidth: '80vw',
  //   //       maxHeight: '90vh',
  //   //       autoFocus: true,
  //   //     });
  //   //   });
  // }

  // handleResponse(data: any) {
  //   var file = new Blob([data._body], { type: 'application/pdf' });
  //   var fileURL = URL.createObjectURL(file);
  //   window.open(fileURL);
  // }
}
