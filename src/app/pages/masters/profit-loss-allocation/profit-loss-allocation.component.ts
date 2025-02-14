import { Component, OnInit } from '@angular/core';
import {
  AccessRights,
  Group,
  FilterValues,
  PaginationHeaders,
} from 'src/app/shared';
import * as fromService from '../../../shared/index';
import * as defaultData from '../../../data/index';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { funSortingOrder } from 'src/app/shared/functions';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';

@Component({
  selector: 'app-profit-loss-allocation',
  templateUrl: './profit-loss-allocation.component.html',
  styleUrls: ['./profit-loss-allocation.component.scss'],
})
export class ProfitLossAllocationComponent implements OnInit {
  PageTitle: string = 'Profit & Loss Allocation';
  buttonText: string = 'Add New Profit & Loss Allocation';
  allocationListData: Group[] = [];
  // pagination?: PaginationHeaders = defaultData.defaultPaginationHeaders;
  // filterValues?: FilterValues[];
  // Sort?: string;
  // SearchText?: string;
  accRights?: AccessRights;
  columns: MtxGridColumn[] = [];
  // latestSortingOrder?: string;
  // latestSearchText?: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.accRights = this.route.snapshot.data['userRights'];
    this.setColumns();
  }

  ngOnInit(): void {}

  setColumns() {
    this.columns = defaultData.GetPLAllocationColumns();
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
          pop: {
            title: 'Confirm Edit',
            description: 'Are you sure you want to Edit this Allocation.',
            closeText: 'No',
            okText: 'Yes',
            okColor: 'primary',
            closeColor: 'warn',
          },
          iif: (record) => {
            return this.accRights!.canEdit;
          },
          click: (record) => this.edit(record),
        },
        {
          type: 'icon',
          icon: 'delete',
          text: 'Delete Record',
          tooltip: 'Delete Record',
          buttontype: 'button',
          pop: {
            title: 'Confirm Delete',
            description: 'Are you sure you want to Delete this Allocation.',
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
    });
  }

  AddnewRecord() {
    this.router.navigate(['/master/plallocation/add']);
  }

  edit(value: any) {
    this.router.navigate(['/master/plallocation/edit/', value.AutoID]);
  }

  delete(value: any) {
    // this.purchaseService.deletePurchase(value.autoID).subscribe((response) => {
    //   this.getPurchaseList();
    // });
  }
}
