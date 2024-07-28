import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import { AccessRights, FilterValues, HSNCode, PaginationHeaders } from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hsnsac',
  templateUrl: './hsnsac.component.html',
  styleUrls: ['./hsnsac.component.scss']
})
export class HSNSACComponent implements OnInit {
  PageTitle: string = 'HSN/SAC';
  buttonText: string = 'Add New HSN/SAC';
  hsnCodeListData: HSNCode[] = [];
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
    private hsnCodeService: fromService.HSNCodeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'hsN_SAC_Code';
    this.getHSNCodeList();
  }

  ngOnInit(): void {
  }

  setColumns() {
    this.columns = defaultData.GetHSNSACColumns();
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
          buttontype:'button',
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
          buttontype:'button',
          pop: {
            title: 'Confirm Deactive',
            description: 'Are you sure you want to Deactive this record.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.DeactiveHSNCode(record),
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
          buttontype:'button',
          pop: {
            title: 'Confirm Active',
            description: 'Are you sure you want to Active this record?',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          click: (record) => this.ActiveHSNCode(record),
          iif: (record) => {
            if (this.accRights!.canDelete) return !record.isActive;
            else return false;
          },
        },
      ],
    });
  }

  getHSNCodeList() {
    this.hsnCodeService
      .GetHSNCodeList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.hsnCodeListData = response.body;
        this.pagination = response.headers;
      });
  }

  edit(value: any) {
    this.router.navigate(['/master/hsnsac/edit/', value.autoID]);
  }

  DeactiveHSNCode(value: any) {
    this.hsnCodeService
      .DeactivateHSNCode(value.autoID)
      .subscribe((response) => {
        this.getHSNCodeList();
      });
  }

  ActiveHSNCode(value: any) {
    this.hsnCodeService
      .ActivateHSNCode(value.autoID)
      .subscribe((response) => {
        this.getHSNCodeList();
      });
  }

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getHSNCodeList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getHSNCodeList();
  }

  AddnewRecord() {
    this.router.navigate(['/master/hsnsac/add']);
  }

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getHSNCodeList();
  }

  onRefresh() {
    this.getHSNCodeList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getHSNCodeList();
  }

}
