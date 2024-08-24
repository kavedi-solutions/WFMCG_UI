import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  ItemFilter_DropDownReport,
  itemsDropDownResponse,
  returnTypeResponse,
  StockLedgerFilter,
} from 'src/app/shared';
import * as moment from 'moment';
import * as fromService from '../../../../shared/index';
import { PdfViewerDialogComponent } from 'src/app/theme';
import { GetFinYearStartDate } from 'src/app/shared/functions';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stock-ledger',
  templateUrl: './stock-ledger.component.html',
  styleUrls: ['./stock-ledger.component.scss'],
})
export class StockLedgerComponent implements OnInit {
  PageTitle: string = 'Stock Ledger';
  FromMinDate?: Date;
  FromMaxDate?: Date;
  ToMinDate?: Date;
  ToMaxDate?: Date;
  returnTypeDropDown: returnTypeResponse[] = [];
  itemsDropDown: itemsDropDownResponse[] = [];
  filtereditemsDropDown?: Observable<itemsDropDownResponse[]>;

  stockLedgerForm = this.fb.group({
    ReturnTypeID: ['', Validators.required],
    FromDate: ['', [Validators.required]],
    ToDate: ['', [Validators.required]],
    ItemID: ['', [Validators.required]],
  });

  @ViewChild('AutoItemID') AutoItemID?: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    private stockService: fromService.ReportStocksService,
    private sessionService: fromService.LocalStorageService,
    private commonService: fromService.CommonService,
    private itemService: fromService.ItemService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
  ) {
    this.SetMinMaxFromDate();
    this.SetMinMaxToDate();
    this.FillReturnTypeDropDown();
    this.FillItemDropDown();
  }

  ngOnInit(): void {
    this.filtereditemsDropDown = this.ItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterItems(name as string)
          : this.itemsDropDown.slice();
      })
    );
  }

  SetMinMaxFromDate() {
    const currentYear = new Date().getFullYear();
    this.FromMinDate = new Date(currentYear - 20, 0, 1);
    this.FromMaxDate = new Date();
    this.FromDateControl.setValue(
      moment(
        GetFinYearStartDate(
          new Date(),
          Number(this.sessionService.get('FinYearStartMonth'))
        )
      )
    );
  }

  SetMinMaxToDate() {
    const currentYear = new Date().getFullYear();
    this.ToMinDate = new Date(currentYear - 20, 0, 1);
    this.ToMaxDate = new Date();
    this.ToDateControl.setValue(moment(new Date()));
  }

  FromDateChange() {
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.ToMinDate = FromDate;
  }

  ToDateChange() {
    let ToDate = this.ToDateControl.value.format('YYYY-MM-DD');
    let FromDate = this.FromDateControl.value.format('YYYY-MM-DD');
    this.FromMaxDate = ToDate;
    if (FromDate > ToDate) this.FromDateControl.setValue(moment(ToDate));
  }

  FillItemDropDown() {
    let filters: ItemFilter_DropDownReport = {
      ItemType: 1,
      TransactionTypeID: 0,
    };
    this.itemService.ItemDropDownReport(filters).subscribe((response) => {
      this.itemsDropDown = response;
      this.ItemIDControl.setValue('');
    });
  }

  FillReturnTypeDropDown() {
    this.returnTypeDropDown = [];
    this.commonService
      .ReutnTypeDropDown()
      .subscribe((response: returnTypeResponse[]) => {
        this.returnTypeDropDown = response;
        this.ReturnTypeIDControl.setValue(
          this.returnTypeDropDown[0].returnTypeID.toString()
        );
      });
  }

  private _filterItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.itemsDropDown.filter((option) =>
      option.item_Name.toLowerCase().includes(filterValue)
    );
  }

  DisplayItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  GenerateStatement() {
    let filter: StockLedgerFilter = {
      returnTypeID: this.ReturnTypeIDControl.value,
      fromDate: this.FromDateControl.value.format('YYYY-MM-DD'),
      toDate: this.ToDateControl.value.format('YYYY-MM-DD'),
      itemID: Number(this.ItemIDControl.value.item_Id)
    };
    this.stockService.PrintStockLedger(filter).subscribe((response) => {
      var file = new Blob([response as Blob], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      this.dialog.open(PdfViewerDialogComponent, {
        data: this.sanitizer.bypassSecurityTrustResourceUrl(fileURL),
        minWidth: '80vw',
        minHeight: '90vh',
        maxWidth: '80vw',
        maxHeight: '90vh',
        panelClass: 'dialog-container',
        autoFocus: true,
      });
    });
  }

  get ReturnTypeIDControl() {
    return this.stockLedgerForm.get('ReturnTypeID') as FormControl;
  }

  get FromDateControl() {
    return this.stockLedgerForm.get('FromDate') as FormControl;
  }

  get ToDateControl() {
    return this.stockLedgerForm.get('ToDate') as FormControl;
  }

  get ItemIDControl() {
    return this.stockLedgerForm.get('ItemID') as FormControl;
  }
}
