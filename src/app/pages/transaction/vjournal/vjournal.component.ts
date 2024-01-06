import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  VJournal,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerDialogComponent } from 'src/app/theme';

@Component({
  selector: 'app-vjournal',
  templateUrl: './vjournal.component.html',
  styleUrls: ['./vjournal.component.scss'],
})
export class VJournalComponent implements OnInit {
  PageTitle: string = 'Journal Voucher';
  buttonText: string = 'Add New Journal';
  voucherListData: VJournal[] = [];
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
    private voucherService: fromService.VJournalService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: fromService.OthersReportService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = '-voucherDate';
    this.getVoucherList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetJVColumns();
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
                description: 'Are you sure you want to Edit this Voucher.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.edit(record),
              iif: () => {
                return this.accRights!.canEdit;
              },
            },
            {
              text: 'Delete Record',
              tooltip: 'Delete Record',
              buttontype: 'button',
              pop: {
                title: 'Confirm Delete',
                description: 'Are you sure you want to Delete this Voucher.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.delete(record),
              iif: () => {
                return this.accRights!.canEdit;
              },
            },
            {
              text: 'Print Voucher',
              tooltip: 'Print Voucher',
              buttontype: 'button',
              pop: {
                title: 'Confirm Print',
                description:
                  'Are you sure you want to Print this Journal Voucher.',
                closeText: 'No',
                okText: 'Yes',
                okColor: 'primary',
                closeColor: 'warn',
              },
              click: (record) => this.printVoucher(record),
              iif: () => {
                return this.accRights!.canView;
              },
            },
          ],
        },
      ],
    });
  }

  getVoucherList() {
    this.voucherService
      .GetVJournalList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.voucherListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/transaction/v-journal/edit/', value.autoID]);
  }

  delete(value: any) {
    this.voucherService.deleteVJournal(value.autoID).subscribe((response) => {
      this.getVoucherList();
    });
  }

  printVoucher(value: any) {
    this.reportService
      .PrintJVouchers(0, [value.autoID])
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
    this.router.navigate(['/transaction/v-journal/add']);
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getVoucherList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getVoucherList();
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getVoucherList();
  }

  onRefresh() {
    this.getVoucherList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getVoucherList();
  }
}
