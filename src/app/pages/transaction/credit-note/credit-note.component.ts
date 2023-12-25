import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  CreditNote,
  eI_CancelRequest,
  TransactionTypeMaster,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { CanceleInvoiceComponent, CommonDialogComponent } from '../../dialogs';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerDialogComponent } from 'src/app/theme';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
})
export class CreditNoteComponent implements OnInit {
  dialogRef: any;
  PageTitle: string = 'Credit Note';
  buttonText: string = 'Add New Credit Note';
  creditNoteListData: CreditNote[] = [];
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
    private creditNoteService: fromService.CreditNoteService,
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
    this.getCreditNoteList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetCNDNColumns();
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
                description: 'Are you sure you want to Edit this Credit Note.',
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
                description: 'Are you sure you want to Delete this Credit Note.',
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
              text: 'Print Credit Note',
              tooltip: 'Print Credit Note',
              buttontype: 'button',
              pop: {
                title: 'Confirm Print',
                description:
                  'Are you sure you want to Print this Credit Note.',
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

  getCreditNoteList() {
    this.creditNoteService
      .GetCreditNoteList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.creditNoteListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/transaction/credit-note/edit/', value.autoID]);
  }

  delete(value: any) {
    this.creditNoteService
      .deleteCreditNote(value.autoID)
      .subscribe((response) => {
        this.getCreditNoteList();
      });
  }

  cancelEInvoice(value: any) {
    let eiCancelRequest: eI_CancelRequest = {
      autoID: value.autoID,
      irnNo: value.eiIrn,
      transactionType: TransactionTypeMaster.Credit_Note,
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
    this.getCreditNoteList();
  }

  printInvoice(value: any) {
    this.reportService
      .PrintInvoiceCreditNote(0, [value.autoID])
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
    this.router.navigate(['/transaction/credit-note/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getCreditNoteList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getCreditNoteList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getCreditNoteList();
  }

  onRefresh() {
    this.getCreditNoteList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getCreditNoteList();
  }
}
