import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  FilterValues,
  PaginationHeaders,
  CreditNote,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
})
export class CreditNoteComponent implements OnInit {
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
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'billDate';
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
                description: 'Are you sure you want to Delete this Credit Note.',
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