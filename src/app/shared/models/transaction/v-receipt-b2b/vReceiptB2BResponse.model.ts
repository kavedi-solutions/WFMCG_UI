import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface VReceiptB2BPagedResponse {
  headers?: PaginationHeaders;
  body: VReceiptB2B[];
}

export interface VReceiptB2B {
  autoID: number;
  companyID: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  bookAccountID: number;
  bookAccountName?: string;
  accountID: number;
  accountName?: string;
  amount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface VReceiptB2BResponse {
  autoID: number;
  companyID: string;
  voucherType: string;
  voucherNo: number;
  refNo: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  accountID: number;
  amount: number;
  transactionNo: string;
  narration: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface VReceiptB2BPendingBillsResponse {
  autoID: number;
  salesType: string | null;
  invoiceID: number;
  companyID: string;
  billNo: number;
  refNo: string | null;
  billDate: string;
  billAmount: number;
  pendingAmount: number;
  receiveAmount: number;
}