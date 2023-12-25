import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  eI_CancelRequest,
  FilterValues,
  PaginationHeaders,
  SalesReturn,
  TransactionTypeMaster,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { PdfViewerDialogComponent } from 'src/app/theme';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CanceleInvoiceComponent, CommonDialogComponent } from '../../dialogs';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
})
export class SalesReturnComponent implements OnInit {
  dialogRef: any;
  PageTitle: string = 'Sales Return';
  buttonText: string = 'Add New Sales Return';
  salesListData: SalesReturn[] = [];
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
    private salesReturnService: fromService.SalesReturnService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: fromService.OthersReportService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = '-billDate';
    this.getSalesList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetSalesReturnColumns();
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
                description: 'Are you sure you want to Edit this Sales Return.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.edit(record),
              iif: (record) => {
                return this.accRights!.canEdit && record.eiStatus == false && record.eiCanceled == false;
              },
            },
            {
              text: 'Delete Record',
              tooltip: 'Delete Record',
              buttontype: 'button',
              pop: {
                title: 'Confirm Delete',
                description:
                  'Are you sure you want to Delete this Sales Return.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.delete(record),
              iif: (record) => {
                return this.accRights!.canEdit && record.eiStatus == false;
              },
            },
            {
              text: 'Cancel e-Invoice',
              tooltip: 'Cancel e-Invoice',
              buttontype: 'button',
              pop: {
                title: 'Confirm Cancel',
                description: 'Are you sure you want to Cancel this e-Invoice.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.cancelEInvoice(record),
              iif: (record) => {
                return record.eiStatus == true && record.eiCanceled == false;
              },
            },
            {
              text: 'Print Invoice',
              tooltip: 'Print Invoice',
              buttontype: 'button',
              pop: {
                title: 'Confirm Print',
                description:
                  'Are you sure you want to Print this Sales Invoice.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.printInvoice(record),
              iif: () => {
                return this.accRights!.canView;
              },
            },
          ],
        },
      ],
    });
  }

  getSalesList() {
    this.salesReturnService
      .GetSalesReturnList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.salesListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/transaction/sales-return/edit/', value.autoID]);
  }

  delete(value: any) {
    this.salesReturnService
      .deleteSalesReturn(value.autoID)
      .subscribe((response) => {
        this.getSalesList();
      });
  }

  cancelEInvoice(value: any) {
    let eiCancelRequest: eI_CancelRequest = {
      autoID: value.autoID,
      irnNo: value.eiIrn,
      transactionType: TransactionTypeMaster.Sales_Return,
      eICancelReason: '',
      eICancelRemark: '',
      status: '',
      error: '',
    };

    this.dialogRef = this.dialog.open(CanceleInvoiceComponent, {
      minWidth: '60vw',
      minHeight: '60vh',
      maxWidth: '60vw',
      maxHeight: '60vh',
      panelClass: 'dialog-container',
      autoFocus: true,
    });

    this.dialogRef.componentInstance.DialogTitle = 'Invoice : ' + value.refNo;
    this.dialogRef.componentInstance.eiCancelRequest = eiCancelRequest;
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result.CloseStatus == true) {
        this.ShowCancelMessage(result.eiCancelRequest);
      }
    });
  }

  ShowCancelMessage(eiCancelRequest: eI_CancelRequest) {
    this.dialogRef = this.dialog.open(CommonDialogComponent, {
      minWidth: '60vw',
      minHeight: '60vh',
      maxWidth: '60vw',
      maxHeight: '60vh',
      panelClass: 'dialog-container',
      autoFocus: true,
    });

    this.dialogRef.componentInstance.DialogTitle = 'e-Invoice Cancel Status';
    if (eiCancelRequest.status == 'Failed') {
      this.dialogRef.componentInstance.DialogContent = eiCancelRequest.error;
    }
    if (eiCancelRequest.status == 'Success') {
      this.dialogRef.componentInstance.DialogContent =
        'Your e-Invoice successfully to Canceled.';
    }
    this.getSalesList();
  }

  printInvoice(value: any) {
    this.reportService
      .PrintInvoiceSalesReturn(0, [value.autoID])
      .subscribe((response) => {
        var file = new Blob([response as Blob], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);

        this.dialog.open(PdfViewerDialogComponent, {
          data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
          minWidth: '80vw',
          minHeight: '90vh',
          maxWidth: '80vw',
          maxHeight: '90vh',
          autoFocus: true,
        });
      });
  }

  AddnewRecord() {
    this.router.navigate(['/transaction/sales-return/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getSalesList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getSalesList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getSalesList();
  }

  onRefresh() {
    this.getSalesList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getSalesList();
  }
}
