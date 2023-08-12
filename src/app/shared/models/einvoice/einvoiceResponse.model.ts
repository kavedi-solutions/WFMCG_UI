export interface eInvoiceFilter {
  transactionTypeID: number;
  bookAccountID: number;
  FromDate: string;
  ToDate: string;
}

export interface eInvoiceResponse {
  autoID: number;
  refNo: string;
  billDate: string;
  accountName: string;
  amount: number;
  status: string;
  buyersError: string;
  itemsError: string;
}
