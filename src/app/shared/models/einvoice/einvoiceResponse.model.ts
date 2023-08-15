export interface eInvoiceFilter {
  transactionTypeID: number;
  bookAccountID: number;
  fromDate: string;
  toDate: string;
  eistatus: boolean;
}

export interface eInvoiceResponse {
  autoID: number;
  refNo: string;
  billDate: string;
  accountName: string;
  amount: number;
  status?: string;
  irnNo?: string;
  isRequested: boolean;
  buyersError: string;
  itemsError: string;
  eiErrorDetails: string;
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

export interface eI_CancelRequest {
  autoID: number;
  irnNo: string;
  transactionType: number;
  eICancelReason: string;
  eICancelRemark: string;
  status: string;
  error: string;
}
