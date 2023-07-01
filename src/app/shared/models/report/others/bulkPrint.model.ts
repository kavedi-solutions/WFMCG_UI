export interface BulkPrintFilter {
  transactionTypeID: number;
  bookAccountID: number;
  FromDate: string;
  ToDate: string;
}

export interface BulkPrintResponse {
  autoID: number;
  refNo: string;
  billDate: string;
  accountName: string;
  amount: number;
}
