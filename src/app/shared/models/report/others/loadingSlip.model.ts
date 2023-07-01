export interface LoadingSlipInvoiceFilter {
  bookAccountID: Number;
  fromDate: string;
  toDate: string;
}

export interface LodingSlipFilter {
    fromDate: string;
    toDate: string;
    printInvoiceList: boolean;
    headFilter: HeadFiltersDetail[];
}

export interface HeadFiltersDetail {
    bookAccountID: Number;
    bookAccountName: string;
    fromBillNo: Number;
    toBillNo: Number;
}