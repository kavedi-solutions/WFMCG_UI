import { Component, OnInit } from '@angular/core';
import { Tax, PaginationHeaders, FilterValues, AccessRights } from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
})
export class TaxComponent implements OnInit {
  PageTitle: string = 'Tax';
  buttonText: string = 'Add New Tax';
  taxListData: Tax[] = [];
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
    private taxService: fromService.TaxService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.latestSearchText = '';
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
    this.latestSortingOrder = 'totalTaxRate';
    this.getTaxList();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetTaxColumns();
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
          buttontype:'button',
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

  getTaxList() {
    this.taxService
      .GetTaxList(
        this.pagination!,
        this.latestSortingOrder!,
        this.latestSearchText!,
        this.filterValues!
      )
      .subscribe((response) => {
        this.taxListData = response.body;
        this.pagination = response.headers;
      });
  }  

  edit(value: any) {
    this.router.navigate(['/master/tax/edit/', value.taxID]);    
  }

  DeactiveArea(value: any) {
    this.taxService.DeactivateTax(value.taxID).subscribe((response) => {
      this.getTaxList();
    });
  }

  ActiveArea(value: any) {
    this.taxService.ActivateTax(value.taxID).subscribe((response) => {
      this.getTaxList();
    });
  }  

  changeSelect(e: any) {
    console.log(e);
  }

  changeSort(event: any) {
    this.latestSortingOrder = '';
    this.pagination!.page = 0;
    this.latestSortingOrder = funSortingOrder(event, this.latestSortingOrder);
    this.getTaxList();
  }

  getNextPage(e: PageEvent) {
    this.pagination!.page = e.pageIndex;
    this.pagination!.pageSize = e.pageSize;
    this.pagination!.recordCount = e.length;
    this.getTaxList();
  }

  AddnewRecord() {
    this.router.navigate(['/master/tax/add']);
  }  

  onSearch($event: any) {
    this.latestSearchText = '';
    if (this.pagination) {
      this.pagination.page = 0;
    }
    this.latestSearchText = $event.searchText;
    this.getTaxList();
  }

  onRefresh() {
    this.getTaxList();
  }

  onStatusFilter($event: any) {
    this.filterValues = [];
    if ($event.title == 'IsActive' && $event.selectedValue != '') {
      this.filterValues!.push({
        title: $event.title,
        value: $event.selectedValue,
      });
    }
    this.getTaxList();
  }

}
