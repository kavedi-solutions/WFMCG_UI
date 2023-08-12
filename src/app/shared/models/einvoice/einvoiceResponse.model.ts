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
  status?: string;
  isRequested: boolean;
  buyersError: string;
  itemsError: string;
}

export interface e_InvoiceRequest {
  transactionType: number;
  companyError: string;
  requestDetails: e_InvoiceRequestDetails[];
}

export interface e_InvoiceRequestDetails {
  autoID: number;
  irnNo: string;
  status?: string;
  buyersError: string;
  itemsError: string;
}
